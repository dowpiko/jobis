package org.jobis.service;

import java.util.Map;

public interface PaymentService {
	 String verifyAndCompletePayment(Map<String, Object> paymentData);
}
