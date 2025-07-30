package org.jobis.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.OffersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OffersServiceImple implements OffersService {

    @Autowired
    private OffersMapper offersMapper;
    
	// 면접 공고 등록  
    @Override
    public int insertInterView(InterViewBCVO ivbc) {
    	return offersMapper.insertInterView(ivbc);
    }
    
    // 진행 중 / 마감
    @Override
    public List<InterViewBCVO> progress(int check, int uno) {
        Map<String, Object> param = new HashMap<>();
        param.put("check", check);
        param.put("uno", uno);

        return offersMapper.progress(param);
    }
    
    // 공고 지원한 사람 데이터
    public List<UserVO> selectByOno(int ono) {
    	return offersMapper.selectByOno(ono);
    }
    
    // 공고 삭제
    @Transactional
    @Override
    public int deleteByOno(List<Integer> onoList) {
    	return offersMapper.deleteByOno(onoList);
    }
    
    // 해당 공고 가져오기
    @Override
    public InterViewBCVO oneInterViewByOno(int ono) {
    	return offersMapper.oneInterViewByOno(ono);
    }
    
    // 공고 답변, 질문 가져오기
    @Override
    public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company) {
        InterViewBCVO ibcvo = new InterViewBCVO();
        ibcvo.setOno(ono);
        ibcvo.setUno(emp);
        ibcvo.setCompany(company);
        
        OfferSubmissionDTO offer = offersMapper.selectOffer(ibcvo);
        OfferSubmissionDTO submission = offersMapper.selectSubmission(ibcvo);

        OfferSubmissionDTO result = new OfferSubmissionDTO();

        if (offer != null) {
            result.setO_title(offer.getO_title());
            result.setO_tag(offer.getO_tag());
            result.setO_content(offer.getO_content());
            result.setO_regdate(offer.getO_regdate());
        }

        if (submission != null) {
            result.setUser_content(submission.getUser_content());
            result.setUser_regdate(submission.getUser_regdate());
            result.setRno(submission.getRno());
        }
        return result;
    }
	
	@Override
	public List<CompanyOfferDTO> getCompanyOffers() {
		return offersMapper.getCompanyOffers();
	}
	
	// 기업공고 작성완료 (유저가 답변작성한것)
	@Override
	public int insertSubmission(SubmissionDTO submissiondto) {
		return offersMapper.insertSubmission(submissiondto);
	}
	// 스크랩한 공고 목록 가져오기
	@Override
	public List<CompanyOfferDTO> getFavByUno(int uno) {
		return offersMapper.getFavByUno(uno);
	}
}