package org.jobis.service;

import org.jobis.domain.CJSVO;
import org.jobis.mapper.UserChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserChatServiceImpl implements UserChatService {
	
	@Autowired UserChatMapper ucMapper;
	
	// ���� ä�� �Է�
	@Override
	public int register(CJSVO cjsvo) {
		
		return 0;//ucMapper.register(cjsvo);
	}
	
	
}
