package org.jobis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.UserVO;

public interface UserChatMapper {
	
	// 유저채팅 insert
	public int register(CJSVO cjsvo);
	
	// 유저채팅 불러오기(전체)
	public List<CJSVO> getUserChat();
	
	// 태그별로 유저채팅 불러오기
	public List<CJSVO> getUserChatByTag(@Param("r_tag") String r_tag);
	
	// member로 참여하기
	public int joinChat(@Param("cno") int cno, @Param("member") int member);
	
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
	//----------------여기부터는 기업공고정보 페이지-----------------------------
	
	// 기업정보 가져오기
	public List<CompanyOfferDTO> getCompanyOffers();

}
