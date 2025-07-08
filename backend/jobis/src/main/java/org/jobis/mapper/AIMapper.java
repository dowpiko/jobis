package org.jobis.mapper;

import java.util.List;

import org.jobis.domain.AIVO;

public interface AIMapper {
	public int insertData(AIVO aVO);					// 데이터 삽입
	List<String> selectSimilarTitles(String baseTitle);	// 제목 유사 검색
	List<AIVO> getAllByUno(int uno);					// 유저의 모든 결과 가져오기
}
