package org.jobis.service;

import java.util.Date;
import java.util.List;

import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.SubmissionDTO;
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
	
	// insert한 채팅 날짜 가져오기
	@Override
	public Date getRegdate(CJSVO cjsvo) {
		
		return ucMapper.getRegdate(cjsvo);
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
	// 이름 가져오기 (세션에서 uno받아오기)
	@Override
	public UserVO getNameByUno() {
		
		return ucMapper.getNameByUno();
	}
	// 다른 유저 이름 가져오기
	@Override
	public UserVO getOtherNameByUno(int uno) {
		
		return ucMapper.getOtherNameByUno(uno);
	}
	// 채팅방 삭제하기
	@Override
	public int deleteUserChat(int cno) {
		
		return ucMapper.deleteUserChat(cno);
	}
	// 단일 데이터 가져오기
	@Override
	public CJSVO getChatByCno(int cno) {
		
		return ucMapper.getChatByCno(cno);
	}
	// member를 Leader로 바꾸기
	@Override
	public void promoteMemberToLeader(int cno) {
		
		ucMapper.promoteMemberToLeader(cno);
	}
	// member 삭제하기
	@Override
	public void leaveChatAsMember(int cno) {
		ucMapper.leaveChatAsMember(cno);
		
	}
	
	//----------------여기부터는 기업공고정보 페이지-----------------------------
	@Override
	public List<CompanyOfferDTO> getCompanyOffers() {
	
		return ucMapper.getCompanyOffers();
	}
	// 기업공고 작성완료 (유저가 답변작성한것)
	@Override
	public int insertSubmission(SubmissionDTO submissiondto) {
		

		return ucMapper.insertSubmission(submissiondto);
	}
	// 스크랩한 공고 목록 가져오기
	@Override
	public List<CompanyOfferDTO> getFavByUno(int uno) {
		
		return ucMapper.getFavByUno(uno);
	}
	// 공고 스크랩하기
	@Override
	public int addFavorite(FavDTO favdto) {
		
		return ucMapper.addFavorite(favdto);
	}
	// 스크랩 취소하기
	@Override
	public int removeFavorite(FavDTO favdto) {
		
		return ucMapper.removeFavorite(favdto);
	}
	// 유저가 지원한 공고 목록 가져오기
	@Override
	public List<SubmissionDTO> getAppliedByUno(int uno) {
		
		return ucMapper.getAppliedByUno(uno);
	}
	// 공고 지원 취소하기
	@Override
	public int deleteSubmission(int uno, int ono) {
		
		return ucMapper.deleteSubmission(uno, ono);
	}
	
}
