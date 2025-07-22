package org.jobis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.jobis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;



@Service
public class PaymentServiceImpl implements PaymentService{
	
	@Value("${portone.v2.api.secret}")
	private String apiSecret;
	
	private final ObjectMapper objectMapper = new ObjectMapper();
	
	@Autowired
	private UserMapper userMapper;

	@Override
	public String verifyAndCompletePayment(Map<String, Object> paymentData) {
		try {
			String paymentId = (String) paymentData.get("paymentId");
			int months = (int) paymentData.get("months");
			int uno = (int) paymentData.get("uno");

			System.out.println("📥 사용자: " + uno + ", 구독 기간: " + months + "개월");

			// ✅ expectedAmount 계산
			int expectedAmount = -1;
			switch (months) {
				case 1:
					expectedAmount = 17000;
					break;
				case 3:
					expectedAmount = (int) Math.round(17000 * 3 * 0.95);
					break;
				case 6:
					expectedAmount = (int) Math.round(17000 * 6 * 0.88);
					break;
				case 12:
					expectedAmount = (int) Math.round(17000 * 12 * 0.80);
					break;
				default:
					expectedAmount = -1;
			}

			if (expectedAmount == -1) {
				System.out.println("⚠️ 잘못된 구독 기간: " + months);
				return "INVALID_MONTHS";
			}

			// ✅ 결제 검증 요청
			String url = "https://api.portone.io/payments/" + paymentId;
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "PortOne " + apiSecret);
			HttpEntity<Void> request = new HttpEntity<>(headers);

			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
			JsonNode payment = objectMapper.readTree(response.getBody());

			int paidAmount = payment.at("/amount/total").asInt();
			if (paidAmount != expectedAmount) {
				System.out.println("❌ 금액 불일치: 예상 " + expectedAmount + ", 실제 " + paidAmount);
				return "AMOUNT_MISMATCH";
			}

			String status = payment.path("status").asText();
			if ("PAID".equals(status)) {
				LocalDate expireDate = LocalDate.now().plusMonths(months);
				Date subscribeDate = Date.valueOf(expireDate);

				userMapper.completeSubscriptionPayment(uno, 1, subscribeDate); // ✅ DB 반영

				System.out.println("✅ 구독 정보 갱신 완료: 상태 1, 만료일 " + subscribeDate);
			}

			return status;

		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR_" + e.getClass().getSimpleName();
		}
	}

}
