package org.jobis.mapper;

import java.util.List;

import org.jobis.domain.AIVO;

public interface AIMapper {
	public int insertData(AIVO aVO);								// 데이터 삽입
	public List<String> selectSimilarTitles(String baseTitle);		// 제목 유사 검색
	public List<AIVO> getAllByUno(int uno);							// 유저의 모든 결과 가져오기
	public AIVO getDataByAno(int ano);								// ano에 해당하는 인터뷰 데이터 가져오기
	public int updateFeedback(AIVO vo);								// ano에 해당하는 튜플의 feedback update
}
