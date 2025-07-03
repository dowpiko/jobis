package org.jobis.service;

import org.springframework.stereotype.Service;

@Service
public class InterviewServiceimpl implements InterviewService{	
	@Override
	public String generateAnswer(String question) {
		// TODO 추후 AI 연동 or 로직 처리
		return "AI가 처리한 응답 : " + question;
	}
}
