package org.jobis.mapper;

import org.jobis.domain.UserVO;

public interface UserMapper {
	public int updateLastTryDate(long uno);
	public UserVO getUserByUno(int uno);
}
