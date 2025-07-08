package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIVO {
    private Long ano;           // ANO - 번호
    private Long uno;           // UNO - 사용자 번호
    private String aTitle;      // A_TITLE - 제목
    private String aTag;        // A_TAG - 태그
    private String aContent;    // A_CONTENT - 본문
    private Date aRegdate;      // A_REGDATE - 등록일
    private String aScore;      // A_SCORE - 점수
}
