package org.jobis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;

@Service
public class AiServiceImpl implements AiService{

	@Value("${key.openAI}")
	private String aiApiKey;
	
//	@Override
//	public void getResultStream(String prompt, ResponseStreamListener listener) {
//		OpenAIClient client = OpenAIOkHttpClient.builder()
//				.apiKey(aiApiKey)
//				.build();
//
//			ResponseCreateParams params = ResponseCreateParams.builder()
//				.input(prompt)
//				.model(ChatModel.CHATGPT_4O_LATEST)
//				.stream(true)
//				.build();
//
//			client.responses().createStream(params, listener);
//	};
}
