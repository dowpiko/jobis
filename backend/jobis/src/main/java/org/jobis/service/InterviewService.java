package org.jobis.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import javax.servlet.http.HttpSession;
import javax.websocket.Session;

import org.jobis.domain.AIVO;
import org.jobis.domain.InterviewResultDTO;

public interface InterviewService {
	public String getPrompt(HttpSession httpSession, Session session);
	public void saveCurrentStates(Session session, String jsonString);
	public int handleResultData(List<InterviewResultDTO> resultList, HttpSession session);
	public List<AIVO> getAllResults(int uno);
	public CompletableFuture<String> getFeedbackFromAI(int ano);
}
