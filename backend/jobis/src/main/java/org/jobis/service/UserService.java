package org.jobis.service;

import java.util.List;
import java.util.Map;

import org.jobis.domain.CUserVO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
	
	// 아이디 중복확인
	public int findUserId(String id);

	// 기업 데이터 가져오기
	public String getAccessToken(String code);
	
	// 기업 불러오기
	public ResponseEntity<String> findCompany(String crno);
	
	// 기업 회원가입
	public int insertCUser(CUserVO cuvo);
	
	// 닉네임 중복확인
	public int countNicknameExceptMe(ProfileVO vo);
	
	// 디스코드 프로필 업데이트
	public int updateProfile(ProfileVO vo);
	
	// 채팅 기록 가져오기
	public int chatLogCount(int uno);
	
	public ProfileVO getProfileByUno(int uno);
	
	// 공고 스크랩하기
	public int addFavorite(FavDTO favdto);
	
	// 공고 스크랩 취소하기
	public int removeFavorite(FavDTO favdto);
	
	// 유저가 지원한 공고 목록 가져오기
	public List<SubmissionDTO> getAppliedByUno(int uno);
	
	// 공고 지원 취소하기
	public int deleteSubmission(int uno, int ono);
	
	public boolean checkId(String id);
	
	public boolean registerUser(UserVO userVO);
	
	public CUserVO selectCinofoByUno(int uno);
	
	public void sendVerificationCode(String email);
	
	public Map<String, Object> getUserProfile(String accessToken);
	
	public boolean verifyCode(String email, String inputCode);
	
	public UserVO loginUser(String id, String pw);
	
	public boolean createProfile(ProfileVO profileVO);
	
	public Map<String, Object> loginWithNaver(String code);
	
	public UserVO getUserById(String id);
	
	public UserVO handleKakaoLogin(String accessToken, String code, String birth);
	
	public Map<String, String> getKakaoEmail(String code);
	
	public Map<String, String> getGoogleEmail(String code);
	
	public UserVO handleGoogleLogin(String accessToken, String email, String birth);
	
	public void expireSubscriptionIfNeeded(int uno);
}
