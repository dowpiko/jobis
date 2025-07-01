package org.jobis.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CJSVO;
import org.jobis.domain.ChatMessageDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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
	
	// websocket용
	@MessageMapping("/sendMessage") // 클라이언트에서 보낼 경로
    @SendTo("/topic/public") // 구독하고 있는 클라이언트들에게 전송
    public ChatMessageDTO send(ChatMessageDTO message) {
        System.out.println("받은 메시지: " + message.getContent());
        return message;
    }


	
}
