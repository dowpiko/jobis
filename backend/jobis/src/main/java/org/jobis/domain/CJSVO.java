package org.jobis.domain;
import java.util.Date;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CJSVO {
	
	// tbl_userchat
	private int cno;
	private int leader;
	private int member;
	private String r_title;
	private String r_tag;
	private LocalDateTime r_regdate;
	@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private LocalDateTime sch_date;
	private int enabled;
	

}
