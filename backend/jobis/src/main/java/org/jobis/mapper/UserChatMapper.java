package org.jobis.mapper;

import java.util.List;

import org.jobis.domain.CJSVO;

public interface UserChatMapper {
	
	// 유저채팅 insert
	public int register(CJSVO cjsvo);
	
	// 유저채팅 불러오기
	public List<CJSVO> getUserChat();
	

}
