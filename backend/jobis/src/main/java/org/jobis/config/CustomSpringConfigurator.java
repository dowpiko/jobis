package org.jobis.config;

import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

public class CustomSpringConfigurator extends ServerEndpointConfig.Configurator {

	// 기존 Spring 의존성 주입용
	@Override
	public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
		try {
			T instance = endpointClass.getDeclaredConstructor().newInstance();
			SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(instance);
			return instance;
		} catch (Exception e) {
			throw new InstantiationException("WebSocket endpoint instance creation failed: " + e.getMessage());
		}
	}

	// ✅ 추가: HttpSession을 userProperties에 넣기
	@Override
	public void modifyHandshake(ServerEndpointConfig config, HandshakeRequest request, HandshakeResponse response) {
		HttpSession httpSession = (HttpSession) request.getHttpSession();
		if (httpSession != null) {
			config.getUserProperties().put(HttpSession.class.getName(), httpSession);
		}
	}
}
