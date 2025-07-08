package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferSubmissionDTO {
	private int rno;
    private String o_title;
    private String o_tag;
    private String o_content;
    private Date o_regdate;
    private String user_content;
    private Date user_regdate;
}