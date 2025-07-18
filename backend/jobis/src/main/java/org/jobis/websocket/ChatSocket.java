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

	 private static ChatSocket instance;

	    public ChatSocket() {
	        instance = this;
	    }

	    public static ChatSocket getInstance() {
	        return instance;
	    }
	
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
            JSONObject json = new JSONObject(message);
            String type = json.optString("type", "CHAT");

            if ("ENTER_ROOM".equals(type)) {
                int uno = json.getInt("uno");
                int rno = json.getInt("rno");

                // ✅ 기존 같은 uno지만 다른 rno 보고 있는 세션 닫기
                for (Session s : sessions) {
                	if (s.equals(session)) continue;
                    Integer existingUno = (Integer) s.getUserProperties().get("uno");
                    Integer existingRno = (Integer) s.getUserProperties().get("currentRno");
                    if (existingUno != null && existingUno == uno &&
                        existingRno != null && existingRno != rno) {
                        try {
                            s.close(new CloseReason(CloseReason.CloseCodes.NORMAL_CLOSURE, "중복 세션 종료"));
                            System.out.println("🔁 기존 세션 종료: uno=" + uno + ", rno=" + existingRno);
                        } catch (IOException e) {
                            System.err.println("⚠ 기존 세션 종료 실패: " + e.getMessage());
                        }
                    }
                }

                // ✅ 현재 세션 정보 등록
                session.getUserProperties().put("uno", uno);
                session.getUserProperties().put("currentRno", rno);
                System.out.println("🚪 사용자 입장 기록: uno=" + uno + ", rno=" + rno);

                // ✅ read_update 메시지 브로드캐스트
                for (Session s : sessions) {
                    if (s.isOpen()) {
                        Integer sessionUno = (Integer) s.getUserProperties().get("uno");
                        Integer currentRno = (Integer) s.getUserProperties().get("currentRno");

                        if (sessionUno != null && sessionUno != uno &&
                            currentRno != null && currentRno == rno) {
                            JSONObject readUpdate = new JSONObject();
                            readUpdate.put("type", "read_update");
                            readUpdate.put("rno", rno);
                            readUpdate.put("uno", uno);
                            s.getBasicRemote().sendText(readUpdate.toString());
                            System.out.println("📡 read_update 전송 → sessionUno=" + sessionUno);
                        }
                    }
                }

                return;
            }

            // ✅ 일반 메시지 처리
            if (!json.has("leader")) {
                System.err.println("⚠️ 'leader' 필드가 없는 일반 메시지. 무시됨");
                return;
            }

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

            json.put("hit", isOpponentInRoom ? 1 : 0);

            System.out.println("📤 브로드캐스트 메시지: " + json.toString());
            for (Session s : sessions) {
                if (!s.isOpen()) continue;

                Integer sessionUno = (Integer) s.getUserProperties().get("uno");
                Integer currentRno = (Integer) s.getUserProperties().get("currentRno");

                // 1) 채팅룸 안에 있는 사람(들)에게는 실제 채팅 JSON 전송
                if (currentRno != null && currentRno == rno) {
                    s.getBasicRemote().sendText(json.toString());

                // 2) 룸 밖에 있으면서, 메시지 보낸 사람이 아닌 상대편에게는 알림 전용 이벤트 전송
                } else if (sessionUno != null && sessionUno != leaderUno) {
                    JSONObject notify = new JSONObject();
                    notify.put("type", "chat_notification");
                    notify.put("rno", rno);
                    notify.put("message", json);
                    
                    s.getBasicRemote().sendText(notify.toString());
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
    
    public void broadcastChatRoom(CJSVO chat) {
        try {
            JSONObject json = new JSONObject();
            json.put("cno", chat.getCno());
            json.put("r_title", chat.getR_title());
            json.put("r_tag", chat.getR_tag());
            json.put("leader", chat.getLeader());
            json.put("leader_name", ucService.getOtherNameByUno(chat.getLeader()).getName());
            json.put("sch_date", chat.getSch_date()); ;

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
