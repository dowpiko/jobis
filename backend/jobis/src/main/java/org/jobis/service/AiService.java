package org.jobis.service;

import java.util.function.Consumer;

public interface AiService {
	public void streamResultAsync(String prompt, Consumer<String> onTextChunk, Runnable onComplete);
	
	public String getResultSync(String prompt);
}
