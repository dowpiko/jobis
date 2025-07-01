package org.jobis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

@Service
public class AiServiceImpl implements AiService {

	@Value("${key.openAI}")
	private String aiApiKey;
	
	@Override
	public String getResult(String prompt) {
		OpenAIClient client = OpenAIOkHttpClient.builder()
				.apiKey(aiApiKey)
				.build();
		
		ResponseCreateParams params = ResponseCreateParams.builder()
		        .input(prompt)
		        .model(ChatModel.CHATGPT_4O_LATEST)
		        .build();
		
		Response response = client.responses().create(params);
		return response.output().stream()
				.findFirst()
				.flatMap(o -> o.message())
				.flatMap(m -> m.content().stream()
					.findFirst()
					.flatMap(c -> c.outputText().map(t -> t.text())))
				.orElse("[No response]");
	}
	
}
