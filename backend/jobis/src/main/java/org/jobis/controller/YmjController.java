package org.jobis.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
	public List<AIVO> getAllResults(HttpSession session){
		UserVO User = (UserVO) session.getAttribute("User");
		System.out.println(User);
		int uno = User.getUno();
		return iService.getAllResults(uno);
	}
	
	@PostMapping(value = "/getFeedback", produces = "text/plain; charset=UTF-8")
	public CompletableFuture<ResponseEntity<String>> getFeedback(@RequestBody Map<String, Integer> payload) {
		int ano = payload.get("ano");
		System.out.println("📩 받은 ano: " + ano);

		return iService.getFeedbackFromAI(ano)
			.thenApply(feedback -> ResponseEntity.ok(feedback))
			.exceptionally(e -> {
				String msg = "❌ 처리 실패: " + e.getMessage();
				System.err.println(msg);
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
			});
	}

}
