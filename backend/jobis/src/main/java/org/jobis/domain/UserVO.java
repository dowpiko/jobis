package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVO {
	private int uno;
	private String name;
	private Date birthdate;
	private String id;
	private String pw;
	private String email;
	private int subscribe;
	private String auth;
	private Date lastTryDate;  // ✅ 추가된 필드 (nullable)
	private int count;
}
