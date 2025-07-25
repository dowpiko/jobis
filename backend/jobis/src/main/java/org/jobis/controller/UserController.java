package org.jobis.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CUserVO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserVO;
import org.jobis.service.SmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {
	@Autowired
	private SmService service;
	
	// 아이디 중복확인
	@GetMapping("/findUserId")
	public int findUserId(@RequestParam("id") String id) {
		System.out.println("아이디 중복확인");
		return service.findUserId(id);
	};
	
	// 기업 불러오기
	@GetMapping("/checkComp")
	public ResponseEntity<String> getCorpInfo(@RequestParam("crno") String crno) {
		System.out.println("법인 조회");
	    return service.findCompany(crno);
	};
	
	// 기업 회원가입
	@PostMapping("/insertCUser")
	@ResponseBody
	public int insertCUser(@RequestBody CUserVO cuvo) {
		System.out.println("기업 회원가입");
		return service.insertCUser(cuvo);
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
	    
	    int count = service.countNicknameExceptMe(vo);
	    if (count > 0) {
	        return ResponseEntity.status(409).body(Map.of(
	                "success", false,
	                "duplicated", true,
	                "msg", "중복된 닉네임입니다."
	        ));
	    }

	    boolean ok = service.updateProfile(vo) > 0;
	    return ResponseEntity.ok(Map.of(
	            "success", ok,
	            "duplicated", false
	    ));
	}
	
}