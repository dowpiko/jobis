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
@RequestMapping("/sm")
public class SmController {
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
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
	@PostMapping("/insertInterView")
	@ResponseBody
	public int insertInterView(@RequestBody InterViewBCVO ivbc) {
		System.out.println("면접 공고 등록");
		return service.insertInterView(ivbc);
	}
	
	// 진행 중 / 마감
	@GetMapping("/progress")
	public List<InterViewBCVO> progress(@RequestParam("check") int check, @RequestParam("uno") int uno) {
		System.out.println("진행 중 / 마감");
		return service.progress(check, uno);
	}
	
	// 공고 지원한 사람 데이터
	@GetMapping("/selectByOno")
	public List<UserVO> selectByOno(int ono){
		System.out.println("공고 지원한 사람 데이터");
		return service.selectByOno(ono);
	}
	
	// 공고 삭제
	@GetMapping("/deleteByOno")
	public int deleteByOno(@RequestParam(value = "onos") List<Integer> onoList){
		System.out.println("공고 삭제");
		return service.deleteByOno(onoList);
	}
	
	// 해당 공고 가져오기
	@GetMapping("oneInterViewByOno")
	public InterViewBCVO oneInterViewByOno(int ono) {
		System.out.println("해당 공고 가져오기");
		return service.oneInterViewByOno(ono);
	}
	
	/* ----------------------------------------------------------------------------------- */
	
	// 채팅방 생성
	@GetMapping("insertChatRoom")
	public int insertChatRoom(int cno,int uno, int ono) {
		System.out.println("채팅방 생성");
		return service.insertChatRoom(cno, uno, ono);
	}
	
	// 기업이 채팅방 가져오기
	@GetMapping("initCompanyChatLayout")
	public List<CompanyRoomDTO> initCompanyChatLayout(int cno) {
		System.out.println("기업이 채팅방 가져오기");
		return service.initCompanyChatLayout(cno);
	}
	
	// 유저가 채팅방 가져오기
	@GetMapping("initUserChatLayout")
	public List<UserRoomDTO> initUserChatLayout(int uno) {
		System.out.println("유저가 채팅방 가져오기");
		return service.initUserChatLayout(uno);
	}
	
	// 공고 답변, 질문 가져오기
	@GetMapping("selectOfferAndSubmission")
	public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company) {
		System.out.println("공고 답변, 질문 가져오기");
		return service.selectOfferAndSubmission(ono, emp, company);
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
	
	// 기업 데이터 가져오기
	@GetMapping("/selectCinofoByUno")
	public CUserVO selectCinofoByUno(@RequestParam("uno") int uno) {
		return service.selectCinofoByUno(uno);
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