package org.jobis.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jobis.domain.SignalingMessage;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

@ServerEndpoint(
	value = "/signal",
	configurator = org.jobis.config.CustomSpringConfigurator.class
)
public class SignalingEndpoint {

	private static final Map<String, Set<Session>> channels = new ConcurrentHashMap<>();
	private static final ObjectMapper objectMapper = new ObjectMapper();
	private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

	private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

	@OnOpen
	public void onOpen(Session session) {
		System.out.println("WebSocket Opened: " + session.getId());
	}

	@OnMessage
	public void onMessage(String message, Session session) throws IOException {
		SignalingMessage msg = objectMapper.readValue(message, SignalingMessage.class);
		String type = msg.getType();
		String cno = msg.getCno();

		switch (type) {
			case "join":
				channels.putIfAbsent(cno, ConcurrentHashMap.newKeySet());
				channels.get(cno).add(session);
				System.out.println("✅ JOIN in channel " + cno + " (now " + channels.get(cno).size() + " users)");

				if (channels.get(cno).size() == 2) {
					for (Session s : channels.get(cno)) {
						send(s, SignalingMessage.builder().type("ready").cno(cno).build());
					}
				}

				try {
					LocalDateTime scheduleTime = LocalDateTime.parse(msg.getScheduleTime(), formatter);

					long reminderDelay = Duration.between(LocalDateTime.now(), scheduleTime.plusMinutes(50)).toMillis();
					long exitDelay = Duration.between(LocalDateTime.now(), scheduleTime.plusMinutes(60)).toMillis();

					if (reminderDelay > 0) {
						scheduler.schedule(() ->
							sendToChannel(cno, SignalingMessage.builder().type("reminder").cno(cno).build()),
							reminderDelay, TimeUnit.MILLISECONDS
						);
					}

					if (exitDelay > 0) {
						scheduler.schedule(() ->
							sendToChannel(cno, SignalingMessage.builder().type("force-exit").cno(cno).build()),
							exitDelay, TimeUnit.MILLISECONDS
						);
					}
				} catch (Exception e) {
					System.err.println("⚠️ scheduleTime 파싱 실패: " + e.getMessage());
				}
				break;

			case "offer":
			case "answer":
			case "candidate":
			case "exit":
			case "reminder":
			case "force-exit":
				Set<Session> room = channels.get(cno);
				if (room != null) {
					for (Session s : room) {
						if (!s.equals(session)) {
							send(s, msg);
						}
					}
				}
				break;
		}
	}

	@OnClose
	public void onClose(Session session) {
		channels.forEach((cno, room) -> room.remove(session));
		System.out.println("WebSocket Closed: " + session.getId());
	}

	@OnError
	public void onError(Session session, Throwable throwable) {
		System.err.println("WebSocket Error: " + throwable.getMessage());
	}

	private void send(Session session, SignalingMessage msg) {
		try {
			if (session != null && session.isOpen()) {
				session.getBasicRemote().sendText(objectMapper.writeValueAsString(msg));
			}
		} catch (IOException e) {
			System.err.println("메시지 전송 실패: " + e.getMessage());
		}
	}

	private void sendToChannel(String cno, SignalingMessage msg) {
		Set<Session> room = channels.get(cno);
		if (room != null) {
			for (Session s : room) {
				send(s, msg);
			}
		}
	}
}
