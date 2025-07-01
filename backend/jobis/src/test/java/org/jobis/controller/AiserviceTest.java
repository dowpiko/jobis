package org.jobis.controller;


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
	public void testAiPrompt() {
		String result = aiService.getResult("안녕하세요. 자기소개 해줘");
		System.out.println("[AI 응답] " + result);
	}

}
