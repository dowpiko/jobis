package org.jobis.service;

import org.jobis.domain.CUserVO;
import org.jobis.domain.InterViewBCVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface SmService {
	
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 불러오기
	public ResponseEntity<String> findCompany(String crno);
	
	// 기업 등록
	public int insertCUser(CUserVO cuvo);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
	public int insertInterView(InterViewBCVO ivbc);
}
