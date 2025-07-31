package org.jobis.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.jobis.domain.CUserVO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.101:3000"}, allowCredentials = "true")
@RequestMapping("/user")
public class UserController {
	@Autowired
	private UserService userService;
	
	// 아이디 중복확인
	@GetMapping("/findUserId")
	public int findUserId(@RequestParam("id") String id) {
		System.out.println("아이디 중복확인");
		return userService.findUserId(id);
	};
	
	// 아이디 중복 확인
	@GetMapping("/checkid")
	public Map<String, Boolean> checkUsername(@RequestParam String id) {
		return Collections.singletonMap("available", userService.checkId(id));
	}
	
	// 기업 불러오기
	@GetMapping("/checkComp")
	public ResponseEntity<String> getCorpInfo(@RequestParam("crno") String crno) {
		System.out.println("법인 조회");
	    return userService.findCompany(crno);
	};
	
	// 기업 회원가입
	@PostMapping("/insertCUser")
	@ResponseBody
	public int insertCUser(@RequestBody CUserVO cuvo) {
		System.out.println("기업 회원가입");
		return userService.insertCUser(cuvo);
	}
	
	// 디스코드 프로필 업데이트
	@PostMapping("/updateNickname")
	public ResponseEntity<?> updateNickname(@RequestBody ProfileVO vo, HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");
	    
	    if (user == null) {
	        return ResponseEntity.status(401).body(Map.of("success", false));
	    }

	    String nickname = vo.getNickname();
	    nickname = nickname.trim();
	    vo.setUno(user.getUno());
	    vo.setNickname(nickname);
	    
	    int count = userService.countNicknameExceptMe(vo);
	    if (count > 0) {
	        return ResponseEntity.status(409).body(Map.of(
	                "success", false,
	                "duplicated", true,
	                "msg", "중복된 닉네임입니다."
	        ));
	    }

	    boolean ok = userService.updateProfile(vo) > 0;
	    return ResponseEntity.ok(Map.of(
	            "success", ok,
	            "duplicated", false
	    ));
	}
	
	// 기업 데이터 가져오기
	@GetMapping("/selectCinofoByUno")
	public CUserVO selectCinofoByUno(@RequestParam("uno") int uno) {
		return userService.selectCinofoByUno(uno);
	}
	
	// react에서는 세션정보를 직접 못받아와서 여기서 따로 보내줘야된다해서 넣는거
	@ResponseBody
	@GetMapping("/getMyUno")
	public ResponseEntity<Integer> getMyUno(HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");

	    if (user == null) {
	        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	    }

	    return new ResponseEntity<>(user.getUno(), HttpStatus.OK);
	}
	
	// uno로 프로필 접근하기
	@GetMapping("/getProfileImageByUno")
	public Map<String, Object> getProfileImageByUno(@RequestParam int uno) {
	    Map<String, Object> result = new HashMap<>();

	    ProfileVO profile = userService.getProfileByUno(uno);  
	    if (profile != null && profile.getProfileimage() >= 0) {
	        int profileNum = profile.getProfileimage();  
	        String filename = "basic" + profileNum + "__.png";
	        String url = "/profile/" + filename;

	        result.put("success", true);
	        result.put("profileImageUrl", url);
	        result.put("nickname", profile.getNickname());
	    } else {
	        result.put("success", false);
	        result.put("profileImageUrl", "/img/user.svg");
	    }

	    return result;
	}
	
	// 공고 스크랩하기
    @PostMapping("/addFavorite")
    public ResponseEntity<Integer> addFavorite(@RequestBody FavDTO favdto) {
        int result = userService.addFavorite(favdto);
        return ResponseEntity.ok(result);
    }
    
    // 스크랩 취소하기
    @DeleteMapping("/removeFavorite")
    public ResponseEntity<Integer> removeFavorite(@RequestBody FavDTO favdto) {
        int result = userService.removeFavorite(favdto);
        return ResponseEntity.ok(result);
    }
    
    // 유저가 지원한 공고 목록 가져오기
    @ResponseBody
    @PostMapping("/getApplied")
    public ResponseEntity<List<SubmissionDTO>> getApplied(@RequestBody Map<String, Integer> payload) {
        int uno = payload.get("uno");
        
        List<SubmissionDTO> list = userService.getAppliedByUno(uno);
        return ResponseEntity.ok(list);
    }
    
    // 공고 지원 취소하기
    @PostMapping("/deleteSubmission")
    @ResponseBody
    public ResponseEntity<?> deleteSubmission(@RequestBody Map<String, Integer> payload) {
        int result = userService.deleteSubmission(payload.get("uno"), payload.get("ono"));
        return ResponseEntity.ok(result);
    }
    
