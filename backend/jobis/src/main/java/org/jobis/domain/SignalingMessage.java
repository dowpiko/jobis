package org.jobis.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalingMessage {
    private String from;
    private String to;
    private String type;
    private String sdp;
    private String candidate;
}
