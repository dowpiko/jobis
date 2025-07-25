package org.jobis.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CJSVO;
import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.FavDTO;
import org.jobis.domain.PenaltyVO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.UserChatService;
import org.jobis.websocket.ChatSocket2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import lombok.extern.log4j.Log4j;

@Log4j

//@Controller
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9090"}, allowCredentials = "true")


public class CjsController {
	
	@Autowired
	private UserChatService ucservice;
	

	// userchat insert
	@ResponseBody
	@PostMapping("/insertUserChat")
	public ResponseEntity<String> register(@RequestBody CJSVO cjsvo, HttpSession session) {
	    UserVO user = (UserVO) session.getAttribute("User");

	    if (user == null) {
	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
	    }

	    cjsvo.setLeader(user.getUno());
	    int result = ucservice.register(cjsvo);
	   
	    Date regdate = ucservice.getRegdate(cjsvo);
	    cjsvo.setR_regdate(regdate);
	    
	    
	    if (result > 0) {
	        ChatSocket2.getInstance().broadcastChatRoom(cjsvo);
	        return new ResponseEntity<>("success", HttpStatus.OK);
	    } else {
	        return new ResponseEntity<>("fail", HttpStatus.OK);
	    }

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
	@DeleteMapping(value = "/deleteUserChat", produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> deleteUserChat(@RequestBody Map<String, Integer> payload, HttpSession session) {
		System.out.println("delete 맵핑");
		int cno = payload.get("cno");
		System.out.println("cno : "+cno);
		UserVO user = (UserVO)session.getAttribute("User");
		int uno = user.getUno();
		System.out.println("uno : "+uno);
	    try {
	        // 1) 로그인(세션) 체크
	        System.out.println("UserVO = " + uno);
//	        if (user == null) {
//	            return ResponseEntity
//	                .status(HttpStatus.UNAUTHORIZED)
//	                .body("세션 만료: 로그인 후 이용해주세요.");
//	        }

	        // 2) 일정 조회
	        CJSVO chat = ucservice.getChatByCno(cno);
	        if (chat == null) {
	            return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body("삭제할 일정이 존재하지 않습니다.");
	        }

	        Integer member = chat.getMember();    // wrapper → null 가능
	        Integer leader = chat.getLeader();    // wrapper → null 가능
	        Date    schDate = chat.getSch_date(); // null 가능
	        Date    now     = new Date();
	        System.out.println("멤버 : " + member+"\n리더 : "+leader+"\n스케줄 날짜 : "+schDate+"\n현재 날짜 : "+now);
	        // 3) 패널티 로직: member 있을 때 + schDate 있을 때만
	        if (member != null && member != 0 && schDate != null) {
	            long diffMs = schDate.getTime() - now.getTime();
	            if (diffMs > 0 && diffMs < 24L * 60 * 60 * 1000) {
	                PenaltyVO penalty = ucservice.getPenaltyByUno(uno);
	                log.warn("잉? : "+penalty);
	                if (penalty == null) {
	                    penalty = new PenaltyVO();
	                    penalty.setUno(uno);
	                    penalty.setCount(1);
	                    System.out.println("페널티 됐나 : "+ucservice.insertPenalty(penalty));
	                } else {
	                    int count = penalty.getCount() + 1;
	                    penalty.setCount(count);
	                    if (count >= 3) {
	                        Calendar cal = Calendar.getInstance();
	                        if      (count == 3) cal.add(Calendar.DATE, 3);
	                        else if (count == 4) cal.add(Calendar.DATE, 7);
	                        else if (count == 5) cal.add(Calendar.MONTH, 1);
	                        else if (count == 6) cal.add(Calendar.MONTH, 3);
	                        else                 cal.add(Calendar.MONTH, 6);
	                        penalty.setUntil(cal.getTime());
	                    }
	                    ucservice.updatePenalty(penalty);
	                }
	            }
	        }

	        // 4) 리더 ⇄ 멤버 분기
	        if (leader != null && leader == uno) {
	            // 리더가 취소
	            if (member != null && member != 0 && member != -1) {
	                ucservice.promoteMemberToLeader(cno);
	                CJSVO updated = ucservice.getChatByCno(cno);
	                if (updated != null) {
	                    ChatSocket2.getInstance().broadcastChatRoom(updated);
	                }
	                return ResponseEntity.ok("리더 승계 완료");
	            } else {
	            	CJSVO updated = ucservice.getChatByCno(cno);
	                if (updated != null) {
	                    ChatSocket2.getInstance().broadcastChatRoom(updated);
	                }
	                ucservice.deleteUserChat(cno);
	                return ResponseEntity.ok("일정 삭제 완료");
	            }

	        } else if (member != null && member == uno) {
	            // 멤버가 스스로 나감
	            ucservice.leaveChatAsMember(cno);
	            CJSVO updated = ucservice.getChatByCno(cno);
	            //  여ㅓ기서 왜 오류가?
	            if (updated != null) {
	                ChatSocket2.getInstance().broadcastChatRoom(updated);
	            }
	            //
	            return ResponseEntity.ok("참여 취소 완료");

	        } else {
	            // 권한 없음
	            return ResponseEntity
	                .status(HttpStatus.FORBIDDEN)
	                .body("삭제 권한이 없습니다.");
	        }

	    } catch (Exception e) {
	        log.error("deleteUserChat 처리 중 예외 발생 (cno=" + cno + ")", e);
	        return ResponseEntity
	            .status(HttpStatus.INTERNAL_SERVER_ERROR)
	            .body("서버 오류: " + e.getClass().getSimpleName() + " - " + e.getMessage());
	    }
	}

//	public ResponseEntity<String> deleteUserChat(@RequestBody Map<String, Integer> payload, HttpSession session) {
//	    UserVO user = (UserVO) session.getAttribute("User");
//	    int cno = payload.get("cno");
//	    if (user == null) {
//	        return new ResponseEntity<>("세션 만료", HttpStatus.UNAUTHORIZED);
//	    }
//
//	    CJSVO chat = ucservice.getChatByCno(cno);
//	    if (chat == null) {
//	        return new ResponseEntity<>("일정이 존재하지 않습니다.", HttpStatus.NOT_FOUND);
//	    }
//
//	    int uno = user.getUno();
//	    Date now = new Date();
//
//	    // member가 0이 아닌 경우 (상대 있음)
//	    if (chat.getMember() != 0 &&
//	        chat.getSch_date().getTime() - now.getTime() < (24 * 60 * 60 * 1000)) {
//	        
//	        PenaltyVO penalty = ucservice.getPenaltyByUno(uno);
//	        if (penalty == null) {
//	            PenaltyVO vo = new PenaltyVO();
//	            vo.setUno(uno);
//	            vo.setCount(1);
//	            ucservice.insertPenalty(vo);
//	        } else {
//	            int count = penalty.getCount() + 1;
//	            Date until = null;
//	            Calendar cal = Calendar.getInstance();
//
//	            if (count >= 3) {
//	                if (count == 3) cal.add(Calendar.DATE, 3);
//	                else if (count == 4) cal.add(Calendar.DATE, 7);
//	                else if (count == 5) cal.add(Calendar.MONTH, 1);
//	                else if (count == 6) cal.add(Calendar.MONTH, 3);
//	                else cal.add(Calendar.MONTH, 6);
//	                until = cal.getTime();
//	            }
//
//	            penalty.setCount(count);
//	            penalty.setUntil(until);
//	            ucservice.updatePenalty(penalty);
//	        }
//	    }
//	    
//	    
//	    if (chat.getLeader() == uno) {
//	        if (chat.getMember() != 0 && chat.getMember() != -1) {
//	            ucservice.promoteMemberToLeader(cno);
//	            CJSVO updatedChat = ucservice.getChatByCno(cno);
//	            if (updatedChat != null) {
//	                ChatSocket2.getInstance().broadcastChatRoom(updatedChat);
//	            }
//	            return new ResponseEntity<>("리더 승계 완료", HttpStatus.OK);
//	        } else {
//	            ucservice.deleteUserChat(cno);
//	            return new ResponseEntity<>("일정 삭제 완료", HttpStatus.OK);
//	        }
//	    } else if (chat.getMember() == uno) {
//	        ucservice.leaveChatAsMember(cno);
//	        CJSVO updatedChat = ucservice.getChatByCno(cno);
//	        if (updatedChat != null) {
//	            ChatSocket2.getInstance().broadcastChatRoom(updatedChat);
//	        }
//	        return new ResponseEntity<>("참여 취소 완료", HttpStatus.OK);
//	    } else {
//	        return new ResponseEntity<>("삭제 권한이 없습니다.", HttpStatus.FORBIDDEN);
//	    }
//	}

	// 패널티 정보 가져오기
	@GetMapping("/getPenaltyStatus")
	@ResponseBody
	public PenaltyVO getPenaltyStatus(HttpSession session) {
		UserVO user = (UserVO) session.getAttribute("User");
		if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
		
		Integer uno = user.getUno();
	    return ucservice.getPenaltyByUno(uno);  // null이면 패널티 없음
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
    public ResponseEntity<List<CompanyOfferDTO>> getFavorites(@RequestBody Map<String, Integer> payload, HttpSession session) {
        UserVO user = (UserVO) session.getAttribute("User");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CompanyOfferDTO> list = ucservice.getFavByUno(user.getUno());
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
	// 유저가 지원한 공고 목록 가져오기
    @ResponseBody
    @PostMapping("/getApplied")
    public ResponseEntity<List<SubmissionDTO>> getApplied(@RequestBody Map<String, Integer> payload) {
        int uno = payload.get("uno");
        
        List<SubmissionDTO> list = ucservice.getAppliedByUno(uno);
        return ResponseEntity.ok(list);
    }
    
    // 공고 지원 취소하기
    @PostMapping("/deleteSubmission")
    @ResponseBody
    public ResponseEntity<?> deleteSubmission(@RequestBody Map<String, Integer> payload) {
        int uno = payload.get("uno");  // React에서 보낸 uno
        int ono = payload.get("ono");  // React에서 보낸 ono
        
        int result = ucservice.deleteSubmission(uno, ono);

        return ResponseEntity.ok(result);
    }
    
	
 


	
}
