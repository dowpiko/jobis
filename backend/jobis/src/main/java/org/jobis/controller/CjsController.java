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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@CrossOrigin(origins = "*")

public class CjsController {
	
	@Autowired
	private UserChatService ucservice;
	
	
	// userchat insert
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
	@GetMapping(value = "/getUserChat", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CJSVO> getUserChat(){
		
		List<CJSVO> chatList =ucservice.getUserChat(); 
		return chatList;
	}
	


	
}
