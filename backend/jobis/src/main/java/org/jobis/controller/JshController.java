package org.jobis.controller;

import java.sql.Date;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;
import org.jobis.service.JshService;
import org.jobis.service.SmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/jsh")
public class JshController {

	@Autowired
	JshService jshservice;
    
	@Autowired
	SmService smService;
	// 아이디 중복 확인
	@GetMapping("/checkid")
	public Map<String, Boolean> checkUsername(@RequestParam String id) {
		return Collections.singletonMap("available", jshservice.checkId(id));
	}
	
	// 회원가입
	@PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody UserVO userVO) {		
        boolean success = jshservice.registerUser(userVO);
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "가입 성공" : "이미 존재하는 사용자입니다");
        return result;
    }

	// 이메일에 인증 코드 보내기
	@PostMapping("/sendemailcode")
	public Map<String, Object> sendCode(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		System.out.println("SendEmailCode: " + email);
		jshservice.sendVerificationCode(email);
		return Collections.singletonMap("success", true);
	}

	// 코드 확인
	@PostMapping("/verifyemailcode")
	public Map<String, Object> verify(@RequestParam String email, @RequestParam String code) {
		System.out.println("verifyemailcode: " + email + " / " + code);
		boolean verified = jshservice.verifyCode(email, code);
		return Collections.singletonMap("verified", verified);
	}
	
	// 로그인
	@PostMapping("/login")
	public Map<String, Object> login(@RequestBody Map<String, String> body, HttpSession session) {
	    String id = body.get("id");
	    String pw = body.get("pw");

	    UserVO user = jshservice.loginUser(id, pw);
	    
	    Map<String, Object> result = new HashMap<>();
	    if (user != null) {
	    	jshservice.expireSubscriptionIfNeeded(user.getUno());
	    	user = jshservice.getUserById(id);
	        session.setAttribute("User", user); // ✅ 세션에 저장
	        
	        result.put("success", true);
	        result.put("userType", user.getAuth());
	        result.put("uno", user.getUno());
	    } else {
	        result.put("success", false);
	        result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
	    }

	    return result;
	}
	
	// 로그인 정보 확인
	@GetMapping("/getUser")
	public UserVO getUser(HttpSession session) {
	    UserVO User = (UserVO) session.getAttribute("User");
	    
	    if (User != null) {
	    	User.setCount(smService.chatLogCount(User.getUno()));
	        return User;
	    } else {
	        return null; // 세션이 없으면 프론트에서 리디렉션 처리
	    }
	}
	
	// 프로필 계정 확인
	@GetMapping("/checkProfile")
	public Map<String, Object> checkProfile(HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");
	    Map<String, Object> result = new HashMap<>();

	    if (user == null) {
	        result.put("exists", false);
	        return result;
	    }

	    ProfileVO profile = jshservice.getProfileByUno(user.getUno());
	    if (profile != null) {
	        result.put("exists", true);
	        result.put("nickname", profile.getNickname());

	        // 숫자 -> 파일명/URL 변환
	        Integer num = profile.getProfileimage(); // DB 숫자 (1부터 시작 가정)
	        if (num != null) {
	            String filename = "basic" + (num) + "__.png"; // 규칙에 맞게
	            String url = "/profile/" + filename;              // 정적 매핑된 URL
	            result.put("profileImageUrl", url);
	            result.put("profileImageFilename", filename);
	        }
	    } else {
	        result.put("exists", false);
	    }
	    return result;
	}
	
	// 프로필 생성
	@PostMapping("/createProfile")
	public Map<String, Object> createProfile(@RequestBody ProfileVO profileVO, HttpSession session) {
	    UserVO User = (UserVO) session.getAttribute("User");
	    Map<String, Object> result = new HashMap<>();

	    if (User == null) {
	        result.put("success", false);
	        result.put("message", "로그인이 필요합니다.");
	        return result;
	    }

	    profileVO.setUno(User.getUno());
	    boolean created = jshservice.createProfile(profileVO);

	    result.put("success", created);
	    result.put("message", created ? "프로필 생성 완료" : "생성 실패");
	    return result;
	}
	
	@PostMapping("/naver")
    public ResponseEntity<Map<String, Object>> naverLogin(@RequestBody Map<String, String> body, HttpSession session) {
        String code = body.get("code");
        Map<String, Object> userProfile  = jshservice.loginWithNaver(code);
        
        String userId = (String) userProfile.get("email");
        UserVO userVO = jshservice.getUserById(userId);
        jshservice.expireSubscriptionIfNeeded(userVO.getUno());
        userVO = jshservice.getUserById(userId);
        session.setAttribute("User", userVO);
        
        return ResponseEntity.ok(userProfile );
    }
	
	@PostMapping("/kakao/check")
	public ResponseEntity<?> checkKakaoUser(@RequestBody Map<String, String> body, HttpSession session) {
	    String code = body.get("code");

	    try {
	        Map<String, String> tokenInfo = jshservice.getKakaoEmail(code);
	        String email = tokenInfo.get("email");
	        String accessToken = tokenInfo.get("accessToken");

	        if (email == null || accessToken == null) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Map.of("success", false, "message", "이메일 또는 토큰 확인 실패"));
	        }

	        UserVO userVO = jshservice.getUserById(email);
	        if (userVO != null) {
	        	jshservice.expireSubscriptionIfNeeded(userVO.getUno());
	        	userVO = jshservice.getUserById(email);
	            session.setAttribute("User", userVO);
	            
	            return ResponseEntity.ok(Map.of(
	                "exists", true,
	                "email", email,
	                "accessToken", accessToken
	            ));
	        } else {
	            return ResponseEntity.ok(Map.of(
	                "exists", false,
	                "email", email,
	                "accessToken", accessToken
	            ));
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "message", "카카오 확인 실패"));
	    }
	}

	@PostMapping("/kakao")
	public ResponseEntity<?> kakaoCallback(@RequestBody Map<String, String> body, HttpSession session) {
	    String email = body.get("email");
	    String accessToken = body.get("accessToken");
	    String birth = body.get("birth");

	    try {
	        UserVO userVO = jshservice.handleKakaoLogin(accessToken, email, birth);
	        jshservice.expireSubscriptionIfNeeded(userVO.getUno());
	        userVO = jshservice.getUserById(email);
	        session.setAttribute("User", userVO);
	        
	        return ResponseEntity.ok(Map.of("success", true, "user", userVO));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "message", "카카오 인증 실패"));
	    }
	}
	
	@PostMapping("/google/check")
	public ResponseEntity<?> checkGoogleUser(@RequestBody Map<String, String> body, HttpSession session) {
	    String code = body.get("code");

	    try {
	        Map<String, String> tokenInfo = jshservice.getGoogleEmail(code);
	        String email = tokenInfo.get("email");
	        String accessToken = tokenInfo.get("accessToken");

	        if (email == null || accessToken == null) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Map.of("success", false, "message", "이메일 또는 토큰 확인 실패"));
	        }

	        UserVO userVO = jshservice.getUserById(email);
	        if (userVO != null) {
	        	jshservice.expireSubscriptionIfNeeded(userVO.getUno());
	        	userVO = jshservice.getUserById(email);
	            session.setAttribute("User", userVO);
	            
	            return ResponseEntity.ok(Map.of(
	                "exists", true,
	                "email", email,
	                "accessToken", accessToken
	            ));
	        } else {
	            return ResponseEntity.ok(Map.of(
	                "exists", false,
	                "email", email,
	                "accessToken", accessToken
	            ));
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "message", "구글 확인 실패"));
	    }
	}

	@PostMapping("/google")
	public ResponseEntity<?> googleCallback(@RequestBody Map<String, String> body, HttpSession session) {
	    String email = body.get("email");
	    String accessToken = body.get("accessToken");
	    String birth = body.get("birth");

	    try {
	        UserVO userVO = jshservice.handleGoogleLogin(accessToken, email, birth);
	        jshservice.expireSubscriptionIfNeeded(userVO.getUno());
	        userVO = jshservice.getUserById(email);
	        session.setAttribute("User", userVO);
	        
	        return ResponseEntity.ok(Map.of("success", true, "user", userVO));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body(Map.of("success", false, "message", "구글 인증 실패"));
	    }
	}
	
	@PostMapping("/voicetotext")
	public ResponseEntity<Map<String, Object>> voiceToText(@RequestParam("voice") MultipartFile voiceFile) {
	    String result = jshservice.convertVoiceToText(voiceFile);
	    return ResponseEntity.ok(Map.of("text", result));
	}
	
	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest req, HttpServletResponse res) {
	    // 1) 세션 무효화
	    HttpSession session = req.getSession(false);
	    if (session != null) {
	        session.invalidate();
	    }
	    // 2) JSESSIONID 쿠키 만료시키기
	    Cookie cookie = new Cookie("JSESSIONID", null);
	    cookie.setPath("/");
	    cookie.setHttpOnly(true);
	    cookie.setMaxAge(0);   // 즉시 만료
	    res.addCookie(cookie);

	    return ResponseEntity.ok().build();
	}
}

