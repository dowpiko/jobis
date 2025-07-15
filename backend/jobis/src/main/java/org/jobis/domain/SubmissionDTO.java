package org.jobis.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor

public class SubmissionDTO {
    private int uno;
    private int ono;
    private String corpName;
    private String o_title;
    private String o_tag;
    private String o_content;
    private List<String> answers;

}
