package org.jobis.service;

import java.util.Map;

import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;
import org.springframework.stereotype.Service;

@Service
public interface JshService {
	
	public boolean checkId(String id);
	
	public boolean registerUser(UserVO userVO);
	
	public void sendVerificationCode(String email);
	
	public boolean verifyCode(String email, String inputCode);
	
	public UserVO loginUser(String id, String pw);
	
	public ProfileVO getProfileByUno(int uno);
	
	public boolean createProfile(ProfileVO profileVO);
	
	public Map<String, Object> loginWithNaver(String code);
	
	public String getAccessToken(String code);
	
	public Map<String, Object> getUserProfile(String accessToken);
	
	public UserVO getUserById(String id);
	
	public Map<String, Object> handleKakaoLogin(String code, String birth);
	
	public String getKakaoEmail(String code);
}
