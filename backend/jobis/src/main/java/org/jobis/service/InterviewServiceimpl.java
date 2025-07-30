package org.jobis.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import org.jobis.domain.AIContextDTO;
import org.jobis.domain.AIMessageDTO;
import org.jobis.domain.AISurveyDTO;
import org.jobis.domain.AIVO;
import org.jobis.domain.InterviewResultDTO;
import org.jobis.domain.UserVO;
import org.jobis.generators.FeedbackPromptGenerator;
import org.jobis.generators.PromptGenerator;
import org.jobis.generators.QuestionPromptGenerator;
import org.jobis.generators.ResultPromptGenerator;
import org.jobis.mapper.AIMapper;
import org.jobis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.log4j.Log4j;

@Log4j
@SuppressWarnings("unchecked")
@Service
public class InterviewServiceimpl implements InterviewService{	
	
	private static final ObjectMapper oMapper = new ObjectMapper();
	
	@Autowired
	private AIMapper aiMapper;
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private AiService aiService;
	
	@Override
	public String getPrompt(HttpSession httpSession, Session session) {
		int count = (
				(AIMessageDTO)
				session
				.getUserProperties()
				.get("AIMessageDTO")
				)
				.getCount();
		AISurveyDTO asDTO = (AISurveyDTO)httpSession.getAttribute("survey");
		List<AIContextDTO> contexts = (List<AIContextDTO>)session.getUserProperties().get("contexts");
		
		PromptGenerator gen = null;
		if(count<11) {
			gen = new QuestionPromptGenerator(count, asDTO, contexts);
		}else {
			gen = new ResultPromptGenerator(asDTO, contexts); 
		}
		return gen.generatePrompt();
	}
	
