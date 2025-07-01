package org.jobis.service;

import java.util.List;

import org.jobis.domain.CJSVO;
import org.springframework.stereotype.Service;
@Service
public interface UserChatService {

	// 유저채팅 insert
	public int register(CJSVO cjsvo);
	
	// 유저채팅 불러오기
	public List<CJSVO> getUserChat();
}
