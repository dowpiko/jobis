package org.jobis.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AISurveyDTO {
    private String title;
    private String category;
    private String subCategory;
    private List<String> skills;
    private String companyType;
    private String careerLevel;
    private String date;
}
