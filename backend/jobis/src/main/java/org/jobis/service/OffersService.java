package org.jobis.service;

import java.util.List;
import java.util.Map;

import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.springframework.stereotype.Service;

@Service
public interface OffersService {
	
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
	
	// 공고 답변, 질문 가져오기
	public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company);
	
	// 기업정보 가져오기
	public List<CompanyOfferDTO> getCompanyOffers();
	
	// 이미 공고에 지원했는지 확인
	public int isAlreadySubmitted(Map<String, Object>param);
	
	// 기업공고 작성 완료 (유저가 답변)
	public int insertSubmission(SubmissionDTO submissiondto);
	
	// 스크랩 공고 목록 가져오기
	public List<CompanyOfferDTO> getFavByUno(int uno);
}