	@Override
	public void saveCurrentStates(Session session, String jsonString) {
		try {
			AIMessageDTO amDTOCurr = oMapper.readValue(jsonString, AIMessageDTO.class);
			Map<String, Object> userProps = session.getUserProperties();
			
			if(amDTOCurr.getCount()>1) {
				List<AIContextDTO> contexts;
				Object raw = userProps.get("contexts");
				if (raw instanceof List<?>) {
					contexts = new ArrayList<>((List<AIContextDTO>) raw);
				}else {
					contexts = new ArrayList<AIContextDTO>();
				}
				contexts.add(
						new AIContextDTO(
								amDTOCurr.getCount()-1, 
								amDTOCurr.getPreviousQuestion(), 
								amDTOCurr.getStandards(), 
								amDTOCurr.getUserMessage())
						);
				userProps.put("contexts", contexts);
			}
			userProps.put("AIMessageDTO", amDTOCurr);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public int handleResultData(List<InterviewResultDTO> resultList, HttpSession session) {
		List<AIContextDTO> contexts = (List<AIContextDTO>)session.getAttribute("finalContexts");
		String resultScore = getResultScoreString(resultList);
		AISurveyDTO sDTO = (AISurveyDTO)session.getAttribute("survey");
		String aTitle = generateUniqueTitle(sDTO.getTitle());
		
		String aContent;
		try {
		    aContent = oMapper.writeValueAsString(contexts);
		} catch (JsonProcessingException e) {
		    log.error("컨텍스트 JSON 직렬화 실패", e);
		    aContent = "[]"; // 기본값 처리
		}
		UserVO User = (UserVO) session.getAttribute("User");
		long uno = User.getUno();
		
		AIVO aVO = new AIVO(null, uno, aTitle, sDTO.getSubCategory(), aContent, null, resultScore, null);
		int insertResult = aiMapper.insertData(aVO);

		userMapper.updateLastTryDate(uno);
		updateUserSession(session);
		return insertResult;
	}
	
	@Override
	public List<AIVO> getAllResults(int uno) {
		List<AIVO> test = aiMapper.getAllByUno(uno);
		log.warn(test);
		return test;
	}
	
	@Override
	public String getFeedbackFromAI(int ano, HttpSession session) {
		AIVO aVO = aiMapper.getDataByAno(ano);
		PromptGenerator gen = new FeedbackPromptGenerator(aVO);
		String prompt = gen.generatePrompt();
		String result = aiService.getResultSync(prompt);

		// 🔧 JSON 보정
		String sanitized = fixJsonIfNeeded(result);

		aVO.setFeedback(sanitized);
		System.out.println("✅ 보정된 결과 저장: " + sanitized);
		String resultReturn =aiMapper.updateFeedback(aVO) >= 1 ? sanitized : "DB 업데이트 오류";
		UserVO user = (UserVO)session.getAttribute("User");
		if(user.getSubscribe()!=1) {
			if(userMapper.updateSubscribe(user.getUno(), 2)>0)
				updateUserSession(session);
		}
		return resultReturn;
	}
	
	@Override
	public boolean updateLastTryDate(int uno, HttpSession session) {
		boolean result = userMapper.updateLastTryDate(uno)>0;
		updateUserSession(session);
		return result;
	}
	
	public void updateUserSession(HttpSession session) {
		UserVO user = (UserVO)session.getAttribute("User");
		int uno = user.getUno();
		user = userMapper.getUserByUno(uno);
		session.setAttribute("User", user);
	}
	//------------------헬퍼 함수----------------
	// json 점수 데이터의 평균을 계산하고 문자열로 변환
	private static String getResultScoreString(List<InterviewResultDTO> resultList) {
	    Map<String, List<Integer>> scoreMap = new HashMap<>();

	    // 기준 a~e 초기화
	    for (char c = 'a'; c <= 'e'; c++) {
	        scoreMap.put(String.valueOf(c), new ArrayList<>());
	    }

	    // 입력 리스트 순회하며 각 기준에 점수 누적
	    for (InterviewResultDTO dto : resultList) {
	        List<String> standards = dto.getStandards();
	        List<Integer> scores = dto.getScore();

	        for (int i = 0; i < standards.size(); i++) {
	            String standard = standards.get(i);
	            int score = scores.get(i);
	            scoreMap.get(standard).add(score);
	        }
	    }

	    // 평균 계산 후 결과 문자열 생성
	    List<String> averageScoreList = new ArrayList<>();
	    for (char c = 'a'; c <= 'e'; c++) {
	        List<Integer> scores = scoreMap.get(String.valueOf(c));
	        int avg = scores.isEmpty() ? 0 : (int) scores.stream().mapToInt(Integer::intValue).average().orElse(0);
	        averageScoreList.add(String.valueOf(avg));
	    }

	    return String.join(",", averageScoreList);
	}
	
	// db에 동일한 이름 존재시 이름에 넘버링을 붙여서 반환하는 함수
	private String generateUniqueTitle(String baseTitle) {
	    List<String> similarTitles = aiMapper.selectSimilarTitles(baseTitle);

	    boolean hasOriginal = false;
	    int maxNumber = 0; // 초기값 0 → 최소 번호는 (1)부터 시작

	    Pattern pattern = Pattern.compile(Pattern.quote(baseTitle) + " \\((\\d+)\\)");

	    for (String title : similarTitles) {
	        if (title.equals(baseTitle)) {
	            hasOriginal = true;
	        } else {
	            Matcher matcher = pattern.matcher(title);
	            if (matcher.matches()) {
	                int number = Integer.parseInt(matcher.group(1));
	                maxNumber = Math.max(maxNumber, number);
	            }
	        }
	    }

	    if (!hasOriginal && maxNumber == 0) {
	        // 아무 제목도 없으면 기본 제목 반환
	        return baseTitle;
	    }

	    return baseTitle + " (" + (maxNumber + 1) + ")";
	}
	private String fixJsonIfNeeded(String json) {
		if (json == null) return null;


		try {
			oMapper.readTree(json); // 정상 JSON이면 그대로 반환
			return json;
		} catch (Exception e) {
			// 혹시 중괄호 하나 빠졌나? 보정 시도
			String fixed = json.trim() + "}";
			try {
				oMapper.readTree(fixed); // 보정한 게 파싱 되면 성공
				System.out.println("⚠️ JSON 끝 중괄호 보정됨");
				return fixed;
			} catch (Exception ex) {
				System.err.println("❌ JSON 보정 실패 → 원본 유지");
				return json; // 또는 return null;
			}
		}
	}
}
