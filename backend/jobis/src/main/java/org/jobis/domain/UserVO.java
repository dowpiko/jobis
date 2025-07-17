package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserVO {
	int uno;
	String name;
	Date birthdate;
	String id;
	String pw;
	String email;
	int subscribe;
	String auth;
	Date lastTryDate;  // ✅ 추가된 필드 (nullable)
}
