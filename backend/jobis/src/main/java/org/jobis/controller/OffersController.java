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
@RequestMapping("/offers")
public class OffersController {
	@Autowired
	private SmService service;
	
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
	@GetMapping("/oneInterViewByOno")
	public InterViewBCVO oneInterViewByOno(int ono) {
		System.out.println("해당 공고 가져오기");
		return service.oneInterViewByOno(ono);
	}
	
	// 공고 답변, 질문 가져오기
	@GetMapping("/selectOfferAndSubmission")
	public OfferSubmissionDTO selectOfferAndSubmission(int ono, int emp, int company) {
		System.out.println("공고 답변, 질문 가져오기");
		return service.selectOfferAndSubmission(ono, emp, company);
	}
}