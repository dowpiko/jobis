package org.jobis.generators;

import java.util.ArrayList;
import java.util.List;

import org.jobis.domain.AIContextDTO;
import org.jobis.domain.AISurveyDTO;

import com.fasterxml.jackson.databind.ObjectMapper;

public class QuestionPromptGenerator extends PromptGenerator{
	
	private int count;
	private List<AIContextDTO> contexts;
	
	public QuestionPromptGenerator(int count, AISurveyDTO survey,List<AIContextDTO> contexts) {
		this.count = count;
		super.survey = survey;
		this.contexts = contexts;
	}
	
	private static final ObjectMapper mapper = new ObjectMapper();
	private final String PROMPT_TEMPLATE = 
			"- 너는 챗봇이 아니라 면접 질문을 생성하는 API 역할이야.\n" +
			"- 이용자는 경력 : {careerLevel} {companyType} {subCategory} 면접을 준비하는 중이고 기술스택은 {skills}\n" +
			"- 총 10개의 질문을 생성할 예정이고, 현재는 {num}번째 질문을 생성하고 있어.   \n" +
			"- 질문은 리더십(a), 소통력(b), 창의력(c), 분석력(d), 실행력(e)의 평가 요소 중 최소 하나 이상을 포함해야 해.\n" +
			"- 각 질문은 평가 요소를 1개 또는 2~3개까지 다양하게 포함할 수 있으며, 특정 개수로 고정되지 않도록 해.\n" +
			"- 각 평가 요소 a~e는 전체 10개 질문 안에서 **최소 2회, 최대 3회까지** 등장할 수 있도록 분포를 조절해야 해.\n" +
			"- 질문은 인성, 기술, 케이스 면접을 아우르는 다양한 주제여야 하며, **같은 유형이 3개 이상 연속되지 않도록** 하고, **유형이 적절히 섞인 자연스러운 흐름**을 유지해야 해.\n" +
			"- 기술 스택과 관련된 질문은 단순 지식 확인(예: 개념 설명, 원리 이해)뿐 아니라, 실무 경험(예: 프로젝트 적용, 문제 해결)까지 아우를 수 있도록 다양하게 구성해. \n"+
			"- 아래의 컨텍스트에는 지금까지의 질문, 질문 번호, 질문에 포함되는 평가요소, 그리고 직전 질문에 대한 유저의 답변이 포함돼 있어.\n" +
			"- 컨텍스트 배열이 비어 있을 수도 있으며, 이 경우에는 첫 번째 질문을 자연스럽게 시작하되, 이후 평가 요소 분포와 흐름에 영향을 주지 않도록 설계해.\n" +
			"- 답변이 후속 질문을 유도할 만큼 충분히 구체적이라면, 해당 답변에 한해 후속 질문을 **최대 한 번만 생성**할 수 있어.\n" +
			"- 단, 후속 질문은 전체 10개 중 **최대 2회까지만 생성 가능**하며, **연속해서 2개 이상 등장하지 않도록** 랜덤성과 흐름을 고려해 반드시 조절해줘.\n" +
			"- 즉, 방금 이전 질문이 후속 질문이었다면, 다음 질문은 반드시 일반 질문이어야 해.\n" +
			"- 후속 질문이더라도 전체 흐름과 평가 요소 분포 조건은 반드시 충족되어야 해.\n" +
			"- ***설명이나 서론 없이, **오직 JSON 객체만 반환하라.***\n" +
			"\n" +
			"[출력 예시]\n" +
			"{\n" +
			"  \"question\": \"생성된 면접 질문 내용\",\n" +
			"  \"standards\": [\"a\", \"d\"]\n" +
			"}\n" +
			"\n" +
			"[context]  \n" +
			"{contextJson}";
	
	@Override
	public String generatePrompt() {
		String prompt = PROMPT_TEMPLATE
			.replace("{careerLevel}", survey.getCareerLevel())
			.replace("{companyType}", survey.getCompanyType())
			.replace("{subCategory}", survey.getSubCategory())
			.replace("{skills}", survey.getSkills().isEmpty()
					? "선택하지 않았어. 따라서 해당 분야에서 일반적으로 나올 수 있는 다양한 기술 질문을 생성해."
					: String.join(", ", survey.getSkills()) + " 등의 기술 스택을 사용한 경험이 있어. 이와 관련된 실무 기반의 질문을 생성해.")
			.replace("{num}", String.valueOf(count))
			.replace("{contextJson}", generateContextJson());

		return prompt;
	}

	private String generateContextJson() {
		try {
			if (contexts == null || contexts.isEmpty()) {
				return "[\n  // no context yet\n]";
			}

			// 원본 훼손 없이 가공된 리스트 생성
			List<AIContextDTO> maskedContexts = new ArrayList<>();
			for (int i = 0; i < contexts.size(); i++) {
				AIContextDTO ctx = contexts.get(i);
				String answer = (i == contexts.size() - 1) ? ctx.getAnswer() : "omission";
				maskedContexts.add(new AIContextDTO(
					ctx.getNum(),
					ctx.getQuestion(),
					ctx.getStandards(),
					answer
				));
			}

			return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(maskedContexts);

		} catch (Exception e) {
			e.printStackTrace();
			return "[\n  // context error\n]";
		}
	}
}
