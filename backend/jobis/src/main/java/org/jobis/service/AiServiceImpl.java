package org.jobis.service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionChunk;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

@Service
public class AiServiceImpl implements AiService {

	@Value("${key.openAI}")
	private String aiApiKey;

	private final ExecutorService executor = Executors.newCachedThreadPool();

	@Override
	public void streamResultAsync(String prompt, Consumer<String> onTextChunk, Runnable onComplete) {
		executor.submit(() -> {
			try {
				OpenAIClient client = OpenAIOkHttpClient.builder()
						.apiKey(aiApiKey)
						.build();

				ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
						.addUserMessage(prompt)
						.model(ChatModel.CHATGPT_4O_LATEST)
						.build();

				try (StreamResponse<ChatCompletionChunk> stream = client.chat().completions().createStreaming(params)) {
					stream.stream()
							.flatMap(chunk -> chunk.choices().stream())
							.flatMap(choice -> choice.delta().content().stream())
							.forEach(onTextChunk);
				}
				onComplete.run();
			} catch (Exception e) {
				System.err.println("❌ 스트리밍 중 에러: " + e.getMessage());
			}
		});
	}
}
