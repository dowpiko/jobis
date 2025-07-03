package org.jobis.websocket;

import java.io.IOException;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@ServerEndpoint(value = "/ws/interview", configurator = CustomSpringConfigurator.class)
@Component
public class InterviewSocket {
	
	private Session session;
	@Autowired
	private InterviewService interviewService;
	
	@OnOpen
	public void onOpen(Session session) {
		this.session = session;
		System.out.println("WebSocket 연결됨 : " + session.getId());
	}
	
	@OnMessage
	public void onMesssage(String message) throws IOException{
		System.out.println("수신 메시지 : " + message);
		String response = interviewService.generateAnswer(message);
		session.getBasicRemote().sendText(response);
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
