package org.jobis.generators;

import java.util.List;

import org.jobis.domain.AIContextDTO;
import org.jobis.domain.AISurveyDTO;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ResultPromptGenerator extends PromptGenerator{
	
	private List<AIContextDTO> contexts;
	
	public ResultPromptGenerator(AISurveyDTO survey,List<AIContextDTO> contexts) {
		super.survey = survey;
		this.contexts = contexts;
	}
	
	private static final ObjectMapper mapper = new ObjectMapper();
	
	private final String PROMPT_TEMPLATE = 
			"- 너는 챗봇이 아니라 **면접 답변을 평가하여 점수를 산정하는 API 역할**이야.  \r\n" + 
			"- 이용자는 경력 : {careerLevel} {companyType} {subCategory} 면접을 준비하는 중이고 기술스택은 {skills}\n" + 
			"\r\n" + 
			"- 아래의 context에는 각 면접 질문에 대한 정보가 포함돼 있어.  \r\n" + 
			"  - num: 질문 번호 (1~10)  \r\n" + 
			"  - question: 질문 내용  \r\n" + 
			"  - standards: 이 질문에서 평가하고자 하는 역량 코드 배열  \r\n" + 
			"    (a: 리더십, b: 소통력, c: 창의력, d: 분석력, e: 실행력)  \r\n" + 
			"  - answer: 지원자의 실제 답변  \r\n" + 
			"\r\n" + 
			"- 각 질문마다 포함된 standards에 따라, 해당 역량 항목별 점수를 산정해.  \r\n" + 
			"  점수는 0~100점 범위의 정수이며, 아래 기준을 따른다:\r\n" + 
			"\r\n" + 
			"  - 90~100점: 매우 구체적이고 탁월한 사례나 설명을 통해 역량이 명확히 드러남  \r\n" + 
			"  - 70~89점: 전반적으로 잘 설명했으며, 역량이 충분히 드러남  \r\n" + 
			"  - 40~69점: 일부 드러나긴 했지만 구체성, 설득력이 부족하거나 흐릿함  \r\n" + 
			"  - 20~39점: 답변은 했으나 관련 역량이 거의 드러나지 않음  \r\n" + 
			"  - 0~20점: 심하게 성의 없거나 예의가 없는 답변\r\n" + 
			"\r\n" + 
			"- 단, 특별한 예외 상황이 아닌 이상, 각 점수는 **20점에서 90점 사이**의 범위 내에서 부여되도록 조절해.  \r\n" + 
			"  (즉, 0점이나 100점 같은 극단값은 피하고, 일반적으로는 20~90점 사이에 분포하도록 하되,  \r\n" + 
			"  답변이 매우 탁월한 경우에는 90점 이상도 가능함, 반대로 답변이 너무 성의 없다면 20점 미만도 가능)\r\n" + 
			"\r\n" + 
			"- 답변이 너무 짧거나 모호하여 핵심이 부족한 경우에는 감점되어야 해.  \r\n" + 
			"  예: 키워드 나열만 있고 구체적 설명이 부족할 경우 낮은 점수\r\n" + 
			"\r\n" + 
			"- 기술, 인성, 케이스 유형 등 질문 유형에 관계없이 **동일한 기준으로 평가**해야 하며,  \r\n" + 
			"  특정 유형에서 점수가 과도하게 편향되지 않도록 유의할 것.\r\n" + 
			"\r\n" + 
			"- 동일한 역량(a~e)이 반복해서 등장해도, **각 답변별 평가에만 집중**하여 **평균 점수 편향이 발생하지 않도록** 유의할 것.\r\n" + 
			"\r\n" + 
			"- 출력은 반드시 다음과 같은 **JSON 배열 형식**으로 반환해야 하며, **설명 없이 결과 데이터만 출력**해.\r\n"+
			"[출력 예시]\r\n" + 
			"[\r\n" + 
			"  {\r\n" + 
			"    \"num\": 1,\r\n" + 
			"    \"standards\": [\"a\", \"c\", \"e\"],\r\n" + 
			"    \"score\": [71, 68, 88]\r\n" + 
			"  },\r\n" + 
			"  {\r\n" + 
			"    \"num\": 2,\r\n" + 
			"    \"standards\": [\"a\"],\r\n" + 
			"    \"score\": [52]\r\n" + 
			"  },\r\n" + 
			"  {\r\n" + 
			"    \"num\": 3,\r\n" + 
			"    \"standards\": [\"d\", \"e\"],\r\n" + 
			"    \"score\": [66, 73]\r\n" + 
			"  }\r\n" + 
			"]\r\n" + 
			"[context]\r\n" + 
			"{contextJson}";
	@Override
	public String generatePrompt() {
		return PROMPT_TEMPLATE
				.replace("{careerLevel}", survey.getCareerLevel())
				.replace("{companyType}", survey.getCompanyType())
				.replace("{subCategory}", survey.getSubCategory())
				.replace("{skills}", survey.getSkills().isEmpty()
						? "선택하지 않았어. 따라서 해당 분야에서 일반적으로 나올 수 있는 다양한 기술 질문을 생성해."
						: String.join(", ", survey.getSkills()) + " 등의 기술 스택을 사용한 경험이 있어. 이와 관련된 실무 기반의 질문을 생성해.")
				.replace("{contextJson}", generateContextJson());
	}

	private String generateContextJson() {
		try {
			if (contexts == null || contexts.isEmpty()) {
				return "[\n  // no context yet\n]";
			}
			return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(contexts);
		} catch (Exception e) {
			e.printStackTrace();
			return "[\n  // context error\n]";
		}
	}
}
