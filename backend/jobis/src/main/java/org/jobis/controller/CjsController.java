package org.jobis.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
	
	// 태그 별로 유저채팅 가져오기
	@ResponseBody
	@GetMapping(value = "/getUserChatByTag", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CJSVO>> getUserChatByTag(@RequestParam(required = false) String r_tag) {
	    List<CJSVO> chatList = ucservice.getUserChatByTag(r_tag);
	    return new ResponseEntity<>(chatList, HttpStatus.OK);
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
	// userChat 일정 조정하기
	@ResponseBody
	@GetMapping("/deleteUserChat")
	public ResponseEntity<String> deleteUserChat(@RequestParam("cno") int cno, HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");

	    if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }

	    CJSVO chat = ucservice.getChatByCno(cno);
	    if (chat == null) {
	        return new ResponseEntity<>("일정이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
	    }

	    int uno = user.getUno();

	    if (chat.getLeader() == uno) {
	        if (chat.getMember() != 0 && chat.getMember() != -1) {
	            // 🎯 리더 → 멤버로 승계
	            ucservice.promoteMemberToLeader(cno);
	            return new ResponseEntity<>("리더 승계 완료", HttpStatus.OK);
	        } else {
	            // 🎯 멤버 없음 → 삭제
	            ucservice.deleteUserChat(cno);
	            return new ResponseEntity<>("일정 삭제 완료", HttpStatus.OK);
	        }
	    } else if (chat.getMember() == uno) {
	        // 🎯 멤버 나가기
	        ucservice.leaveChatAsMember(cno);
	        return new ResponseEntity<>("참여 취소 완료", HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("삭제 권한이 없습니다.", HttpStatus.FORBIDDEN);
	    }
	}

	
	// 직종목록 집어 넣기
	@ResponseBody
	@GetMapping(value = "/jobCategories", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<String>> getJobCategories() {
	    List<String> jobList = List.of(
	        "프론트엔드 개발자",
	        "백엔드 개발자",
	        "디자이너",
	        "데이터 분석가",
	        "AI 엔지니어",
	        "PM",
	        "QA 엔지니어"
	    );

	    return new ResponseEntity<>(jobList, HttpStatus.OK);
	}

	// -----------------------------------기업 공고 관련-------------------------------------------
	// 기업 공고 가져오기
	@ResponseBody
	@GetMapping(value = "/getCompanyOffer", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CompanyOfferDTO> getCompanyOfferList(){
		return ucservice.getCompanyOffers();
	}
	
	// 기업 공고 작성 완료(유저가 답변 완료)
	@ResponseBody
	@PostMapping(value = "/insertSubmission", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> insertSubmission(@RequestBody SubmissionDTO submissiondto, HttpSession session){
	   UserVO user = (UserVO) session.getAttribute("User");
		
	   if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 만료 또는 로그인 필요");
       }
	   submissiondto.setUno(user.getUno());
	   if (submissiondto.getAnswers() != null) {
		   submissiondto.setO_content(String.join("\n", submissiondto.getAnswers()));
	    }
	   
	   int result = ucservice.insertSubmission(submissiondto);
	   
	   if (result == 1) {
           return ResponseEntity.ok("1");  
       } else {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("0");
       }
		
	}
	// 스크랩 목록 가져오기
    @PostMapping("/getFavorites")
    public ResponseEntity<List<SubmissionDTO>> getFavorites(@RequestBody Map<String, Integer> payload) {
        Integer uno = payload.get("uno");
        if (uno == null) {
            return ResponseEntity.badRequest().build();
        }
        List<SubmissionDTO> list = ucservice.getFavByUno(uno);
        return ResponseEntity.ok(list);
    }
    // 공고 스크랩하기
    @PostMapping("/addFavorite")
    public ResponseEntity<Integer> addFavorite(@RequestBody FavDTO favdto) {
        int result = ucservice.addFavorite(favdto);
        return ResponseEntity.ok(result);
    }
    // 스크랩 취소하기
    @DeleteMapping("/removeFavorite")
    public ResponseEntity<Integer> removeFavorite(@RequestBody FavDTO favdto) {
        int result = ucservice.removeFavorite(favdto);
        return ResponseEntity.ok(result);
    }
	
	
	

	
}
