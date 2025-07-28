package org.jobis.controller;

import org.jobis.service.DiscordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true")
@RequestMapping("/discord")
public class DiscordController {
	@Autowired
	private DiscordService dService;
	
	@GetMapping("/nickname/{uno}")
	public ResponseEntity<String> getNickname(@PathVariable("uno") Integer uno) {
	    if (uno == null) {
	        return ResponseEntity.badRequest().body("Missing 'uno'");
	    }
	    String nickname = dService.getUserName(uno);
	    if (nickname != null) {
	        return ResponseEntity.ok(nickname);
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nickname not found");
	    }
	}
}
