package org.jobis.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
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
@RequestMapping("/chat")
public class ChatController {
	@Autowired
	private SmService service;
	
	// 채팅방 생성
	@GetMapping("/insertChatRoom")
	public int insertChatRoom(int cno,int uno, int ono) {
		System.out.println("채팅방 생성");
		return service.insertChatRoom(cno, uno, ono);
	}
	
	// 기업이 채팅방 가져오기
	@GetMapping("/initCompanyChatLayout")
	public List<CompanyRoomDTO> initCompanyChatLayout(int cno) {
		System.out.println("기업이 채팅방 가져오기");
		return service.initCompanyChatLayout(cno);
	}
	
	// 유저가 채팅방 가져오기
	@GetMapping("/initUserChatLayout")
	public List<UserRoomDTO> initUserChatLayout(int uno) {
		System.out.println("유저가 채팅방 가져오기");
		return service.initUserChatLayout(uno);
	}
	
	// 채팅 저장
	@PostMapping("/insertChatMessage")
    public ResponseEntity<String> insertChatMessage(@RequestBody ChatMessageVO message) {
        int result = service.insertChatMessage(message);

        if (result > 0) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.status(500).body("fail");
        }
    }
	
	// 채팅 불러오기
	@GetMapping("/selectByRnoChatMessages")
	public List<ChatMessageVO> selectByRnoChatMessages(@RequestParam("rno") int rno, int uno) {
	    return service.selectByRnoChatMessages(rno, uno);
	}
}