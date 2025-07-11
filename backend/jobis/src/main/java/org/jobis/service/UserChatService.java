package org.jobis.service;

import java.util.List;

import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.SubmissionDTO;
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
	
	// 이름 가져오기(세션에서 uno받아옴)
	public UserVO getNameByUno();
	
	// 다른 유저 이름 가져오기
	public UserVO getOtherNameByUno(int uno);
	
	// 채팅 삭제하기
	public int deleteUserChat(int cno);
	
	// 단일 데이터 가져오기
	public CJSVO getChatByCno(int cno);
	
	//member를 Leader로 바꾸기
	public void promoteMemberToLeader(int cno);
	
	//member삭제하기
	public void leaveChatAsMember(int cno);
	
	//----------------여기부터는 기업공고정보 페이지-----------------------------
	
	// 기업정보 가져오기
	public List<CompanyOfferDTO> getCompanyOffers();
	
	// 기업공고 작성 완료 (유저가 답변)
	public int insertSubmission(SubmissionDTO submissiondto);
	
	// 스크랩 공고 목록 가져오기
	public List<SubmissionDTO> getFavByUno(int uno);
	
	// 공고 스크랩하기
	public int addFavorite(int uno,int ono);
	
	// 공고 스크랩 취소하기
	public int removeFavorite(int uno,int ono);
	
}
