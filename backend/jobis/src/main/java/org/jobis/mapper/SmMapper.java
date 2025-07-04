package org.jobis.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CUserVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.UserVO;

public interface SmMapper {
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 등록
	public int insertCUser(CUserVO cuvo);
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
    public int insertInterView(InterViewBCVO ivbc);
    
    // 진행 중 / 마감
    public List<InterViewBCVO> progress(int check);
    
    // 공고 지원한 사람 데이터
    public List<UserVO> selectByOno(int ono);
 
    // 공고 삭제
    public int deleteByOno(@Param("onoList") List<Integer> onoList);
    
    // 해당 공고 가져오기
    public InterViewBCVO oneInterViewByOno(int ono);
}
