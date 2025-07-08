package org.jobis.domain;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageVO {
    private int clno;
    private int rno;
    private int sender;
    private String content;
    private Date cl_regdate;
}
