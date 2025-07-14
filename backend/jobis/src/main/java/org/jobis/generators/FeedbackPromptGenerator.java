package org.jobis.generators;

import org.jobis.domain.AIVO;

public class FeedbackPromptGenerator extends PromptGenerator{
	
	private AIVO aVO;
	
	public FeedbackPromptGenerator(AIVO aVO) {
		this.aVO = aVO;
	}

	private final String PROMPT_TEMPLATE =
			"- 너는 챗봇이 아닌, 면접 답변을 평가하고 피드백을 제공하는 API야.\n" +
			"- 입력은 JSON 형식의 질문-답변 셋이다.\n" +
			"- [면접내용]의 `num`은 번호, `question`은 질문, `answer`는 답변이다. `standards`는 무시한다.\n" +
			"- {tag} 직무 면접 상황이다.이 직무 특성에 맞는 관점에서 평가해야 한다.\n" +
			"- 각 질문-답변을 기준별로 평가하고, `현재 수준(currentState)`과 `개선 방안(suggestion)`을 각각 작성한다.\n" +
			"- 각 항목의 `currentState`와 `suggestion`은 **300자 이상 500자 미만**으로 작성해야 하며, 가능한 한 풍부하고 구체적인 내용을 포함해야 한다.\n" +
			"- 출력은 반드시 아래 예시와 동일한 JSON 구조로만 반환한다. 설명, 주석, 기타 텍스트 출력은 금지.\n" +
			"- 출력 결과가 유효한 JSON인지 확인해. 닫는 brace도 꼭 포함하고, 중간에 끊기면 안 돼\n" +
			" - 가장 밖의 중괄호가 잘 닫히지 않는 문제가 발생\n"+
			"\n" +
			"[기준]\n" +
			"1. coreCompetency – 핵심 역량 전달력  \n" +
			"2. jobRelevance – 직무 연관성  \n" +
			"3. expressionClarity – 표현력 및 커뮤니케이션  \n" +
			"4. languagePolish – 문장 구성 및 문체 적합성  \n" +
			"5. attitudeMessage – 태도 및 메타 메시지\n" +
			"\n" +
			"[출력 예시]\n" +
			"{\n" +
			"  \"coreCompetency\": {\n" +
			"    \"currentState\": \"어쩌구 저쩌구\",\n" +
			"    \"suggestion\": \"어쩌구 저쩌구\"\n" +
			"  },\n" +
			"  \"jobRelevance\": {\n" +
			"    \"currentState\": \"어쩌구 저쩌구\",\n" +
			"    \"suggestion\": \"어쩌구 저쩌구\"\n" +
			"  },\n" +
			"  \"expressionClarity\": {\n" +
			"    \"currentState\": \"어쩌구 저쩌구\",\n" +
			"    \"suggestion\": \"어쩌구 저쩌구\"\n" +
			"  },\n" +
			"  \"languagePolish\": {\n" +
			"    \"currentState\": \"어쩌구 저쩌구\",\n" +
			"    \"suggestion\": \"어쩌구 저쩌구\"\n" +
			"  },\n" +
			"  \"attitudeMessage\": {\n" +
			"    \"currentState\": \"어쩌구 저쩌구\",\n" +
			"    \"suggestion\": \"어쩌구 저쩌구\"\n" +
			"  }\n" +
			"}\n" +
			"\n" +
			"[면접내용]\n" +
			"{context}";

	@Override
	public String generatePrompt() {
		return PROMPT_TEMPLATE
				.replace("{tag}", aVO.getATag())
				.replace("{context}", aVO.getAContent());
	}
}
