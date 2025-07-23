package org.jobis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.jobis.domain.UserVO;
import org.jobis.mapper.JshMapper;
import org.jobis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;

import javax.servlet.http.HttpSession;



@Service
public class PaymentServiceImpl implements PaymentService{
	
	@Value("${portone.v2.api.secret}")
	private String apiSecret;
	
	private final ObjectMapper objectMapper = new ObjectMapper();
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private JshMapper jshMapper;

	@Override
	public String verifyAndCompletePayment(Map<String, Object> paymentData, HttpSession session) {
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
			    UserVO user = userMapper.getUserByUno(uno); // 기존 구독정보 조회
			    LocalDate baseDate;

			    if (user.getSubscribe() == 1 && user.getSubscribeDate() != null &&
			        !user.getSubscribeDate().toLocalDate().isBefore(LocalDate.now())) {
			        // 유효한 구독 상태일 경우: 기존 구독 만료일 기준으로 갱신
			        baseDate = user.getSubscribeDate().toLocalDate();
			        System.out.println("📅 기존 구독 만료일 기준으로 연장: " + baseDate);
			    } else {
			        // 구독이 없거나 만료된 경우: 오늘 날짜 기준
			        baseDate = LocalDate.now();
			        System.out.println("📅 현재 날짜 기준으로 구독 시작: " + baseDate);
			    }
				LocalDate expireDate = baseDate.plusMonths(months);
				Date subscribeDate = Date.valueOf(expireDate);

				int temp = userMapper.completeSubscriptionPayment(uno, 1, subscribeDate); // ✅ DB 반영
				if(temp>0) {
					UserVO updatedUser = userMapper.getUserByUno(uno); // 최신값으로 다시 불러오기
					session.setAttribute("User", updatedUser);	
				}
			}

			return status;

		} catch (Exception e) {
			e.printStackTrace();
			return "ERROR_" + e.getClass().getSimpleName();
		}
	}

}
