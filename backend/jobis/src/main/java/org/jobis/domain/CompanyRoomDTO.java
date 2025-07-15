package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRoomDTO {
	private int rno;
	private int company;
	private int emp;
	private int ono;
	private String name;
	private Date birthdate;
}