package org.jobis.service;

import org.springframework.stereotype.Service;

@Service
public interface JshService {
	
	public void sendVerificationCode(String email);
	
	public boolean verifyCode(String email, String inputCode);
}
