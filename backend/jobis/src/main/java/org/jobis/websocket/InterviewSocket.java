package org.jobis.websocket;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpSession;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.domain.AIContextDTO;
import org.jobis.service.AiService;
import org.jobis.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@ServerEndpoint(value = "/ws/interview", configurator = CustomSpringConfigurator.class)
@Component
public class InterviewSocket {
	
	private Session session;
	
	@Autowired
	private AiService aiService;
	
	@Autowired InterviewService interviewService;
	
	private static final ObjectMapper MAPPER = new ObjectMapper();
	
	@OnOpen
	public void onOpen(Session session) {
		this.session = session;
		System.out.println("WebSocket 연결됨 : " + session.getId());
	}
	
	@OnMessage
	public void onMessage(String jsonString) throws IOException{
		HttpSession httpSession = (HttpSession) session.getUserProperties().get(HttpSession.class.getName());
		
	    // 🔍 종료 요청인지 확인
	    JsonNode node = MAPPER.readTree(jsonString);
	    if (node.has("type") && "terminate".equals(node.get("type").asText())) {
	        System.out.println("🧹 종료 요청 수신 → 세션 종료 중...");
	        session.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "사용자 종료 요청"));
	        return;
	    }
	    
		interviewService.saveCurrentStates(session, jsonString);
		String prompt = interviewService.getPrompt(httpSession, session);
		aiService.streamResultAsync(
				prompt,
				chunk -> {
					try {
						if (session.isOpen()) {
							session.getBasicRemote().sendText(chunk);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				},
				() -> {
					try {
						if (session.isOpen()) {
							session.getBasicRemote().sendText("[DONE]");
						}
					} catch (Exception e2) {
						e2.printStackTrace();
					}
				}
				);
		
	}
	
	@SuppressWarnings("unchecked")
	@OnClose
	public void onClose(Session session, CloseReason reason) {
	    System.out.println("WebSocket 종료 : " + session.getId() + ", 사유 : " + reason);
	    
	    HttpSession httpSession = (HttpSession) session.getUserProperties().get(HttpSession.class.getName());
	    List<AIContextDTO> contexts = (List<AIContextDTO>) session.getUserProperties().get("contexts");
	    if (httpSession != null && contexts != null) {
	        httpSession.setAttribute("finalContexts", contexts);
	    }
	}
	
	@OnError
	public void onError(Session session, Throwable throwable) {
		System.err.println("Websocket 오류 : "+throwable.getMessage());
	}
}
