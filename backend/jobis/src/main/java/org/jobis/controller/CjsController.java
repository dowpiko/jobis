package org.jobis.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CJSVO;
import org.jobis.domain.UserVO;
import org.jobis.service.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import lombok.extern.log4j.Log4j;

@Log4j

@Controller  //테스트용으로 
//@RestController
@CrossOrigin(origins = "*")

public class CjsController {
	
	@Autowired
	private UserChatService ucservice;
	
	
	// userchat insert
	@ResponseBody
	@PostMapping("/insertUserChat")
	public ResponseEntity<String> register(@RequestBody CJSVO cjsvo, HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");
	    System.out.println("세션 유저: " + user);

	    if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }

	    cjsvo.setLeader(user.getUno());

	    int result = ucservice.register(cjsvo);
	    return new ResponseEntity<>(result > 0 ? "success" : "fail", HttpStatus.OK);
	}

	
	// 유저채팅 가져오기
	@ResponseBody
	@GetMapping(value = "/getUserChat", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CJSVO> getUserChat(){
		
		List<CJSVO> chatList =ucservice.getUserChat(); 
		
		
		return chatList;
	}
	
	// 모의면접에 member로 참여하기
	@ResponseBody
	@PostMapping("/joinChat")
	public ResponseEntity<String>joinChat(@RequestBody CJSVO cjsvo, HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("User");
		System.out.println("세션 유저: " + user);

		if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }

		
	     try {
	            int result = ucservice.joinChat(cjsvo.getCno() ,user.getUno());

	            if (result > 0) {
	                return ResponseEntity.ok("참여 완료");
	            } else {
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                                     .body("참여 실패");
	            }
	        } catch (Exception e) {
	        	e.printStackTrace(); // 콘솔 로그
	            String errorMessage = "서버 오류: " + e.getClass().getSimpleName() + " - " + e.getMessage();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
	        }
		
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



	
}
