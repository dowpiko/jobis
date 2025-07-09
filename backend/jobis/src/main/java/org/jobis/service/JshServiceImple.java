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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;


import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JshServiceImple implements JshService{

    @Autowired private JavaMailSender mailSender;

    @Autowired private StringRedisTemplate redisTemplate;
    
    @Autowired private JshMapper jsmMapper;   

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

            if (jsmMapper.findUserId(userVO.getId()) == 0) {
                jsmMapper.registerUser(userVO);
            }

            return jsmMapper.getUserById(email);
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

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", googleClientId);         // 🔐 설정 필요
            params.add("client_secret", googleClientSecret); // 🔐 설정 필요
            params.add("redirect_uri", gRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = rt.postForEntity("https://oauth2.googleapis.com/token", tokenRequest, Map.class);

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.set("Authorization", "Bearer " + accessToken);
            HttpEntity<?> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<Map> profileResponse = rt.exchange(
                "https://www.googleapis.com/oauth2/v3/userinfo", HttpMethod.GET, profileRequest, Map.class);

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

            if (jsmMapper.findUserId(userVO.getId()) == 0) {
                jsmMapper.registerUser(userVO);
            }

            return jsmMapper.getUserById(email);
        } catch (Exception e) {
            System.err.println("🔴 [Google] 사용자 등록 중 오류");
            e.printStackTrace();
            throw new RuntimeException("구글 회원가입 실패");
        }
    }
    
    @Value("${clova.api.key}")
    private String clovaApiKey;

    @Value("${clova.invoke.url}")
    private String clovaInvokeUrl;

    @Value("${ncloud.endpoint}")
    private String endPoint;

    @Value("${ncloud.bucket.name}")
    private String bucketName;

    @Value("${ncloud.access.key}")
    private String accessKey;

    @Value("${ncloud.secret.key}")
    private String secretKey;
    
    @Override
    public String convertVoiceToText(MultipartFile file) {
        try {
            // S3 업로드
            AmazonS3 s3 = AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, "kr-standard"))
                .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
                .enablePathStyleAccess()
                .build();

            String objectName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("audio/wav");
            metadata.setContentLength(file.getSize());

            PutObjectRequest request = new PutObjectRequest(bucketName, objectName, file.getInputStream(), metadata);
            request.setCannedAcl(CannedAccessControlList.PublicRead);
            s3.putObject(request);

            String dataKey = objectName;
            System.out.println("📦 업로드된 파일 경로 (dataKey): " + dataKey);

            // Clova 요청
            URL url = new URL(clovaInvokeUrl + "/recognizer/object-storage");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setRequestProperty("X-CLOVASPEECH-API-KEY", clovaApiKey);

            JSONObject body = new JSONObject();
            body.put("dataKey", dataKey);
            body.put("language", "ko-KR");
            body.put("completion", "sync");
            body.put("wordAlignment", true);
            body.put("fullText", true);

            System.out.println("📨 전송할 JSON: " + body.toString());

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
            }

            int responseCode = conn.getResponseCode();
            System.out.println("📡 Clova 응답 코드: " + responseCode);

            if (responseCode == 200) {
                String response = new BufferedReader(new InputStreamReader(conn.getInputStream()))
                        .lines().collect(Collectors.joining());
                System.out.println("✅ Clova 응답 결과: " + response);

                JSONObject json = new JSONObject(response);
                return json.optString("text", "");  // text가 비어있을 수 있음
            } else {
                String error = new BufferedReader(new InputStreamReader(conn.getErrorStream()))
                        .lines().collect(Collectors.joining());
                System.out.println("❌ STT 실패: " + error);
                return "❌ STT 실패: " + error;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "🔥 서버 오류: " + e.getMessage();
        }
    }
    
    @Override
    public UserVO getUserById(String id) {
    	return jsmMapper.getUserById(id);
    }
}
