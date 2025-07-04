package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User_InterViewDTO {
	private int ono;
	private int uno;
	private String o_title;
	private String o_tag;
	private String o_content;
	private Date o_regdate;
	private String name;
	private Date birthdate;
	private String email;
}
