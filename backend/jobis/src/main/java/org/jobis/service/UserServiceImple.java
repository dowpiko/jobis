package org.jobis.service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.jobis.domain.CUserVO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserServiceImple implements UserService{

    @Autowired 
    private JavaMailSender mailSender;

    @Autowired 
    private StringRedisTemplate redisTemplate;
    
    @Autowired 
    private UserMapper userMapper;

    @Value("${spring.mail.username}")
    private String mailSenderAddress;
    
	@Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @Value("${naver.redirect.uri}")
    private String nRedirectUri;
    
    @Value("${spring.mail.username}")
    private String email;
    
    @Value("${kakao.rest-api-key}")
    private String kakaoApiKey;

    @Value("${kakao.redirect-uri}")
    private String kRedirectUri;
    
    @Value("${google.client.id}")
    private String googleClientId;

    @Value("${google.client.secret}")
    private String googleClientSecret;

    @Value("${google.redirect.uri}")
    private String gRedirectUri;
    
    @Value("${key.compInfo}")
    private String compInfoKey;
    
    // 아이디 중복확인
    @Override
    public int findUserId(String id) {
    	return userMapper.findUserId(id) == 0 ? 0 : 1;
    }
    
    // 기업 불러오기
    @Override
    public ResponseEntity<String> findCompany(String crno) {
        try {
            String encodedKey = URLEncoder.encode(compInfoKey, StandardCharsets.UTF_8.toString());

            String fullUrl = "http://apis.data.go.kr/1160100/service/GetCorpBasicInfoService_V2/getCorpOutline_V2"
                    + "?serviceKey=" + encodedKey
                    + "&pageNo=1"
                    + "&numOfRows=1"
                    + "&resultType=json"
                    + "&crno=" + crno;

            URI uri = URI.create(fullUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0");
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("Accept-Charset", "UTF-8");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String json = response.getBody();

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> parsed = objectMapper.readValue(json, Map.class);

            return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8").body(json);

        } catch (Exception e) {
            String errorJson = "{\"error\": \"API 호출 실패: " + e.getMessage() + "\"}";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .header(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8")
                    .body(errorJson);
        }
    };
    
    // 기업 회원가입
    @Override
    @Transactional
    public int insertCUser(CUserVO cuvo) {
    	return userMapper.insertCUser(cuvo);
    };
    
    // 기업 데이터 가져오기
    @Override
    public CUserVO selectCinofoByUno(int uno) {
    	return userMapper.selectCinofoByUno(uno);
    }
    
    // 디스코드 프로필 업데이트
    @Override
    public int updateProfile(ProfileVO vo) {
        return userMapper.updateProfile(vo);
    }
    
    // 닉네임 중복확인
    @Override
    public int countNicknameExceptMe(ProfileVO vo) {
    	return userMapper.countNicknameExceptMe(vo);
    }
    
    // 채팅 기록 가져오기
    @Override
    public int chatLogCount(int uno) {
    	return userMapper.chatLogCount(uno);
    }
	
	@Override
	public ProfileVO getProfileByUno(int uno) {
		return userMapper.getProfileByUno(uno);
	}
	
	// 공고 스크랩하기
	@Override
	public int addFavorite(FavDTO favdto) {
		return userMapper.addFavorite(favdto);
	}
	
	// 스크랩 취소하기
	@Override
	public int removeFavorite(FavDTO favdto) {
		return userMapper.removeFavorite(favdto);
	}
	
	// 유저가 지원한 공고 목록 가져오기
	@Override
	public List<SubmissionDTO> getAppliedByUno(int uno) {
		return userMapper.getAppliedByUno(uno);
	}
	
	// 공고 지원 취소하기
	@Override
	public int deleteSubmission(int uno, int ono) {
		return userMapper.deleteSubmission(uno, ono);
	}
	
    @Override
    public boolean checkId(String id) {    	
    	return userMapper.findUserId(id) == 0 ? true : false;
    }
    
    @Override
    public boolean registerUser(UserVO userVO) {    	
    	return userMapper.registerUser(userVO) > 0 ? true : false;
    }
    
	@Override
	public void sendVerificationCode(String email) {
		String code = String.valueOf((int)(Math.random() * 900000) + 100000);
		redisTemplate.opsForValue().set("verify:" + email, code, 5, TimeUnit.MINUTES);

		SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(email);
	    message.setSubject("이메일 인증 코드");
	    message.setText("인증코드: " + code);
	    message.setFrom(mailSenderAddress);
	    mailSender.send(message);	
	}
	
	@Override
	public boolean verifyCode(String email, String inputCode) {
		String key = "verify:" + email;
        String storedCode = redisTemplate.opsForValue().get(key);
        if (storedCode != null && storedCode.equals(inputCode)) {
            redisTemplate.delete(key);
            return true;
        }
        return false;
	}
	
	@Override
	public UserVO loginUser(String id, String pw) {
		Map<String, Object> param = new HashMap<>();
        param.put("id", id);
        param.put("pw", pw);

        return userMapper.loginUser(param);
	}
	
	@Override
	public boolean createProfile(ProfileVO profileVO) {
		return userMapper.createProfile(profileVO) > 0 ? true : false;
	}	

    @Override
    public Map<String, Object> loginWithNaver(String code) {
        String accessToken = getAccessToken(code);
        Map<String, Object> userProfile = getUserProfile(accessToken);
        
        UserVO userVO = new UserVO();
        userVO.setId((String) userProfile.get("email"));
        userVO.setEmail((String) userProfile.get("email"));
        userVO.setName((String) userProfile.get("name"));
        userVO.setBirthdate(Date.valueOf(userProfile.get("birthyear") + "-" + userProfile.get("birthday")));
        userVO.setPw("naver");
        
        if(userMapper.findUserId(userVO.getId()) == 0) {
        	userMapper.registerUser(userVO);
        }
        
        return userProfile;
    }

    @Override
    public String getAccessToken(String code) {
        try {
            String tokenUrl = "https://nid.naver.com/oauth2.0/token";
            RestTemplate restTemplate = new RestTemplate();

            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(tokenUrl)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("redirect_uri", nRedirectUri)
                .queryParam("code", code);

            ResponseEntity<Map> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                null,
                Map.class
            );

            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            throw new RuntimeException("AccessToken 요청 실패", e);
        }
    }

    @Override
    public Map<String, Object> getUserProfile(String accessToken) {
        try {
            String profileUrl = "https://openapi.naver.com/v1/nid/me";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<?> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response = restTemplate.exchange(
                profileUrl,
                HttpMethod.GET,
                entity,
                Map.class
            );

            Map<String, Object> responseBody = response.getBody();
            Map<String, Object> userInfo = (Map<String, Object>) responseBody.get("response");
            return userInfo;
        } catch (Exception e) {
            throw new RuntimeException("네이버 프로필 요청 실패", e);
        }
    }
    
    @Override
    public Map<String, String> getKakaoEmail(String code) {
        try {
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoApiKey);
            params.add("redirect_uri", kRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = rt.postForEntity("https://kauth.kakao.com/oauth/token", tokenRequest, Map.class);

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me", HttpMethod.GET, profileRequest, Map.class);

            Map kakaoAccount = (Map) profileResponse.getBody().get("kakao_account");
            String email = (String) kakaoAccount.get("email");

            return Map.of("accessToken", accessToken, "email", email);
        } catch (HttpClientErrorException e) {
            System.err.println("🔴 [Kakao] 토큰 또는 이메일 요청 실패");
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            throw new RuntimeException("카카오 인증 실패");
        }
    }

    @Override
    public UserVO handleKakaoLogin(String accessToken, String email, String birth) {
        try {
            RestTemplate rt = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(headers);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me", HttpMethod.GET, profileRequest, Map.class);

            Map kakaoAccount = (Map) profileResponse.getBody().get("kakao_account");
            Map profile = (Map) kakaoAccount.get("profile");
            String nickname = (String) profile.get("nickname");

            UserVO userVO = new UserVO();
            userVO.setId(email);
            userVO.setEmail(email);
            userVO.setName(nickname + "Test");
            userVO.setPw("kakao");

            if (birth != null && !birth.isEmpty()) {
                userVO.setBirthdate(Date.valueOf(birth));
            }

            if (userMapper.findUserId(userVO.getId()) == 0) {
                userMapper.registerUser(userVO);
            }

            return userMapper.getUserById(email);
        } catch (Exception e) {
            System.err.println("🔴 [Kakao] 사용자 등록 중 오류");
            e.printStackTrace();
            throw new RuntimeException("카카오 회원가입 실패");
        }
    }
    
    @Override
    public Map<String, String> getGoogleEmail(String code) {
        try {
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            System.out.println(googleClientId);
            System.out.println(googleClientSecret);
            System.out.println(gRedirectUri);
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", googleClientId);         // 🔐 설정 필요
            params.add("client_secret", googleClientSecret); // 🔐 설정 필요
            params.add("redirect_uri", gRedirectUri);
            params.add("code", code);
            System.out.println("🔥 before token exchange");
            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = rt.postForEntity("https://oauth2.googleapis.com/token", tokenRequest, Map.class);
            System.out.println("???");
            String accessToken = (String) tokenResponse.getBody().get("access_token");
            System.out.println("📨 accessToken: " + accessToken);
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://www.googleapis.com/oauth2/v3/userinfo", HttpMethod.GET, profileRequest, Map.class);

            System.out.println("🧾 구글 프로필 응답: " + profileResponse.getBody());

            String email = (String) profileResponse.getBody().get("email");

            return Map.of("accessToken", accessToken, "email", email);
        } catch (HttpClientErrorException e) {
            System.err.println("🔴 [Google] 토큰 또는 이메일 요청 실패");
            System.err.println("Status Code: " + e.getStatusCode());
            System.err.println("Response Body: " + e.getResponseBodyAsString());
            throw new RuntimeException("구글 인증 실패");
        }
    }
    
    @Override
    public UserVO handleGoogleLogin(String accessToken, String email, String birth) {
        try {
            RestTemplate rt = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(headers);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://www.googleapis.com/oauth2/v3/userinfo", HttpMethod.GET, profileRequest, Map.class);

            String name = (String) profileResponse.getBody().get("name");

            UserVO userVO = new UserVO();
            userVO.setId(email);
            userVO.setEmail(email);
            userVO.setName(name + "Google");
            userVO.setPw("google");

            if (birth != null && !birth.isEmpty()) {
                userVO.setBirthdate(Date.valueOf(birth));
            }

            if (userMapper.findUserId(userVO.getId()) == 0) {
                userMapper.registerUser(userVO);
            }

            return userMapper.getUserById(email);
        } catch (Exception e) {
            System.err.println("🔴 [Google] 사용자 등록 중 오류");
            e.printStackTrace();
            throw new RuntimeException("구글 회원가입 실패");
        }
    }
    
    @Override
    public void expireSubscriptionIfNeeded(int uno) {
    	System.out.println(userMapper.expireSubscriptionIfNeeded(uno)>0?"구독 여부 자동 업데이트 완료":null);
    }
    
    @Override
    public UserVO getUserById(String id) {
    	return userMapper.getUserById(id);
    }
}
