package org.jobis.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;

public interface UserChatMapper {
	
	// 유저채팅 insert
	public int register(CJSVO cjsvo);
	
	//insert한 채팅 날짜 가져오기
	public Date getRegdate(CJSVO cjsvo);
	
	// 유저채팅 불러오기(전체)
	public List<CJSVO> getUserChat();
	
	// 태그별로 유저채팅 불러오기
	public List<CJSVO> getUserChatByTag(@Param("r_tag") String r_tag);
	
	// member로 참여하기
	public int joinChat(@Param("cno") int cno, @Param("member") int member);
	
	// 이름 가져오기
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
	public List<CompanyOfferDTO> getFavByUno(int uno);
	
	// 공고 스크랩하기
	public int addFavorite(FavDTO favdto);
	
	// 공고 스크랩 취소하기
	public int removeFavorite(FavDTO favdto);
	
	// 유저가 지원한 공고 목록 가져오기
	public List<SubmissionDTO> getAppliedByUno(int uno);
	
	// 공고 지원 취소하기
	public int deleteSubmission(@Param("uno") int uno, @Param("ono") int ono);

}
