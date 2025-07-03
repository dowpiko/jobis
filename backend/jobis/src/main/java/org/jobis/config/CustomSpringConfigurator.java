package org.jobis.config;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;
import javax.websocket.server.ServerEndpointConfig;
public class CustomSpringConfigurator extends ServerEndpointConfig.Configurator{
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
}
