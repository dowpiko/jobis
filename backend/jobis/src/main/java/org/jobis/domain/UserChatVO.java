package org.jobis.domain;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor

public class UserChatVO {
	
	// tbl_userchat
	private int cno;
	private int leader;
	private Integer member;
	private String r_title;
	private String r_tag;
	private Date r_regdate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
	private Date sch_date;

	private int enabled;
	
	// tbl_user에서 name가져오기
	private String leader_name;
	private String member_name;
	

}
