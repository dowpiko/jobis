package org.jobis.controller;

import java.util.Map;

import org.jobis.service.JshService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/naver")
public class NaverLoginController {

    @Autowired
    private JshService naverLoginService;

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
    	System.out.println("ininininin");
        String code = body.get("code");
        Map<String, Object> result = naverLoginService.loginWithNaver(code);
        return ResponseEntity.ok(result);
    }
}
