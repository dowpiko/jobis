package org.jobis.service;

import java.util.List;

import org.jobis.domain.CJSVO;
import org.jobis.domain.UserVO;
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
	// 유저 채팅 가져오기(전체)
	@Override
	public List<CJSVO> getUserChat() {
		
		return ucMapper.getUserChat();
	}
	// 태그 별로 유저채팅 가져오기
	@Override
	public List<CJSVO> getUserChatByTag(String r_tag) {

		return ucMapper.getUserChatByTag(r_tag);
	}
	
	// 채팅 참여하기
	@Override
	public int joinChat(int cno,int member) {
		
		return ucMapper.joinChat(cno,member);
	}
	// 이름 가져오기
	@Override
	public UserVO getNameByUno() {
		
		return ucMapper.getNameByUno();
	}
	
}
