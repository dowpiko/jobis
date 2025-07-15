package org.jobis.service;

import com.openai.client.OpenAIClient;
import com.openai.client.OpenAIClientAsync;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.client.okhttp.OpenAIOkHttpClientAsync;
import com.openai.core.http.StreamResponse;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletionChunk;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
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
	@Override
	public CompletableFuture<String> getResultAsync(String prompt) {
		try {
			OpenAIClientAsync asyncClient = OpenAIOkHttpClientAsync.builder()
				.apiKey(aiApiKey)
				.build();

			ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
				.addUserMessage(prompt)
				.model(ChatModel.CHATGPT_4O_LATEST) // 또는 GPT_4_1, GPT_3_5_TURBO 등 사용 중인 모델
				.build();

			return asyncClient.chat()
				.completions()
				.create(params)
				.thenApply(response -> {
					String content = response.choices().get(0).message().content().orElse("");
					System.out.println("✅ 비동기 응답 도착: " + content);
					return content;
				});

		} catch (Exception e) {
			System.err.println("❌ getResultAsync 예외: " + e.getMessage());
			return CompletableFuture.failedFuture(e);
		}
	}

}
