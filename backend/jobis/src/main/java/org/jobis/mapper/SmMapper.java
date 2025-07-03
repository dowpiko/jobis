package org.jobis.mapper;

import org.jobis.domain.CUserVO;
import org.jobis.domain.InterViewBCVO;

public interface SmMapper {
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 등록
	public int insertCUser(CUserVO cuvo);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
    public int insertInterView(InterViewBCVO ivbc);
}
