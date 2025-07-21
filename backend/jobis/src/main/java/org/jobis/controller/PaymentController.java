package org.jobis.controller;

import java.util.Map;

import org.jobis.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.log4j.Log4j;


@Log4j
@RestController
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "http://192.168.0.101:3000"
	  }, allowCredentials = "true")
@RequestMapping("/payment")
public class PaymentController {
	
	@Autowired
	private PaymentService paymentService;
	
	@PostMapping(value = "/complete", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> completePayment(@RequestBody Map<String, Object> paymentData) {
        log.info("📥 결제 완료 요청 수신: " + paymentData);

        String result = paymentService.verifyAndCompletePayment(paymentData);

        switch (result) {
            case "PAID":
                return ResponseEntity.ok().body("✅ 결제 완료 처리됨");
            case "VIRTUAL_ACCOUNT_ISSUED":
                return ResponseEntity.ok().body("📥 가상계좌 발급됨 (입금 전)");
            default:
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ 결제 실패: " + result);
        }
    }
}
