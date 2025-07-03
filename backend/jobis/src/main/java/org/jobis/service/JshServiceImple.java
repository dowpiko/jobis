package org.jobis.service;

import java.sql.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.JshMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class JshServiceImple implements JshService{

    @Autowired private JavaMailSender mailSender;

    @Autowired private StringRedisTemplate redisTemplate;
    
    @Autowired private JshMapper jsmMapper;   

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
    
    @Override
    public boolean checkId(String id) {    	
    	return jsmMapper.findUserId(id) == 0 ? true : false;
    }
    
    @Override
    public boolean registerUser(UserVO userVO) {    	
    	return jsmMapper.registerUser(userVO) > 0 ? true : false;
    }
    
	@Override
	public void sendVerificationCode(String email) {
		String code = String.valueOf((int)(Math.random() * 900000) + 100000);
		redisTemplate.opsForValue().set("verify:" + email, code, 5, TimeUnit.MINUTES);

		SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(email);
	    message.setSubject("이메일 인증 코드");
	    message.setText("인증코드: " + code);
	    message.setFrom(email);
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

        return jsmMapper.loginUser(param);
	}
	
	@Override
	public ProfileVO getProfileByUno(int uno) {
		return jsmMapper.getProfileByUno(uno);
	}
	
	@Override
	public boolean createProfile(ProfileVO profileVO) {
		return jsmMapper.createProfile(profileVO) > 0 ? true : false;
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
        
        if(jsmMapper.findUserId(userVO.getId()) == 0) {
        	jsmMapper.registerUser(userVO);
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
    public Map<String, Object> handleKakaoLogin(String code) {
    	try {
            // 1️⃣ 액세스 토큰 요청
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoApiKey);
            params.add("redirect_uri", kRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = rt.postForEntity(
                "https://kauth.kakao.com/oauth/token", tokenRequest, Map.class);

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 2️⃣ 사용자 정보 요청
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                profileRequest,
                Map.class);

            Map kakaoAccount = (Map) ((Map) profileResponse.getBody().get("kakao_account"));
            Map profile = (Map) kakaoAccount.get("profile");

            UserVO userVO = new UserVO();
            userVO.setId((String) kakaoAccount.get("email"));
            userVO.setEmail((String) kakaoAccount.get("email"));
            userVO.setName((String) profile.get("nickname"));
            if (kakaoAccount.containsKey("birthyear") && kakaoAccount.containsKey("birthday")) {
                String birthStr = kakaoAccount.get("birthyear") + "-" + ((String) kakaoAccount.get("birthday")).replace("-", "");
                userVO.setBirthdate(Date.valueOf(birthStr));
            }
            userVO.setPw("kakao");
            
            if(jsmMapper.findUserId(userVO.getId()) == 0) {
            	jsmMapper.registerUser(userVO);
            }

            return Map.of("success", true, "profile", profile);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("카카오 인증 처리 실패");
        }
    }
    
    @Override
    public UserVO getUserById(String id) {
    	return jsmMapper.getUserById(id);
    }
}
