package org.jobis.service;

import java.util.List;

import org.jobis.domain.CJSVO;
import org.jobis.mapper.UserChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserChatServiceImpl implements UserChatService {
	
	@Autowired UserChatMapper ucMapper;
	
	// 유저채팅 insert
	@Override
	public int register(CJSVO cjsvo) {
		
		return ucMapper.register(cjsvo);
	}
	// 유저 채팅 가져오기
	@Override
	public List<CJSVO> getUserChat() {
		
		return ucMapper.getUserChat();
	}
	
	
}
