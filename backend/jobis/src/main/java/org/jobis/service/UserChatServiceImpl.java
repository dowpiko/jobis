package org.jobis.service;

import org.jobis.domain.CJSVO;
import org.jobis.mapper.UserChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserChatServiceImpl implements UserChatService {
	
	@Autowired UserChatMapper ucMapper;
	
	// 유저 채팅 입력
	@Override
	public int register(CJSVO cjsvo) {
		
		return ucMapper.register(cjsvo);
	}
	
	
}
