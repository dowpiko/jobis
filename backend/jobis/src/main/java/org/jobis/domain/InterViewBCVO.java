package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterViewBCVO {
	private int ono;
	private int uno;
	private String o_title;
	private String o_tag;
	private Date o_activedays;
	private String o_content;
	private int applicantCount;
}
