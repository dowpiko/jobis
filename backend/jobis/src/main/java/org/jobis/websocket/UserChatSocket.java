package org.jobis.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.springframework.stereotype.Component;



@ServerEndpoint(value = "/ws/userChat", configurator = CustomSpringConfigurator.class)
@Component
public class UserChatSocket {
	
	
    private static final Set<Session> sessions = new CopyOnWriteArraySet<>();
    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("✅ 채팅 소켓 연결됨: " + session.getId());
        System.out.println("현재 접속자 수: " + sessions.size());
    }
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("📨 받은 메시지: " + message);
        for (Session s : sessions) {
            if (s.isOpen()) {
                s.getBasicRemote().sendText(message);  // 단순 브로드캐스트
            }
        }
    }
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session);
        System.out.println("❌ 채팅 소켓 연결 종료: " + session.getId() + " | 이유: " + reason);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("⚠️ 채팅 소켓 오류: " + throwable.getMessage());
    }


}
