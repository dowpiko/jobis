package org.jobis.controller;

import org.jobis.domain.CJSVO;
import org.jobis.service.UserChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.log4j.Log4j;

@Log4j
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/cjs")

public class CjsController {
	
	@Autowired
	private UserChatService ucservice;
	
	
	// userchat insert
	@PostMapping("/insertUserChat")
	public String register(@RequestBody CJSVO cjsvo) {
		 log.info("받은 데이터 → " + cjsvo);
		
		String result = ucservice.register(cjsvo) > 0 ? "success" : "fail";
		
		return result;
	}
	
}
