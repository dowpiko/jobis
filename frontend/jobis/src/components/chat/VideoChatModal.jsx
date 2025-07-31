import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background-color: rgba(176, 196, 222, 0.9); /* 반투명 하늘-회색 */
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 9999;
  color: #fff;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const VideoBox = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 45%;
  height: 100%;
`;

// 로컬 영상 래퍼: border 제거, 둥근 모서리 유지 + overflow hidden
const LocalVideoWrapper = styled(VideoWrapper)`
  border-radius: 8px;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  background-color: #111;
`;

const NicknameOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 10;
`;

// 로컬 화면 “나” 오버레이
const OwnOverlay = styled(NicknameOverlay)``;

const ReminderModal = styled.div`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0,0,0,0.7);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  backdrop-filter: blur(2px);
  animation: fadeInOut 2s ease forwards;
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const EndedModal = styled(ReminderModal)`
  background-color: rgba(0,0,0,0.7);
`;

const WarningModal = styled.div`
  position: absolute;
  z-index: 10000;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255,165,0,0.85);
  color: #000;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  backdrop-filter: blur(2px);
  animation: fadeInOut 10s ease forwards;
  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const ExitButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10000;
  padding: 0.2rem;
  border-radius: 50%;
  transition: background 0.2s;
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

// const SIGNALING_SERVER_URL = 'ws://' + process.env.REACT_APP_HOST + ':9090/signal';
const SIGNALING_SERVER_URL = 'ws://' + '192.168.0.101' + ':9090/signal';
const CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoChatModal({ cno, scheduleTime, peerUno, onExit }) {
  const localRef    = useRef(null);
  const remoteRef   = useRef(null);
  const pcRef       = useRef(null);
  const wsRef       = useRef(null);
  const intervalRef = useRef(null);
  const timerRef    = useRef(null);

  const [peerName, setPeerName]     = useState('닉네임 불러오는 중...');
  const [showWarning, setShowWarning] = useState(false);
  const [warningSec, setWarningSec] = useState(0);
  const [showEnded, setShowEnded]   = useState(false);

  // 상대 닉네임 가져오기
  useEffect(() => {
    if (!peerUno) return;
    axios
      .get(`http://${process.env.REACT_APP_HOST}:9090/discord/nickname/${peerUno}`, { withCredentials: true })
      .then(res => setPeerName(res.data))
      .catch(() => setPeerName('닉네임 로딩 실패'));
  }, [peerUno]);

  // WebRTC + signaling 세팅
  useEffect(() => {
    let mounted = true;

    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!mounted) return;
      localRef.current.srcObject = stream;
      localRef.current.play?.().catch(() => {});

      const pc = new RTCPeerConnection(CONFIG);
      pcRef.current = pc;

      pc.onicecandidate = ({ candidate }) => {
        if (candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'candidate', cno, candidate }));
        }
      };

      pc.ontrack = ({ streams }) => {
        remoteRef.current.srcObject = streams[0];
        pc.getStats();
        clearTimeout(timerRef.current);
        clearInterval(intervalRef.current);
      };

      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    })();

    const ws = new WebSocket(SIGNALING_SERVER_URL);
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ type: 'join', cno }));
    ws.onmessage = async ({ data }) => {
      const pc = pcRef.current;
      if (!pc || pc.signalingState === 'closed') return;
      const msg = JSON.parse(data);
      if (msg.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: msg.sdp }));
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        ws.send(JSON.stringify({ type: 'answer', cno, sdp: ans.sdp }));
      } else if (msg.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: msg.sdp }));
      } else if (msg.type === 'candidate') {
        await pc.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch(() => {});
      }
    };
    ws.onerror = () => {};
    ws.onclose = () => {};

    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const pc = pcRef.current;
        if (pc.iceConnectionState === 'connected') {
          clearInterval(intervalRef.current);
          return;
        }
        startCall();
      }, 200);
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timerRef.current);
      clearInterval(intervalRef.current);
      ws.close();
      pcRef.current?.close();
      [localRef, remoteRef].forEach(r => {
        r.current?.srcObject?.getTracks().forEach(t => t.stop());
      });
    };
  }, [cno, scheduleTime]);

  // 면접 시간 타이머
  useEffect(() => {
    const scheduleDate = new Date(scheduleTime);
    const endTime      = new Date(scheduleDate.getTime() + 60 * 60 * 1000);

    const intervalId = setInterval(() => {
      const now         = new Date();
      const remainingMs = endTime.getTime() - now.getTime();
      const remainingSec = Math.ceil(Math.max(remainingMs / 1000, 0));

      const nowKst = now.toLocaleTimeString('ko-KR', { hour12: false, timeZone: 'Asia/Seoul' });
      const endKst = endTime.toLocaleTimeString('ko-KR', { hour12: false, timeZone: 'Asia/Seoul' });
      console.log(`[Timer] 현재시각: ${nowKst}, 종료시각: ${endKst}, 남은시간: ${remainingSec}s`);

      if (remainingSec === 10 * 60) {
        setWarningSec(10 * 60);
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 10_000);
      }

      if (remainingMs <= 0) {
        console.log('[Timer] 면접이 종료되었습니다.');
        clearInterval(intervalId);
        setShowEnded(true);
        setTimeout(() => {
          setShowEnded(false);
          onExit?.();
        }, 2_000);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [scheduleTime, onExit]);

  const startCall = async () => {
    const pc = pcRef.current;
    if (!pc || pc.signalingState === 'closed') return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    wsRef.current.send(JSON.stringify({ type: 'offer', cno, sdp: offer.sdp }));
  };

  const handleExit = () => {
    wsRef.current.send(JSON.stringify({ type: 'exit', cno }));
    onExit?.();
  };

  return (
    <Wrapper>
      <ExitButton onClick={handleExit}>✖️</ExitButton>
      {showWarning && <WarningModal>⏰ {warningSec}초 후에 면접이 종료됩니다</WarningModal>}
      <Title>📡 모의면접 진행 중</Title>
      <VideoBox>
        {/* 내 화면 */}
        <LocalVideoWrapper>
          <OwnOverlay>나</OwnOverlay>
          <Video ref={localRef} autoPlay muted playsInline />
        </LocalVideoWrapper>
        {/* 상대 화면 */}
        <VideoWrapper>
          <NicknameOverlay>{peerName}</NicknameOverlay>
          <Video ref={remoteRef} autoPlay playsInline />
        </VideoWrapper>
      </VideoBox>
    </Wrapper>
  );
}
