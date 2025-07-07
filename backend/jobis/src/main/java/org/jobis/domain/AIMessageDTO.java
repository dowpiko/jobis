package org.jobis.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIMessageDTO {
	private int count;
	private String userMessage;
	private String previousQuestion;
	private List<String> standards;
}
