package org.jobis.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.UserChatVO;
import org.jobis.domain.CUserVO;
import org.jobis.domain.ChatMessageVO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.PenaltyVO;
import org.jobis.domain.ProfileVO;
import org.jobis.domain.UserRoomDTO;
import org.jobis.domain.CompanyRoomDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.SmService;
import org.jobis.service.UserChatService;
import org.jobis.websocket.ChatSocket2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.log4j.Log4j;

@Log4j
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.101:3000"}, allowCredentials = "true")
@RestController
@RequestMapping("/chat")
public class ChatController {
	@Autowired
	private SmService service;
	
	@Autowired
	private UserChatService ucservice;
	
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
	
	// 디스코스 유저 챗 저장
	@ResponseBody
	@PostMapping("/insertUserChat")
	public ResponseEntity<String> register(@RequestBody UserChatVO ucvo, HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");

	    if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }

	    ucvo.setLeader(user.getUno());
	    int result = ucservice.register(ucvo);
	   
	    Date regdate = ucservice.getRegdate(ucvo);
	    ucvo.setR_regdate(regdate);
	    
	    if (result > 0) {
	        ChatSocket2.getInstance().broadcastChatRoom(ucvo);
	        return new ResponseEntity<>("success", HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("fail", HttpStatus.OK);
	    }
	}
	
	// 유저채팅 가져오기
	@ResponseBody
	@GetMapping(value = "/getUserChat", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<UserChatVO> getUserChat(){
		List<UserChatVO> chatList =ucservice.getUserChat(); 
		return chatList;
	}
	
	// 태그 별로 유저채팅 가져오기
	@ResponseBody
	@GetMapping(value = "/getUserChatByTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<UserChatVO>> getUserChatByTag(@RequestParam(required = false) String r_tag) {
	    List<UserChatVO> chatList = ucservice.getUserChatByTag(r_tag);
	    return new ResponseEntity<>(chatList, HttpStatus.OK);
	}
	
	// 모의면접에 member로 참여하기
	@ResponseBody
	@PostMapping("/joinChat")
	public ResponseEntity<String>joinChat(@RequestBody UserChatVO ucvo, HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("User");

		if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }
		
	    try {
	        int result = ucservice.joinChat(ucvo.getCno() ,user.getUno());
	        
	        if (result > 0) {
	        	UserChatVO updated = ucservice.getChatByCno(ucvo.getCno());
	        	
		        if (updated != null) {
		        	ChatSocket2.getInstance().broadcastChatRoom(updated);
		        	}
	        return ResponseEntity.ok("참여 완료");
	        } else {
	        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("참여 실패");
	        	}
	       } catch (Exception e) {
	       	e.printStackTrace();
	           String errorMessage = "서버 오류: " + e.getClass().getSimpleName() + " - " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
	       }
	}
	
	// userChat 일정 조정하기
	@ResponseBody
	@DeleteMapping(value = "/deleteUserChat", produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> deleteUserChat(@RequestBody Map<String, Integer> payload, HttpSession session) {
		System.out.println("delete 맵핑");
		int cno = payload.get("cno");
		UserVO user = (UserVO)session.getAttribute("User");
		int uno = user.getUno();
	    try {
	        UserChatVO chat = ucservice.getChatByCno(cno);
	        if (chat == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제할 일정이 존재하지 않습니다.");}

	        Integer member = chat.getMember();
	        Integer leader = chat.getLeader();
	        Date    schDate = chat.getSch_date();
	        Date    now     = new Date();
	        
	        if (member != null && member != 0 && schDate != null) {
	            long diffMs = schDate.getTime() - now.getTime();
	            if (diffMs > 0 && diffMs < 24L * 60 * 60 * 1000) {
	                PenaltyVO penalty = ucservice.getPenaltyByUno(uno);
	                if (penalty == null) {
	                    penalty = new PenaltyVO();
	                    penalty.setUno(uno);
	                    penalty.setCount(1);
	                } else {
	                    int count = penalty.getCount() + 1;
	                    penalty.setCount(count);
	                    if (count >= 3) {
	                        Calendar cal = Calendar.getInstance();
	                        if      (count == 3) cal.add(Calendar.DATE, 3);
	                        else if (count == 6) cal.add(Calendar.DATE, 7);
	                        else if (count == 9) cal.add(Calendar.DATE, 14);
	                        else if (count == 12) cal.add(Calendar.MONTH, 1);
	                        else if (count == 15) cal.add(Calendar.MONTH, 3);
	                        else if (count >= 18) cal.add(Calendar.MONTH, 6);
	                        penalty.setUntil(cal.getTime());
	                    }
	                    ucservice.updatePenalty(penalty);
	                }
	            }
	        }

	        if (leader != null && leader == uno) {
	            if (member != null && member != 0 && member != -1) {
	                ucservice.promoteMemberToLeader(cno);
	                UserChatVO updated = ucservice.getChatByCno(cno);
	                if (updated != null) {
	                    ChatSocket2.getInstance().broadcastChatRoom(updated);
	                }
	                return ResponseEntity.ok("리더 승계 완료");
	            } else {
	            	UserChatVO updated = ucservice.getChatByCno(cno);
	                if (updated != null) {
	                    ChatSocket2.getInstance().broadcastChatRoom(updated);
	                }
	                ucservice.deleteUserChat(cno);
	                ChatSocket2.getInstance().broadcastDelete(cno);
	                return ResponseEntity.ok("일정 삭제 완료");
	            }

	        } else if (member != null && member == uno) {
	            ucservice.leaveChatAsMember(cno);
	            UserChatVO updated = ucservice.getChatByCno(cno);
	            if (updated != null) {
	                ChatSocket2.getInstance().broadcastChatRoom(updated);
	            }
	            return ResponseEntity.ok("참여 취소 완료");

	        } else {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("삭제 권한이 없습니다.");
	        }

	    } catch (Exception e) {
	        log.error("deleteUserChat 처리 중 예외 발생 (cno=" + cno + ")", e);
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("서버 오류: " + e.getClass().getSimpleName() + " - " + e.getMessage());
	    }
	}
	
	// 패널티 정보 가져오기
	@GetMapping("/getPenaltyStatus")
	@ResponseBody
	public PenaltyVO getPenaltyStatus(HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("User");
		if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		
		Integer uno = user.getUno();
	    return ucservice.getPenaltyByUno(uno);
	}
}