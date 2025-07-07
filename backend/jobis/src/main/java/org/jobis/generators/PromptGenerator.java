package org.jobis.generators;

import org.jobis.domain.AISurveyDTO;

public abstract class PromptGenerator {
	protected AISurveyDTO survey;
	public abstract String generatePrompt();
}
