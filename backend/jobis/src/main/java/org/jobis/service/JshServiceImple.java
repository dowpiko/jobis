package org.jobis.service;

import java.sql.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;
import org.jobis.mapper.JshMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class JshServiceImple implements JshService{

    @Autowired private JavaMailSender mailSender;

    @Autowired private StringRedisTemplate redisTemplate;
    
    @Autowired private JshMapper jsmMapper;
    
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
	    message.setFrom("tjdgus3877@naver.com");
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
	
	private final String clientId = "7sLoLuG8ZvfOsumVewkd";
    private final String clientSecret = "2XNtNgbnVE";
    private final String redirectUri = "http://localhost:3000/naver/callback";

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
                .queryParam("redirect_uri", redirectUri)
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
    public UserVO getUserById(String id) {
    	return jsmMapper.getUserById(id);
    }
}
