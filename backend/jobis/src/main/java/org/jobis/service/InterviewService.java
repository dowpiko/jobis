package org.jobis.service;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

public interface InterviewService {
	public String getPrompt(HttpSession httpSession, Session session);
	public void saveCurrentStates(Session session, String jsonString);
}
