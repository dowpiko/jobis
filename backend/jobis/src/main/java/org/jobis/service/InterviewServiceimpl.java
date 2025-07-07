package org.jobis.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import org.jobis.domain.AIContextDTO;
import org.jobis.domain.AIMessageDTO;
import org.jobis.domain.AISurveyDTO;
import org.jobis.generators.PromptGenerator;
import org.jobis.generators.QuestionPromptGenerator;
import org.jobis.generators.ResultPromptGenerator;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InterviewServiceimpl implements InterviewService{	
	
	private static final ObjectMapper mapper = new ObjectMapper();
	
	@SuppressWarnings("unchecked")
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
	
	@SuppressWarnings("unchecked")
	@Override
	public void saveCurrentStates(Session session, String jsonString) {
		try {
			AIMessageDTO amDTOCurr = mapper.readValue(jsonString, AIMessageDTO.class);
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
}
