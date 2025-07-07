package org.jobis.websocket;

import java.io.IOException;

import javax.servlet.http.HttpSession;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.service.AiService;
import org.jobis.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@ServerEndpoint(value = "/ws/interview", configurator = CustomSpringConfigurator.class)
@Component
public class InterviewSocket {
	
	private Session session;
	
	@Autowired
	private AiService aiService;
	
	@Autowired InterviewService interviewService;
	
	@OnOpen
	public void onOpen(Session session) {
		this.session = session;
		System.out.println("WebSocket 연결됨 : " + session.getId());
	}
	
	@OnMessage
	public void onMessage(String jsonString) throws IOException{
		System.out.println("수신 메시지 : " + jsonString);
		HttpSession httpSession = (HttpSession) session.getUserProperties().get(HttpSession.class.getName());
		interviewService.saveCurrentStates(session, jsonString);
		aiService.streamResultAsync(
				jsonString,
				chunk ->{
					try {
						session.getBasicRemote().sendText(chunk);
					} catch (Exception e) {
						e.printStackTrace();
					}
				},
				() -> {
					try {
						session.getBasicRemote().sendText("[DONE]");
					} catch (Exception e2) {
						e2.printStackTrace();
					}
				}
				);
		
	}
	
	@OnClose
	public void onClose(Session session, CloseReason reason) {
		System.out.println("WebSocket 종료 : "+session.getId()+", 사유 : "+reason);
	}
	
	@OnError
	public void onError(Session session, Throwable throwable) {
		System.err.println("Websocket 오류 : "+throwable.getMessage());
	}
}
