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
	
	            if (room.size() == 1) {
	                try {
	                    LocalDateTime start = LocalDateTime.parse(msg.getScheduleTime(), fmt);
	                    LocalDateTime end          = start.plusMinutes(60);
	                    LocalDateTime reminderTime = end.minusSeconds(30);
	                    LocalDateTime exitTime     = end.plusMinutes(1);
	
	                    long delayReminder = Duration.between(LocalDateTime.now(), reminderTime).toMillis();
	                    long delayExit     = Duration.between(LocalDateTime.now(), exitTime).toMillis();
	
	                    // 1초마다 남은 시간 로그
	                    ScheduledFuture<?> logFuture = scheduler.scheduleAtFixedRate(() -> {
	                        long secsLeft = Duration.between(LocalDateTime.now(), reminderTime).getSeconds();
	                        System.out.println("[Timer] 리마인더까지 남은 시간: " + Math.max(secsLeft, 0) + "초");
	                    }, 0, 1, TimeUnit.SECONDS);
	
	                    // 리마인더 스케줄 (30초 전)
	                    if (delayReminder > 0) {
	                        scheduler.schedule(() -> {
	                            // 로깅 중단
	                            logFuture.cancel(false);
	                            // 리마인더 전송
	                            broadcast(cno, SignalingMessage.builder()
	                                .type("reminder")
	                                .cno(cno)
	                                .build());
	                        }, delayReminder, TimeUnit.MILLISECONDS);
	                    }
	
	                    // 강제 종료 스케줄 (종료 1분 후)
	                    if (delayExit > 0) {
	                        scheduler.schedule(() -> {
	                            broadcast(cno, SignalingMessage.builder()
	                                .type("force-exit")
	                                .cno(cno)
	                                .build());
	                        }, delayExit, TimeUnit.MILLISECONDS);
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