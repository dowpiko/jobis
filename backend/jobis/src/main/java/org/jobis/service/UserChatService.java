package org.jobis.service;

import org.jobis.domain.CJSVO;
import org.springframework.stereotype.Service;
@Service
public interface UserChatService {

	// ����ä�� �����ϱ�
	public int register(CJSVO cjsvo);
}
