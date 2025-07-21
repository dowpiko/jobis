package org.jobis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;



@Service
public class PaymentServiceImpl implements PaymentService{
	
	@Value("${portone.v2.api.secret}")
	private String apiSecret;
	
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
    public String verifyAndCompletePayment(Map<String, Object> paymentData) {
        try {
            String paymentId = (String) paymentData.get("paymentId");

            String url = "https://api.portone.io/payments/" + paymentId;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "PortOne " + apiSecret);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

            JsonNode payment = objectMapper.readTree(response.getBody());

            int paidAmount = payment.at("/amount/total").asInt();
            int expectedAmount = 10000;

            if (paidAmount != expectedAmount) {
                return "AMOUNT_MISMATCH";
            }

            String status = payment.path("status").asText();
            return status; // e.g. "PAID", "VIRTUAL_ACCOUNT_ISSUED", etc.

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR_" + e.getClass().getSimpleName();
        }
    }
}
