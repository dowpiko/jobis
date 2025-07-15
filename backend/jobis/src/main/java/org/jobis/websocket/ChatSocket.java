package org.jobis.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import org.jobis.config.CustomSpringConfigurator;
import org.jobis.service.UserChatService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@ServerEndpoint(value = "/ws/userChat", configurator = CustomSpringConfigurator.class)
@Component
public class ChatSocket {

    @Autowired
    UserChatService ucService;

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
            JSONObject json = new JSONObject(message);
            String type = json.optString("type", "CHAT");

            if ("ENTER_ROOM".equals(type)) {
                int uno = json.getInt("uno");
                int rno = json.getInt("rno");
                System.out.println(json.getInt("rno"));
                session.getUserProperties().put("uno", uno);
                session.getUserProperties().put("currentRno", rno);
                System.out.println("🚪 사용자 입장 기록: uno=" + uno + ", rno=" + rno);
                return;  // ✅ 여기서 return으로 이후 코드 건너뜀
            }

            // ✅ "ENTER_ROOM"이 아닌 경우에만 leader 관련 로직 실행
            if (!json.has("leader")) {
                System.err.println("⚠️ 'leader' 필드가 없는 일반 메시지. 무시됨");
                return;
            }

            // 💬 일반 메시지 처리
            int leaderUno = json.getInt("leader");
            int rno = json.getInt("rno");

            String leaderName = ucService.getOtherNameByUno(leaderUno).getName();
            json.put("leader_name", leaderName);

            boolean isOpponentInRoom = sessions.stream().anyMatch(s -> {
                if (!s.isOpen()) return false;
                Integer currentRno = (Integer) s.getUserProperties().get("currentRno");
                Integer sessionUno = (Integer) s.getUserProperties().get("uno");

                return sessionUno != null && sessionUno != leaderUno &&
                       currentRno != null && currentRno == rno;
            });

            json.put("hit", isOpponentInRoom ? 0 : 1);
            System.out.println("📤 브로드캐스트 메시지: " + json.toString());
            for (Session s : sessions) {
                if (s.isOpen()) {
                    s.getBasicRemote().sendText(json.toString());
                }
            }

        } catch (Exception e) {
            System.err.println("⚠️ 메시지 처리 중 오류: " + e.getMessage());
            e.printStackTrace();
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
        throwable.printStackTrace();
    }
}
