package org.jobis.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.jobis.domain.AISurveyDTO;
import org.jobis.domain.AIVO;
import org.jobis.domain.InterviewResultDTO;
import org.jobis.domain.UserVO;
import org.jobis.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "http://192.168.0.101:3000"
	  }, allowCredentials = "true")
@RequestMapping("/ymj")
public class YmjController {
	
	@Autowired
	InterviewService iService;
	
	@PostMapping("/saveSurveyResult")
	public ResponseEntity<String> saveSurveyResult(@RequestBody AISurveyDTO surveyDTO, HttpSession session) {
		log.warn(surveyDTO);
		session.setAttribute("survey", surveyDTO);
	    return ResponseEntity.ok("ok");
	}
	
	@PostMapping("/saveInterviewResult")
	public ResponseEntity<String> saveInterviewResult(@RequestBody List<InterviewResultDTO> resultList, HttpSession session){
		boolean flag = iService.handleResultData(resultList, session)>0;
		return flag ? ResponseEntity.ok("ok") : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("데이터 저장 실패");
	}
	
	@GetMapping("/getAllResults")
	public List<AIVO> getAllResults(@RequestParam("uno") int uno){
		System.out.println("uno : "+uno);
		return iService.getAllResults(uno);
	}
	
	@PostMapping(value = "/getFeedback", produces = "text/plain; charset=UTF-8")
	public String getFeedback(@RequestBody Map<String, Integer> payload, HttpSession session) {
		int ano = payload.get("ano");
		System.out.println("!!!"+ano+"!!!");
		return iService.getFeedbackFromAI(ano, session);
	}
	@PutMapping("/updateDate")
	public String updateDate(HttpSession session) {
		UserVO user = (UserVO)session.getAttribute("User");
		int uno = user.getUno();
		return iService.updateLastTryDate(uno,session)?"success":"fail";
	}
}
