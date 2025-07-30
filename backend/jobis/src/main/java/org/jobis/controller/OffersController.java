package org.jobis.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.CompanyOfferDTO;
import org.jobis.domain.InterViewBCVO;
import org.jobis.domain.OfferSubmissionDTO;
import org.jobis.domain.SubmissionDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.OffersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.101:3000"}, allowCredentials = "true")
@RequestMapping("/offers")
public class OffersController {
	@Autowired
	private OffersService offersService;
	
	// 면접 공고 등록
	@PostMapping("/insertInterView")
	@ResponseBody
	public int insertInterView(@RequestBody InterViewBCVO ivbc) {
		System.out.println("면접 공고 등록");
		return offersService.insertInterView(ivbc);
	}
	
	// 진행 중 / 마감
	@GetMapping("/progress")
	public List<InterViewBCVO> progress(@RequestParam("check") int check, @RequestParam("uno") int uno) {
		System.out.println("진행 중 / 마감");
		return offersService.progress(check, uno);
	}
	
	// 공고 지원한 사람 데이터
	@GetMapping("/selectByOno")
	public List<UserVO> selectByOno(int ono){
		System.out.println("공고 지원한 사람 데이터");
		return offersService.selectByOno(ono);
	}
	
	// 공고 삭제
	@GetMapping("/deleteByOno")
	public int deleteByOno(@RequestParam(value = "onos") List<Integer> onoList){
		System.out.println("공고 삭제");
		return offersService.deleteByOno(onoList);
	}
	
	// 해당 공고 가져오기
	@GetMapping("/oneInterViewByOno")
	public InterViewBCVO oneInterViewByOno(int ono) {
		System.out.println("해당 공고 가져오기");
		return offersService.oneInterViewByOno(ono);
	}
	
	// 공고 답변, 질문 가져오기
	@GetMapping("/selectOfferAndSubmission")
	public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company) {
		System.out.println("공고 답변, 질문 가져오기");
		return offersService.selectOfferAndSubmission(ono, emp, company);
	}
	
	// 기업 공고 가져오기
	@ResponseBody
	@GetMapping(value = "/getCompanyOffer", produces = MediaType.APPLICATION_JSON_VALUE)
	public List<CompanyOfferDTO> getCompanyOfferList(){
		return offersService.getCompanyOffers();
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
	   
	   int result = offersService.insertSubmission(submissiondto);
	   
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
        List<CompanyOfferDTO> list = offersService.getFavByUno(user.getUno());
        return ResponseEntity.ok(list);
    }
    
}