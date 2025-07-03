package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterViewBCVO {
	private int uno;
	private String title;
	private String tag;
	private Date activedays;
	private String content;
}
