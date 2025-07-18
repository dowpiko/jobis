package org.jobis.mapper;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.UserVO;

public interface UserMapper {
	public int updateLastTryDate(long uno);
	public UserVO getUserByUno(int uno);
	public int updateSubscribe(@Param("uno") int uno, @Param("num") int num);
}
