package org.jobis.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

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
	public ResponseEntity<String> completePayment(@RequestBody Map<String, Object> paymentData, HttpSession session) {
		log.info("📥 결제 완료 요청 수신: " + paymentData);
		String result = paymentService.verifyAndCompletePayment(paymentData, session);

		if ("PAID".equals(result)) {
			return ResponseEntity.ok("PAID");
		} else if ("AMOUNT_MISMATCH".equals(result)) {
			return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body("❌ 결제 금액 불일치");
		} else if ("INVALID_MONTHS".equals(result)) {
			return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body("❌ 잘못된 구독 기간");
		} else if (result.startsWith("ERROR_")) {
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("❌ 서버 오류: " + result);
		} else {
			return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body("❌ 알 수 없는 오류: " + result);
		}
	}

}
