package org.jobis.domain;


import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOfferDTO {
	private int uno;
	private int ono;
    private String corpName;
    private String category;
    private String title;
    private Date o_activedays;
    private int enpEmpeCnt;
    private String enpBsadr;
    private String enpRprfnm;
    }
