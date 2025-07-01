package org.jobis.service;

import org.jobis.domain.UserVO;
import org.springframework.stereotype.Service;

@Service
public interface JshService {
	
	public boolean checkId(String id);
	
	public boolean registerUser(UserVO userVO);
	
	public void sendVerificationCode(String email);
	
	public boolean verifyCode(String email, String inputCode);
	
	public UserVO loginUser(String id, String pw);
}
