package org.jobis.controller;

import java.util.List;

import org.jobis.domain.CUserVO;
import org.jobis.domain.InterViewBCVO;
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
	
	// 기업 등록	
	@PostMapping("/insertCUser")
	@ResponseBody
	public int insertCUser(@RequestBody CUserVO cuvo) {
		System.out.println(cuvo);
		return service.insertCUser(cuvo);
	}
	
	/* ----------------------------------------------------------------------------------- */
	
	// 면접 공고 등록
	@PostMapping("/insertInterView")
	@ResponseBody
	public int insertInterView(@RequestBody InterViewBCVO ivbc) {
		// uno 수정하기
		ivbc.setUno(2);
		System.out.println(ivbc);
		return service.insertInterView(ivbc);
	}
	
	// 진행 중 / 마감
	@GetMapping("/progress")
	public List<InterViewBCVO> progress(int check) {
		return service.progress(check);
	}
	
	// 공고 지원한 사람 데이터
	@GetMapping("/selectByOno")
	public List<UserVO> selectByOno(int ono){
		System.out.println(service.selectByOno(ono));
		return service.selectByOno(ono);
	}
	
	// 해당 공고 가져오기
	@GetMapping("oneInterViewByOno")
	public InterViewBCVO oneInterViewByOno(int ono) {
		System.out.println("ono : " + ono);
		System.out.println("결과 : " + service.oneInterViewByOno(ono));
		return service.oneInterViewByOno(ono);
	}
}
