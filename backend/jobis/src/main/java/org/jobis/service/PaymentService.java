package org.jobis.service;

import java.util.Map;

import javax.servlet.http.HttpSession;

public interface PaymentService {
	public String verifyAndCompletePayment(Map<String, Object> paymentData, HttpSession session);
}
