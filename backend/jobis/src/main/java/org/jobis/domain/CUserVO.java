package org.jobis.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CUserVO {
	private int uno;
	private String id;
    private String pw;
    private String email;
    private String crno;
    private String corpNm;
    private String bzno;
    private String enpRprFnm;
    private String enpBsadr;
    private String sicNm;
    private int enpEmpeCnt;
}
