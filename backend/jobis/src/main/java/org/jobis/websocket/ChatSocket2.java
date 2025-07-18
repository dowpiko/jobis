package org.jobis.websocket;

import java.io.IOException;
import java.text.SimpleDateFormat;
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

@ServerEndpoint(value = "/ws/userChat2", configurator = CustomSpringConfigurator.class)
@Component
public class ChatSocket2 {

    private static ChatSocket2 instance;

    public ChatSocket2() {
        instance = this;
    }

    public static ChatSocket2 getInstance() {
        return instance;
    }

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

            // leader 필드 없으면 무시 (유효성 체크용)
            if (!json.has("leader")) {
                System.err.println("⚠️ 'leader' 필드가 없는 메시지. 무시됨");
                return;
            }

            int leaderUno = json.getInt("leader");
            String leaderName = ucService.getOtherNameByUno(leaderUno).getName();
            json.put("leader_name", leaderName);

            System.out.println("📤 브로드캐스트 메시지: " + json.toString());
            for (Session s : sessions) {
                if (!s.isOpen()) continue;
                s.getBasicRemote().sendText(json.toString());
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

    public void broadcastChatRoom(CJSVO chat) {
    	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");    	
        try {
            JSONObject json = new JSONObject();
            json.put("cno", chat.getCno());
            json.put("r_title", chat.getR_title());
            json.put("r_tag", chat.getR_tag());
            json.put("leader", chat.getLeader());
            json.put("leader_name", ucService.getOtherNameByUno(chat.getLeader()).getName());
            json.put("sch_date", chat.getSch_date());
            json.put("r_regdate", sdf.format(chat.getR_regdate()));
            System.out.println("json 입니다."+json.toString());
            for (Session s : sessions) {
                if (s.isOpen()) {
                    s.getBasicRemote().sendText(json.toString());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