    // 회원가입
 	@PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody UserVO userVO) {		
        boolean success = userService.registerUser(userVO);
        Map<String, Object> result = new HashMap<>();
        result.put("success", success);
        result.put("message", success ? "가입 성공" : "이미 존재하는 사용자입니다");
        return result;
    }
 	
 	// 이메일에 인증 코드 보내기
 	@PostMapping("/sendemailcode")
 	public Map<String, Object> sendCode(@RequestBody Map<String, String> body) {
 		String email = body.get("email");
 		userService.sendVerificationCode(email);
 		return Collections.singletonMap("success", true);
 	}
 	
 	// 코드 확인
 	@PostMapping("/verifyemailcode")
 	public Map<String, Object> verify(@RequestParam String email, @RequestParam String code) {
 		System.out.println("verifyemailcode: " + email + " / " + code);
 		boolean verified = userService.verifyCode(email, code);
 		return Collections.singletonMap("verified", verified);
 	}
 	
 // 로그인
 	@PostMapping("/login")
 	public Map<String, Object> login(@RequestBody Map<String, String> body, HttpSession session) {
 		System.out.println("로그인");
 	    String id = body.get("id");
 	    String pw = body.get("pw");

 	    UserVO user = userService.loginUser(id, pw);
 	    
 	    Map<String, Object> result = new HashMap<>();
 	    if (user != null) {
 	    	userService.expireSubscriptionIfNeeded(user.getUno());
 	    	user = userService.getUserById(id);
 	        session.setAttribute("User", user); // ✅ 세션에 저장
 	        
 	        result.put("success", true);
 	        result.put("userType", user.getAuth());
 	        result.put("uno", user.getUno());
 	    } else {
 	        result.put("success", false);
 	        result.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
 	    }
 	    System.out.println(result);
 	    return result;
 	}
 	
 	// 로그인 정보 확인
 	@GetMapping("/getUser")
 	public UserVO getUser(HttpSession session) {
 		System.out.println("로그인 정보 확인");
 	    UserVO User = (UserVO) session.getAttribute("User");
 	    System.out.println("User : " + User);
 	    if (User != null) {
 	    	User.setCount(userService.chatLogCount(User.getUno()));
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

 	    ProfileVO profile = userService.getProfileByUno(user.getUno());
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
 	    boolean created = userService.createProfile(profileVO);

 	    result.put("success", created);
 	    result.put("message", created ? "프로필 생성 완료" : "생성 실패");
 	    return result;
 	}
 	
 	@PostMapping("/naver")
     public ResponseEntity<Map<String, Object>> naverLogin(@RequestBody Map<String, String> body, HttpSession session) {
         String code = body.get("code");
         Map<String, Object> userProfile  = userService.loginWithNaver(code);
         
         String userId = (String) userProfile.get("email");
         UserVO userVO = userService.getUserById(userId);
         userService.expireSubscriptionIfNeeded(userVO.getUno());
         userVO = userService.getUserById(userId);
         session.setAttribute("User", userVO);
         
         return ResponseEntity.ok(userProfile );
     }
 	
 	@PostMapping("/kakao/check")
 	public ResponseEntity<?> checkKakaoUser(@RequestBody Map<String, String> body, HttpSession session) {
 	    String code = body.get("code");

 	    try {
 	        Map<String, String> tokenInfo = userService.getKakaoEmail(code);
 	        String email = tokenInfo.get("email");
 	        String accessToken = tokenInfo.get("accessToken");

 	        if (email == null || accessToken == null) {
 	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
 	                .body(Map.of("success", false, "message", "이메일 또는 토큰 확인 실패"));
 	        }

 	        UserVO userVO = userService.getUserById(email);
 	        if (userVO != null) {
 	        	userService.expireSubscriptionIfNeeded(userVO.getUno());
 	        	userVO = userService.getUserById(email);
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
 	        UserVO userVO = userService.handleKakaoLogin(accessToken, email, birth);
 	        userService.expireSubscriptionIfNeeded(userVO.getUno());
 	        userVO = userService.getUserById(email);
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
 	        Map<String, String> tokenInfo = userService.getGoogleEmail(code);
 	        String email = tokenInfo.get("email");
 	        String accessToken = tokenInfo.get("accessToken");
 	        if (email == null || accessToken == null) {
 	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
 	                .body(Map.of("success", false, "message", "이메일 또는 토큰 확인 실패"));
 	        }
 	        UserVO userVO = userService.getUserById(email);
 	        if (userVO != null) {
 	        	userService.expireSubscriptionIfNeeded(userVO.getUno());
 	        	userVO = userService.getUserById(email);
 	        	log.warn(userVO);
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
 	    System.out.println("구글 탔어요!!!");
 		String email = body.get("email");
 	    String accessToken = body.get("accessToken");
 	    String birth = body.get("birth");

 	    try {
 	        UserVO userVO = userService.handleGoogleLogin(accessToken, email, birth);
 	        userService.expireSubscriptionIfNeeded(userVO.getUno());
 	        userVO = userService.getUserById(email);
 	        session.setAttribute("User", userVO);
 	        
 	        return ResponseEntity.ok(Map.of("success", true, "user", userVO));
 	    } catch (Exception e) {
 	        e.printStackTrace();
 	        return ResponseEntity
 	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
 	            .body(Map.of("success", false, "message", "구글 인증 실패"));
 	    }
 	}
 	
 	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletRequest req, HttpServletResponse res) {
	    HttpSession session = req.getSession(false);
	    if (session != null) {
	        session.invalidate();
	    }
	    Cookie cookie = new Cookie("JSESSIONID", null);
	    cookie.setPath("/");
	    cookie.setHttpOnly(true);
	    cookie.setMaxAge(0);
	    res.addCookie(cookie);
	    
	    return ResponseEntity.ok().build();
	}
}