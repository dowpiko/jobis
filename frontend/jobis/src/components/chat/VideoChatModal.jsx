import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	top: 10%;
	left: 10%;
	width: 80%;
	height: 80%;
	background-color: #000;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 1.5rem;
	z-index: 9999;
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
`;

const VideoWrapper = styled.div`
	position: relative;
	width: 45%;
	height: 100%;
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

const ButtonRow = styled.div`
	margin-top: 1rem;
`;

const ExitButton = styled.button`
	padding: 0.5rem 1.2rem;
	background-color: #ff4d4f;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-size: 1rem;
	&:hover { background-color: #d9363e; }
`;

const SIGNALING_SERVER_URL = 'ws://' + process.env.REACT_APP_HOST + ':9090/signal';
const CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function VideoChatModal({ cno, scheduleTime, peerUno, onExit }) {
	const localRef    = useRef(null);
	const remoteRef   = useRef(null);
	const pcRef       = useRef(null);
	const wsRef       = useRef(null);
	const intervalRef = useRef(null);
	const timerRef    = useRef(null);

	const [peerName, setPeerName] = useState('닉네임 불러오는 중...');
	const [showRem, setShowRem] = useState(false);
	const [showEnded, setShowEnded] = useState(false);

	useEffect(() => {
		if (!peerUno) return;
		axios
			.get(`http://${process.env.REACT_APP_HOST}:9090/discord/nickname/${peerUno}`, { withCredentials: true })
			.then(res => setPeerName(res.data))
			.catch(() => setPeerName('닉네임 로딩 실패'));
	}, [peerUno]);

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

			pc.onconnectionstatechange = () => {};
			pc.oniceconnectionstatechange = () => {};
			pc.onsignalingstatechange = () => {};

			stream.getTracks().forEach(track => pc.addTrack(track, stream));
		})();

		const ws = new WebSocket(SIGNALING_SERVER_URL);
		wsRef.current = ws;

		ws.onopen = () => {
			ws.send(JSON.stringify({ type: 'join', cno, scheduleTime }));
		};

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
			} else if (msg.type === 'reminder') {
				setShowRem(true);
				setTimeout(() => setShowRem(false), 2000);
			} else if (msg.type === 'force-exit') {
				setShowEnded(true);
				setTimeout(() => { setShowEnded(false); onExit?.(); }, 2000);
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
			[localRef, remoteRef].forEach(r => r.current?.srcObject.getTracks().forEach(t => t.stop()));
		};
	}, [cno, scheduleTime, onExit]);

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
			{showRem && <ReminderModal>⏰ 면접 종료 10분 전입니다</ReminderModal>}
			{showEnded && <EndedModal>💬 면접 시간이 종료되었습니다</EndedModal>}
			<Title>📡 모의면접 진행 중</Title>
			<VideoBox>
				<VideoWrapper><Video ref={localRef} autoPlay muted playsInline /></VideoWrapper>
				<VideoWrapper>
					<NicknameOverlay>{peerName}</NicknameOverlay>
					<Video ref={remoteRef} autoPlay playsInline />
				</VideoWrapper>
			</VideoBox>
			<ButtonRow><ExitButton onClick={handleExit}>❌ 나가기</ExitButton></ButtonRow>
		</Wrapper>
	);
}
