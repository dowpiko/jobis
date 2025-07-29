//ver1
package org.jobis.websocket;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.jobis.domain.SignalingMessage;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

@ServerEndpoint(
    value = "/signal",
    configurator = org.jobis.config.CustomSpringConfigurator.class
)
public class SignalingEndpoint {
    // cno별로 참가 세션 리스트를 관리
    private static final Map<String, List<Session>> channels = new ConcurrentHashMap<>();
    private static final ObjectMapper mapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("WebSocket opened: " + session.getId());
    }

    @OnMessage
    public void onMessage(String raw, Session session) throws IOException {
        SignalingMessage msg = mapper.readValue(raw, SignalingMessage.class);
        String cno = msg.getCno();
        System.out.println("메시지 타입 : "+msg.getType());
        switch (msg.getType()) {
	        case "join":
	            channels.putIfAbsent(cno, Collections.synchronizedList(new ArrayList<>()));
	            List<Session> room = channels.get(cno);
	            room.add(session);
	            System.out.println("채널 합류 " + cno + " (members: " + room.size() + "명)");
	            break;


            case "offer":
            case "answer":
            case "candidate":
            case "exit":
                // offer/answer/candidate/exit 메시지를 룸의 다른 멤버에게 전달
                broadcastToOthers(cno, raw, session);
                break;

            default:
                // reminder / force-exit 은 스케줄러에서 직접 보냄
                break;
        }
    }

    @OnClose
    public void onClose(Session session) {
        channels.values().forEach(list -> list.remove(session));
        System.out.println("WebSocket closed: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable t) {
        System.err.println("WebSocket error: " + t.getMessage());
    }

    // 같은 cno 룸에 있는, sender를 제외한 모두에게 raw JSON 전송
    private void broadcastToOthers(String cno, String raw, Session sender) {
        List<Session> room = channels.get(cno);
        if (room == null) return;
        for (Session s : room) {
            if (!s.equals(sender) && s.isOpen()) {
                try {
                    s.getBasicRemote().sendText(raw);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}