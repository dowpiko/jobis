package org.jobis.mapper;

import java.util.Map;

import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;

public interface JshMapper {
	
	public int findUserId(String id);
	
	public int registerUser(UserVO userVO);
	
	public UserVO loginUser(Map<String, Object> param);
	
	public ProfileVO getProfileByUno(int uno);
	
	public int createProfile(ProfileVO profileVO);
	
	public UserVO getUserById(String id);
}
