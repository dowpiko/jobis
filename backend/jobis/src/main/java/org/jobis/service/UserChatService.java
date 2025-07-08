package org.jobis.service;

import java.util.List;

import org.jobis.domain.CJSVO;
import org.jobis.domain.UserVO;
import org.springframework.stereotype.Service;
@Service
public interface UserChatService {

	// 유저채팅 insert
	public int register(CJSVO cjsvo);
	
	// 유저채팅 불러오기(전체)
	public List<CJSVO> getUserChat();
	
	// 태그별로 유저채팅 불러오기
	public List<CJSVO> getUserChatByTag(String r_tag);
	
	// member로 참여하기
	public int joinChat(int cno, int member);
	
	// 이름 가져오기
	public UserVO getNameByUno();
	
	// 채팅 삭제하기
	public int deleteUserChat(int cno);
	
	// 단일 데이터 가져오기
	public CJSVO getChatByCno(int cno);
	
	//member를 Leader로 바꾸기
	public void promoteMemberToLeader(int cno);
	
	//member삭제하기
	public void leaveChatAsMember(int cno);
	
}
