package org.jobis.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface AiInterviewService {
	public String convertVoiceToText(MultipartFile voiceFile);
}
