//ver1
package org.jobis.websocket;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.jobis.domain.SignalingMessage;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private static final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

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

                // 처음 join할 때만 스케줄링
                if (room.size() == 1) {
                    try {
                        LocalDateTime start = LocalDateTime.parse(msg.getScheduleTime(), fmt);
                        long delayReminder = Duration.between(LocalDateTime.now(), start.plusMinutes(50)).toMillis();
                        long delayExit     = Duration.between(LocalDateTime.now(), start.plusMinutes(60)).toMillis();

                        if (delayReminder > 0) {
                            scheduler.schedule(() -> 
                                broadcast(cno, SignalingMessage.builder()
                                    .type("reminder")
                                    .cno(cno)
                                    .build()),
                                delayReminder, TimeUnit.MILLISECONDS
                            );
                        }
                        if (delayExit > 0) {
                            scheduler.schedule(() -> 
                                broadcast(cno, SignalingMessage.builder()
                                    .type("force-exit")
                                    .cno(cno)
                                    .build()),
                                delayExit, TimeUnit.MILLISECONDS
                            );
                        }
                    } catch (Exception e) {
                        System.err.println("스케줄링 오류: " + e.getMessage());
                    }
                }
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

    // raw가 아니라, SignalingMessage 빌더를 쓰고 싶을 때
    private void broadcast(String cno, SignalingMessage msg) {
        String txt;
        try {
            txt = mapper.writeValueAsString(msg);
        } catch (IOException e) {
            return;
        }
        channels.getOrDefault(cno, Collections.emptyList()).forEach(s -> {
            if (s.isOpen()) {
                try { s.getBasicRemote().sendText(txt); }
                catch (IOException ignored) {}
            }
        });
    }
}


//ver0
//package org.jobis.websocket;
//
//import org.jobis.domain.SignalingMessage;
//import com.fasterxml.jackson.databind.ObjectMapper;
//
//import javax.websocket.*;
//import javax.websocket.server.ServerEndpoint;
//import java.io.IOException;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@ServerEndpoint(
//  value = "/signal",
//  configurator = org.jobis.config.CustomSpringConfigurator.class
//)
//public class SignalingEndpoint {
//
//    private static final Map<String, Session> clients = new ConcurrentHashMap<>();
//    private static final ObjectMapper objectMapper = new ObjectMapper();
//
//    @OnOpen
//    public void onOpen(Session session) {
//        System.out.println("WebSocket Opened: " + session.getId());
//    }
//
//    @OnMessage
//    public void onMessage(String message, Session session) throws IOException {
//        SignalingMessage signalingMessage = objectMapper.readValue(message, SignalingMessage.class);
//        System.out.println("Received: " + signalingMessage.getType() + " from: " + signalingMessage.getFrom());
//
//        if ("join".equals(signalingMessage.getType())) {
//            clients.put(signalingMessage.getFrom(), session);
//            System.out.println("Client joined: " + signalingMessage.getFrom());
//        } else {
//            Session targetSession = clients.get(signalingMessage.getTo());
//            if (targetSession != null && targetSession.isOpen()) {
//                targetSession.getBasicRemote().sendText(message);
//            } else {
//                System.out.println("Target not found or closed: " + signalingMessage.getTo());
//            }
//        }
//    }
//
//    @OnClose
//    public void onClose(Session session) {
//        clients.values().remove(session);
//        System.out.println("WebSocket Closed: " + session.getId());
//    }
//
//    @OnError
//    public void onError(Session session, Throwable throwable) {
//        System.err.println("WebSocket Error: " + throwable.getMessage());
//    }
//}