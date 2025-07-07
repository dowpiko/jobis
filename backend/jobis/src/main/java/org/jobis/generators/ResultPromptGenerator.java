package org.jobis.generators;

import java.util.List;

import org.jobis.domain.AIContextDTO;
import org.jobis.domain.AISurveyDTO;

public class ResultPromptGenerator extends PromptGenerator{
	
	private List<AIContextDTO> contexts;
	
	public ResultPromptGenerator(AISurveyDTO survey,List<AIContextDTO> contexts) {
		super.survey = survey;
		this.contexts = contexts;
	}

	@Override
	public String generatePrompt() {
		// TODO Auto-generated method stub
		return null;
	}
}
