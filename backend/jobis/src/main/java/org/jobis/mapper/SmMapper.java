package org.jobis.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.UserVO;

public interface SmMapper {
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 회원가입
	public int insertCUser(CUserVO cuvo);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
    public int insertInterView(InterViewBCVO ivbc);
    
    // 진행 중 / 마감
    public List<InterViewBCVO> progress(Map<String, Object> param);
    
    // 공고 지원한 사람 데이터
    public List<UserVO> selectByOno(int ono);
 
    // 공고 삭제
    public int deleteByOno(@Param("onoList") List<Integer> onoList);
    
    // 해당 공고 가져오기
    public InterViewBCVO oneInterViewByOno(int ono);
    
    /* ----------------------------------------------------------------------------------- */
    
    // 채팅방 생성
    public int insertChatRoom(CompanyRoomDTO crvo);
    
    // 기업이 채팅방 가져오기
    public List<CompanyRoomDTO> initCompanyChatLayout(int cno);
    
    // 유저가 채팅방 가져오기
    public List<UserRoomDTO> initUserChatLayout(int uno);
    
    // 공고 답변, 질문 가져오기
    public OfferSubmissionDTO selectOffer(InterViewBCVO ibcvo);
    public OfferSubmissionDTO selectSubmission(InterViewBCVO ibcvo);
    
    // 채팅 저장
    public int insertChatMessage(ChatMessageVO message);
    
    // 채팅 불러오기
    public List<ChatMessageVO> selectByRnoChatMessages(int rno);
    public void updateChatHit(Map<String, Object> param);
    
    // 기업 데이터 가져오기
    public CUserVO selectCinofoByUno(int uno);
}