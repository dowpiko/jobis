package org.jobis.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.UserVO;

public interface OffersMapper {
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
    
    // 공고 답변, 질문 가져오기
    public OfferSubmissionDTO selectOffer(InterViewBCVO ibcvo);
    public OfferSubmissionDTO selectSubmission(InterViewBCVO ibcvo);
	
	// 기업정보 가져오기
	public List<CompanyOfferDTO> getCompanyOffers();
	
	// 이미 공고에 지원했는지 확인
	public int isAlreadySubmitted(Map<String, Object>param);
	
	// 기업공고 작성 완료 (유저가 답변)
	public int insertSubmission(SubmissionDTO submissiondto);
	
	// 스크랩 공고 목록 가져오기
	public List<CompanyOfferDTO> getFavByUno(int uno);
    
}