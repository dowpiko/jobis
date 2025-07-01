package org.jobis.controller;

import javax.servlet.http.HttpSession;

import org.jobis.domain.AISurveyDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
	@PostMapping("/saveSurveyResult")
	public ResponseEntity<String> getAiQuestion(@RequestBody AISurveyDTO surveyDTO, HttpSession session) {
		log.warn(surveyDTO);
		session.setAttribute("survey", surveyDTO);
	    return ResponseEntity.ok("ok");
	}
}
