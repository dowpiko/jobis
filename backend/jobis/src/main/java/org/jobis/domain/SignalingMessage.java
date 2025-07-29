//ver1
package org.jobis.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignalingMessage {
	private String type;         // "join", "offer", "answer", "candidate", ...
	private String cno;          // 방 번호
	private Object candidate;    // ICE candidate
	private String sdp;          // SDP
	private String scheduleTime; // 면접 시작 시간
	private String extra;
}


//ver 0
//package org.jobis.domain;
//
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class SignalingMessage {
//    private String type;       // "join", "offer", "answer", "candidate"
//    private String from;       // sender ID (ex: myUno)
//    private String to;         // receiver ID (ex: peerUno)
//    private String sdp;        // offer or answer SDP
//    private Object candidate;  // ICE candidate (usually a Map)
//}
