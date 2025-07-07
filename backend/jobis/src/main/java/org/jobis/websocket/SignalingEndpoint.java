package org.jobis.websocket;

import org.jobis.domain.SignalingMessage;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(
  value = "/signal",
  configurator = org.jobis.config.CustomSpringConfigurator.class
)
public class SignalingEndpoint {

    private static final Map<String, Session> clients = new ConcurrentHashMap<>();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("WebSocket Opened: " + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        SignalingMessage signalingMessage = objectMapper.readValue(message, SignalingMessage.class);
        System.out.println("Received: " + signalingMessage.getType() + " from: " + signalingMessage.getFrom());

        if ("join".equals(signalingMessage.getType())) {
            clients.put(signalingMessage.getFrom(), session);
            System.out.println("Client joined: " + signalingMessage.getFrom());
        } else {
            Session targetSession = clients.get(signalingMessage.getTo());
            if (targetSession != null && targetSession.isOpen()) {
                targetSession.getBasicRemote().sendText(message);
            } else {
                System.out.println("Target not found or closed: " + signalingMessage.getTo());
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        clients.values().remove(session);
        System.out.println("WebSocket Closed: " + session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocket Error: " + throwable.getMessage());
    }
}