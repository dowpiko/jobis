package org.jobis.mapper;

import java.util.List;

import org.jobis.domain.AIVO;

public interface AIMapper {
	public int insertData(AIVO aVO);
	
	public List<String> selectSimilarTitles(String baseTitle);
	
	public List<AIVO> getAllByUno(int uno);
	
	public AIVO getDataByAno(int ano);		
	
	public int updateFeedback(AIVO vo);		
}
