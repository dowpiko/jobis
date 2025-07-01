package org.jobis.controller;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.jobis.service.AiService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {
	    "classpath:/spring/root-context.xml"
})
public class AiserviceTest {

	@Autowired
	private AiService aiService;

	@Test
	public void testAiStreamPrompt() throws InterruptedException {
		String prompt = "자기소개 해줘";

		StringBuilder resultBuilder = new StringBuilder();
		CountDownLatch latch = new CountDownLatch(1); // 스트리밍 완료 감지용

		aiService.streamResultAsync(prompt,
			chunk -> {
				System.out.print(chunk); // 실시간 출력
				resultBuilder.append(chunk);
			},
			() -> {
				System.out.println("\n✅ 스트리밍 완료");
				latch.countDown(); // 완료 신호
			}
		);

		latch.await(20, TimeUnit.SECONDS); // 최대 20초 기다림
		System.out.println("[최종 응답] " + resultBuilder);
	}
}
