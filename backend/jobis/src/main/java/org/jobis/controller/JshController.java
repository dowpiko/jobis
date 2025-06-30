package org.jobis.controller;

import java.util.Collections;
import java.util.Map;

import org.jobis.service.JshService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin(origins = "*")
@Controller
@RequestMapping("/jsh")
public class JshController {

	@Autowired
	JshService jshservice;
    
	@GetMapping("/checkid")
	@ResponseBody
	public Map<String, Boolean> checkUsername(@RequestParam String id) {
		jshservice.checkId(id);
		return Collections.singletonMap("available", true);
	}

	@PostMapping("/sendemailcode")
	@ResponseBody
	public Map<String, Object> sendCode(@RequestBody Map<String, String> body) {
		String email = body.get("email");
		System.out.println("SendEmailCode: " + email);
		jshservice.sendVerificationCode(email);
		return Collections.singletonMap("success", true);
	}

	@PostMapping("/verifyemailcode")
	@ResponseBody
	public Map<String, Object> verify(@RequestParam String email, @RequestParam String code) {
		System.out.println("verifyemailcode: " + email + " / " + code);
		boolean verified = jshservice.verifyCode(email, code);
		return Collections.singletonMap("verified", verified);
	}
}

