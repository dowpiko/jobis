package org.jobis.service;

import java.util.Date;
import java.util.List;

import org.jobis.domain.UserChatVO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.PenaltyVO;
import org.jobis.domain.UserVO;
import org.springframework.stereotype.Service;
@Service
public interface ChatService {
	
	// 채팅방 생성
	public int insertChatRoom(int cno, int uno, int ono);
	
	// 기업이 채팅방 가져오기
	public List<CompanyRoomDTO> initCompanyChatLayout(int cno);
	
	// 유저가 채팅방 가져오기
	public List<UserRoomDTO> initUserChatLayout(int uno);
	
	// 채팅 저장
	public int insertChatMessage(ChatMessageVO message);
	
	// 채팅 불러오기
	public List<ChatMessageVO> selectByRnoChatMessages(int rno, int uno);

	// 유저채팅 insert
	public int register(UserChatVO cjsvo);
	
	//insert한 채팅 날짜 가져오기
	public Date getRegdate(UserChatVO cjsvo);
	
	// 유저채팅 불러오기(전체)
	public List<UserChatVO> getUserChat();
	
	// 태그별로 유저채팅 불러오기
	public List<UserChatVO> getUserChatByTag(String r_tag);
	
	// member로 참여하기
	public int joinChat(int cno, int member);
	
	// 이름 가져오기(세션에서 uno받아옴)
	public UserVO getNameByUno();
	
	// 다른 유저 이름 가져오기
	public UserVO getOtherNameByUno(int uno);
	
	// 채팅 삭제하기
	public int deleteUserChat(int cno);
	
	// 단일 데이터 가져오기
	public UserChatVO getChatByCno(int cno);
	
	//member를 Leader로 바꾸기
	public void promoteMemberToLeader(int cno);
	
	//member삭제하기
	public void leaveChatAsMember(int cno);
	
	// 패널티 정보 가져오기
	public PenaltyVO getPenaltyByUno(int uno);
	
	// 패널티 부여하기
	public int insertPenalty(PenaltyVO pvo);
	
	// 패널티 업데이트하기
	public int updatePenalty(PenaltyVO pvo);
}
