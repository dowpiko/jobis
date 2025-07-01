package org.jobis.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // React에서 연결할 주소
                .setAllowedOrigins("*") // CORS 허용
                .withSockJS(); // SockJS 지원
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // 메시지 수신용 경로
        config.setApplicationDestinationPrefixes("/app"); // 메시지 발신용 경로
    }
    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        return true; // 커스텀 메시지 컨버터는 없음 (기본값 사용)
    }


}

