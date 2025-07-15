package org.jobis.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.SmMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
public class SmServiceImple implements SmService {

    @Value("${key.compInfo}")
    private String compInfoKey;
    
    @Autowired
    private SmMapper mapper;
    
    // 아이디 중복확인
    @Override
    public int findUserId(String id) {
    	return mapper.findUserId(id) == 0 ? 0 : 1;
    }
    
    // 기업 불러오기
    @Override
    public ResponseEntity<String> findCompany(String crno) {
        try {
            // ✅ 파라미터 인코딩
            String encodedKey = URLEncoder.encode(compInfoKey, StandardCharsets.UTF_8.toString());

            // ✅ 최종 요청 URL
            String fullUrl = "http://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2"
                    + "?serviceKey=" + encodedKey
                    + "&pageNo=1"
                    + "&numOfRows=1"
                    + "&resultType=json"
                    + "&crno=" + crno;

            URI uri = URI.create(fullUrl);

            // ✅ 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("Accept-Charset", "UTF-8");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // ✅ RestTemplate 요청 (문자열로 받기)
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String json = response.getBody();

            // ✅ JSON 파싱 (Map 형태로 확인)
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parsed = objectMapper.readValue(json, Map.class);

            // ✅ UTF-8 Content-Type 명시하여 응답
            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8").body(json);

        } catch (Exception e) {
            String errorJson = "{\"error\": \"API 호출 실패: " + e.getMessage() + "\"}";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8")
                    .body(errorJson);
        }
    };
    
    // 기업 회원가입
    @Override
    @Transactional
    public int insertCUser(CUserVO cuvo) {
    	return mapper.insertCUser(cuvo);
    };
    
    /* ----------------------------------------------------------------------------------- */
    
	// 면접 공고 등록    
    @Override
    public int insertInterView(InterViewBCVO ivbc) {
    	return mapper.insertInterView(ivbc);
    }
    
    @Override
    public List<InterViewBCVO> progress(int check, int uno) {
        Map<String, Object> param = new HashMap<>();
        param.put("check", check);
        param.put("uno", uno);

        return mapper.progress(param);
    }
    
    // 공고 지원한 사람 데이터
    public List<UserVO> selectByOno(int ono) {
    	return mapper.selectByOno(ono);
    }
    
    // 공고 삭제
    @Transactional
    @Override
    public int deleteByOno(List<Integer> onoList) {
    	return mapper.deleteByOno(onoList);
    }
    
    // 해당 공고 가져오기
    @Override
    public InterViewBCVO oneInterViewByOno(int ono) {
    	return mapper.oneInterViewByOno(ono);
    }
    
    /* ----------------------------------------------------------------------------------- */
    
    // 채팅방 생성
    @Override
    @Transactional
    public int insertChatRoom(int cno, int uno, int ono) {
    	CompanyRoomDTO crvo = new CompanyRoomDTO();
    	crvo.setCompany(cno);
    	crvo.setEmp(uno);
    	crvo.setOno(ono);
    	
    	return mapper.insertChatRoom(crvo) > 0 ? 1 : -1;
    }
    
    // 기업이 채팅방 가져오기
    @Override
    public List<CompanyRoomDTO> initCompanyChatLayout(int cno) {
    	List<CompanyRoomDTO> result = mapper.initCompanyChatLayout(cno);
    	System.out.println(result);
    	return result;
    }
    
    // 유저가 채팅방 가져오기
    @Override
    public List<UserRoomDTO> initUserChatLayout(int uno) {
    	return mapper.initUserChatLayout(uno);
    }
    
    // 공고 답변, 질문 가져오기
    @Override
    public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company) {
        InterViewBCVO ibcvo = new InterViewBCVO();
        ibcvo.setOno(ono);
        ibcvo.setUno(emp);
        ibcvo.setCompany(company);
        
        OfferSubmissionDTO offer = mapper.selectOffer(ibcvo);
        OfferSubmissionDTO submission = mapper.selectSubmission(ibcvo);

        OfferSubmissionDTO result = new OfferSubmissionDTO();

        if (offer != null) {
            result.setO_title(offer.getO_title());
            result.setO_tag(offer.getO_tag());
            result.setO_content(offer.getO_content());
            result.setO_regdate(offer.getO_regdate());
        }

        if (submission != null) {
            result.setUser_content(submission.getUser_content());
            result.setUser_regdate(submission.getUser_regdate());
            result.setRno(submission.getRno());
        }

        return result;
    }
    
    // 채팅 저장
    @Override
    public int insertChatMessage(ChatMessageVO message) {
    	return mapper.insertChatMessage(message);
    }
    
    // 채팅 불러오기
    @Transactional
    @Override
    public List<ChatMessageVO> selectByRnoChatMessages(int rno, int uno) {
    	mapper.updateChatHit(Map.of("rno", rno, "uno", uno));
        return mapper.selectByRnoChatMessages(rno);
    }
    
    // 기업 데이터 가져오기
    @Override
    public CUserVO selectCinofoByUno(int uno) {
    	return mapper.selectCinofoByUno(uno);
    }
}