package org.jobis.service;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public interface AiService {
	public void streamResultAsync(String prompt, Consumer<String> onTextChunk, Runnable onComplete);
	public CompletableFuture<String> getResultAsync(String prompt);
}
