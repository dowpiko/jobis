package org.jobis.mapper;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.jobis.domain.CUserVO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;

public interface UserMapper {
	public int updateLastTryDate(long uno);
	
	public UserVO getUserByUno(int uno);
	
	public int updateSubscribe(@Param("uno") int uno, @Param("num") int num);
	
	public int completeSubscriptionPayment(
			@Param("uno") int uno,
			@Param("subscribe") int subscribe,
			@Param("subscribeDate") Date subscribeDate
		);
	
	public int expireSubscriptionIfNeeded(@Param("uno") int uno);
	
	// 아이디 중복확인
	public int findUserId(String id);
	
	// 기업 회원가입
	public int insertCUser(CUserVO cuvo);
    
    // 기업 데이터 가져오기
    public CUserVO selectCinofoByUno(int uno);
    
    // 채팅 기록 가져오기
    public int chatLogCount(int uno);
    
    // 디스코드 프로필 업데이트
    public int updateProfile(ProfileVO vo);
    
    // 닉네임 중복확인
    public int countNicknameExceptMe(ProfileVO vo);
	
	// 공고 스크랩하기
	public int addFavorite(FavDTO favdto);
	
	// 공고 스크랩 취소하기
	public int removeFavorite(FavDTO favdto);
	
	// 유저가 지원한 공고 목록 가져오기
	public List<SubmissionDTO> getAppliedByUno(int uno);
	
	// 공고 지원 취소하기
	public int deleteSubmission(@Param("uno") int uno, @Param("ono") int ono);
	
	public int registerUser(UserVO userVO);
	
	public UserVO loginUser(Map<String, Object> param);
	
	public ProfileVO getProfileByUno(int uno);
	
	public int createProfile(ProfileVO profileVO);
	
	public UserVO getUserById(String id);
}
