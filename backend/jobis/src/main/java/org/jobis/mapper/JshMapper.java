package org.jobis.mapper;

import java.util.Map;

import org.jobis.domain.UserVO;

public interface JshMapper {
	
	public int findUserId(String id);
	
	public int registerUser(UserVO userVO);
	
	public UserVO loginUser(Map<String, Object> param);
}
