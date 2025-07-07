package org.jobis.websocket;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.domain.CJSVO;
import org.jobis.service.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;


@ServerEndpoint(value = "/ws/userChat", configurator = CustomSpringConfigurator.class)
@Component
public class UserChatSocket {
	@Autowired
	private UserChatService ucservice;
	
    private static final Set<Session> sessions = new CopyOnWriteArraySet<>();
    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        System.out.println("✅ 채팅 소켓 연결됨: " + session.getId());
    }
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        System.out.println("📨 받은 메시지: " + message);
        try {
            ObjectMapper mapper = new ObjectMapper();
            CJSVO cjsvo = mapper.readValue(message, CJSVO.class);

            // 사용자 정보 추출 (예: HttpSession에서 가져올 수 없는 경우 토큰 등 활용)
            // 여기서는 예시로 leader를 999로 고정
            cjsvo.setLeader(999);

            int result = ucservice.register(cjsvo); // DB 저장
            if (result > 0) {
                // 저장된 cno를 다시 가져오려면 getUserChat()에서 마지막 값 추출 가능
                List<CJSVO> updatedList = ucservice.getUserChat();
                CJSVO saved = updatedList.get(0); // reverse 되어 있으니 가장 최근 값

                String payload = mapper.writeValueAsString(saved);
                for (Session s : sessions) {
                    if (s.isOpen()) {
                        s.getBasicRemote().sendText(payload);
                    }
                }
            }
        } catch (Exception e) {
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
