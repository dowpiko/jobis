package org.jobis.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AIContextDTO {
	private int num;
	private String question;
	private List<String> standards;
	private String answer;
}
