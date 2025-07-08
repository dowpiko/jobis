package org.jobis.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterviewResultDTO {
    private int num;
    private List<String> standards;
    private List<Integer> score;
}
