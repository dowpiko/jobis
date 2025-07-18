package org.jobis.service;

import java.util.List;

import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface SmService {
	
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 불러오기
	public ResponseEntity<String> findCompany(String crno);
	
	// 기업 회원가입
	public int insertCUser(CUserVO cuvo);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
	public int insertInterView(InterViewBCVO ivbc);
	
	// 진행 중 / 마감
	public List<InterViewBCVO> progress(int check, int uno);
	
	// 공고 지원한 사람 데이터
	public List<UserVO> selectByOno(int ono);
	
	// 공고 삭제
	public int deleteByOno(List<Integer> onoList);
	
	// 해당 공고 가져오기
	public InterViewBCVO oneInterViewByOno(int ono);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 채팅방 생성
	public int insertChatRoom(int cno, int uno, int ono);
	
	// 기업이 채팅방 가져오기
	public List<CompanyRoomDTO> initCompanyChatLayout(int cno);
	
	// 유저가 채팅방 가져오기
	public List<UserRoomDTO> initUserChatLayout(int uno);
	
	// 공고 답변, 질문 가져오기
	public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company);
	
	// 채팅 저장
	public int insertChatMessage(ChatMessageVO message);
	
	// 채팅 불러오기
	public List<ChatMessageVO> selectByRnoChatMessages(int rno, int uno);
	
	// 기업 데이터 가져오기
	public CUserVO selectCinofoByUno(int uno);
	
	// 채팅 기록 가져오기
	public int chatLogCount(int uno);
}