package org.jobis.mapper;

import org.jobis.domain.UserVO;

public interface JshMapper {
	
	public int findUserId(String id);
	
	public int registerUser(UserVO userVO);
}
