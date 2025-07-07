import React, { useEffect, useRef, useState } from 'react';

const SIGNALING_SERVER_URL = 'ws://192.168.0.101:9090/signal';
const CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const websocket = useRef(null);
  const [yourId, setYourId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ID 자동 생성 or 브라우저 창마다 유지
    const id = window.name || prompt("당신의 ID를 입력하세요");
    window.name = id;
    setYourId(id);

    // 1. WebSocket 연결
    websocket.current = new WebSocket(SIGNALING_SERVER_URL);

    websocket.current.onopen = () => {
      // 2. WebSocket 서버에 join 메시지 전송
      websocket.current.send(JSON.stringify({ type: 'join', from: id }));
    };

    websocket.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.type === 'offer') {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription({ type: 'offer', sdp: data.sdp })
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        websocket.current.send(JSON.stringify({
          type: 'answer',
          from: yourId,
          to: data.from,
          sdp: answer.sdp
        }));
      }

      if (data.type === 'answer') {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription({ type: 'answer', sdp: data.sdp })
        );
      }

      if (data.type === 'candidate' && data.candidate) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    };

    startWebRTC();

    return () => {
      websocket.current?.close();
    };
  }, []);

  const startWebRTC = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = localStream;

    peerConnection.current = new RTCPeerConnection(CONFIG);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && targetId) {
        websocket.current.send(JSON.stringify({
          type: 'candidate',
          from: yourId,
          to: targetId,
          candidate: event.candidate,
        }));
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream);
    });

    setConnected(true);
  };

  const startCall = async () => {
    const target = prompt("상대방 ID를 입력하세요");
    if (!target) return;
    setTargetId(target);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    websocket.current.send(JSON.stringify({
      type: 'offer',
      from: yourId,
      to: target,
      sdp: offer.sdp,
    }));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📡 WebRTC 화상 통화</h2>
      <p>당신의 ID: <strong>{yourId}</strong></p>
      <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '45%' }} />
      <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '45%' }} />
      <div style={{ marginTop: 20 }}>
        <button onClick={startCall} disabled={!connected}>📞 통화 시작</button>
      </div>
    </div>
  );
};

export default VideoChat;
