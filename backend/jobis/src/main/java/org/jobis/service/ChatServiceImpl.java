package org.jobis.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.jobis.domain.UserChatVO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.PenaltyVO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.ChatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatServiceImpl implements ChatService {
	
	@Autowired
    private ChatMapper chatMapper;
	
    // 채팅방 생성
    @Override
    @Transactional
    public int insertChatRoom(int cno, int uno, int ono) {
    	CompanyRoomDTO crvo = new CompanyRoomDTO();
    	crvo.setCompany(cno);
    	crvo.setEmp(uno);
    	crvo.setOno(ono);
    	
    	return chatMapper.insertChatRoom(crvo) > 0 ? 1 : -1;
    }
    
    //채팅방 삭제
    @Override
    public void deleteChatRoom(int ono, int uno) {
    	chatMapper.deleteChatRoom(ono, uno);
    	
    }
    
    // 기업이 채팅방 가져오기
    @Override
    public List<CompanyRoomDTO> initCompanyChatLayout(int cno) {
    	List<CompanyRoomDTO> result = chatMapper.initCompanyChatLayout(cno);
    	System.out.println(result);
    	return result;
    }
    
    // 유저가 채팅방 가져오기
    @Override
    public List<UserRoomDTO> initUserChatLayout(int uno) {
    	return chatMapper.initUserChatLayout(uno);
    }
    
    // 채팅 저장
    @Override
    public int insertChatMessage(ChatMessageVO message) {
    	return chatMapper.insertChatMessage(message);
    }
    
    // 채팅 불러오기
    @Transactional
    @Override
    public List<ChatMessageVO> selectByRnoChatMessages(int rno, int uno) {
    	chatMapper.updateChatHit(Map.of("rno", rno, "uno", uno));
        return chatMapper.selectByRnoChatMessages(rno);
    }
	// 유저채팅 insert
	@Override
	public int register(UserChatVO cjsvo) {
		return chatMapper.register(cjsvo);
	}
	
	// insert한 채팅 날짜 가져오기
	@Override
	public Date getRegdate(UserChatVO cjsvo) {
		return chatMapper.getRegdate(cjsvo);
	}
	
	// 유저 채팅 가져오기(전체)
	@Override
	public List<UserChatVO> getUserChat() {
		return chatMapper.getUserChat();
	}
	
	// 태그 별로 유저채팅 가져오기
	@Override
	public List<UserChatVO> getUserChatByTag(String r_tag) {
		return chatMapper.getUserChatByTag(r_tag);
	}
	
	// 채팅 참여하기
	@Override
	public int joinChat(int cno,int member) {
		return chatMapper.joinChat(cno,member);
	}
	
	// 이름 가져오기 (세션에서 uno받아오기)
	@Override
	public UserVO getNameByUno() {
		return chatMapper.getNameByUno();
	}
	
	// 다른 유저 이름 가져오기
	@Override
	public UserVO getOtherNameByUno(int uno) {
		return chatMapper.getOtherNameByUno(uno);
	}
	
	// 채팅방 삭제하기
	@Override
	public int deleteUserChat(int cno) {
		return chatMapper.deleteUserChat(cno);
	}
	
	// 단일 데이터 가져오기
	@Override
	public UserChatVO getChatByCno(int cno) {
		return chatMapper.getChatByCno(cno);
	}
	
	// member를 Leader로 바꾸기
	@Override
	public void promoteMemberToLeader(int cno) {
		chatMapper.promoteMemberToLeader(cno);
	}
	
	// member 삭제하기
	@Override
	public void leaveChatAsMember(int cno) {
		chatMapper.leaveChatAsMember(cno);
	}
	
	// 패널티 정보 가져오기
	@Override
	public PenaltyVO getPenaltyByUno(int uno) {
		return chatMapper.getPenaltyByUno(uno);
	}
	
	// 패널티 부여하기
	@Override
	public int insertPenalty(PenaltyVO pvo) {
		return chatMapper.insertPenalty(pvo);
	}
	
	// 패널티 업데이트하기
	@Override
	public int updatePenalty(PenaltyVO pvo) {
		return chatMapper.updatePenalty(pvo);
	}

	
}
