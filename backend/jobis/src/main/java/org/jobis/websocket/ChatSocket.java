package org.jobis.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.domain.CJSVO;
import org.jobis.service.UserChatService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;



@ServerEndpoint(value = "/ws/userChat", configurator = CustomSpringConfigurator.class)
@Component
public class ChatSocket {
	
	@Autowired UserChatService ucService;
	
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
        
        try {
            // 1️⃣ 메시지 파싱
            JSONObject json = new JSONObject(message);
            int leaderUno = json.getInt("leader");

            // 2️⃣ 이름 조회
            String leaderName = ucService.getOtherNameByUno(leaderUno).getName();

            // 3️⃣ 이름 추가
            json.put("leader_name", leaderName);

            // 4️⃣ 전체 브로드캐스트
            for (Session s : sessions) {
                if (s.isOpen()) {
                    s.getBasicRemote().sendText(json.toString());
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ 메시지 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
        }     
//        for (Session s : sessions) {
//            if (s.isOpen()) {
//                s.getBasicRemote().sendText(message);  // 단순 브로드캐스트
//            }
//        }
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
