package org.jobis.mapper;

import java.sql.Date;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.UserVO;

public interface UserMapper {
	public int updateLastTryDate(long uno);
	public UserVO getUserByUno(int uno);
	public int updateSubscribe(@Param("uno") int uno, @Param("num") int num);
	public int completeSubscriptionPayment(
			@Param("uno") int uno,
			@Param("subscribe") int subscribe,
			@Param("subscribeDate") Date subscribeDate
		);
	public int expireSubscriptionIfNeeded(@Param("uno") int uno);
}
