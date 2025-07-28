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
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Video = styled.video`
	width: 100%;
	height: 100%;
	border-radius: 8px;
	object-fit: cover;
	background-color: #111;
`;

const MyVideoWrapper = styled.div`
	width: 40%;
	border: 3px solid limegreen;
	border-radius: 8px;
	overflow: hidden;
	height: 70%;
`;

const PeerVideoWrapper = styled.div`
	width: 40%;
	height: 70%;
	border-radius: 8px;
	position: relative;
	background-color: #222;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const NicknameOverlay = styled.div`
	position: absolute;
	top: 10px;
	left: 10px;
	background: rgba(0, 0, 0, 0.5);
	color: #fff;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 0.9rem;
	z-index: 10;
`;

const LoadingOverlay = styled.div`
	color: white;
	font-size: 1rem;
	text-align: center;
`;

const ExitButton = styled.button`
	margin-top: 1rem;
	padding: 0.5rem 1.2rem;
	background-color: #ff4d4f;
	color: white;
	border: none;
	border-radius: 6px;
	font-size: 1rem;
	cursor: pointer;

	&:hover {
		background-color: #d9363e;
	}
`;
const ReminderModal = styled.div`
	position: absolute;
	top: 5%;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 1rem 2rem;
	border-radius: 8px;
	font-size: 1rem;
	z-index: 10000;
	backdrop-filter: blur(2px);
	animation: fadeInOut 2s ease forwards;

	@keyframes fadeInOut {
		0% { opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { opacity: 0; }
	}
`;
const EndedModal = styled.div`
	position: absolute;
	top: 5%;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 1rem 2rem;
	border-radius: 8px;
	font-size: 1rem;
	z-index: 10000;
	backdrop-filter: blur(2px);
	animation: fadeInOut 2s ease forwards;

	@keyframes fadeInOut {
		0% { opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { opacity: 0; }
	}
`;

const SIGNALING_SERVER_URL = 'ws://' + process.env.REACT_APP_HOST + ':9090/signal';
const CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const host = process.env.REACT_APP_HOST;
const VideoChatModal = ({ cno, scheduleTime, myUno, peerUno, onExit }) => {
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnection = useRef(null);
	const websocket = useRef(null);
	const [connected, setConnected] = useState(false);
	const [remoteConnected, setRemoteConnected] = useState(false); // 상대 입장 여부
  const [showReminder, setShowReminder] = useState(false);
  const [showEnded, setShowEnded] = useState(false);
	const [peerNickname, setPeerNickname] = useState('');
	useEffect(() => {
    if (!cno) return;
    websocket.current = new WebSocket(`${SIGNALING_SERVER_URL}?cno=${cno}`);

		websocket.current.onopen = () => {
				websocket.current.send(JSON.stringify({
          type: 'join',
          cno,
          scheduleTime, // 🔸서버로 전달
        }));
		};

		websocket.current.onmessage = async (message) => {
			const data = JSON.parse(message.data);

			if (data.type === 'ready') {
				await makeOffer();
			}

			if (data.type === 'offer') {
				await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: data.sdp }));
				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);

        websocket.current.send(JSON.stringify({
          type: 'answer',
          cno,
          sdp: answer.sdp
        }));
			}

			if (data.type === 'answer') {
				await peerConnection.current.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
			}

			if (data.type === 'candidate' && data.candidate) {
				await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
			}

      if (data.type === 'reminder') {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 2000);
      }


    if (data.type === 'force-exit') {
      setShowEnded(true); // 모달 표시
      setTimeout(() => {
        setShowEnded(false); // 모달 숨기기
        handleExit();
      }, 2000);
    }

		};

		startWebRTC();

		return () => {
			websocket.current?.close();
		};
	}, [cno]);
	useEffect(() => {
		if (!peerUno) return;

		const fetchPeerNickname = async () => {
			try {
				const res = await axios.get(`http://${host}:9090/discord/nickname/${peerUno}`, {
					withCredentials: true
				});
				setPeerNickname(res.data);
			} catch (err) {
				console.error('닉네임 불러오기 실패:', err);
			}
		};

		fetchPeerNickname();
	}, [peerUno]);
	const startWebRTC = async () => {
		const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
		localVideoRef.current.srcObject = localStream;

		peerConnection.current = new RTCPeerConnection(CONFIG);

		peerConnection.current.onicecandidate = (event) => {
			if (event.candidate) {
				websocket.current.send(JSON.stringify({
					type: 'candidate',
					cno,
					candidate: event.candidate
				}));
			}
		};

		peerConnection.current.ontrack = (event) => {
			remoteVideoRef.current.srcObject = event.streams[0];
			setRemoteConnected(true);
		};

		localStream.getTracks().forEach((track) => {
			peerConnection.current.addTrack(track, localStream);
		});

		setConnected(true);
	};

	const makeOffer = async () => {
		const offer = await peerConnection.current.createOffer();
		await peerConnection.current.setLocalDescription(offer);

		websocket.current.send(JSON.stringify({
			type: 'offer',
			cno,
			sdp: offer.sdp
		}));
	};

  const handleExit = () => {
    // 소켓 알림
    websocket.current?.send(JSON.stringify({
      type: 'exit',
      cno
    }));

    // 종료 처리
    endCallCleanup();

    onExit?.(); // 부모에 알림
  };
  const endCallCleanup = () => {
    peerConnection.current?.close();
    peerConnection.current = null;

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setRemoteConnected(false);
    setConnected(false);
  };
	return (
		<Wrapper>
      {showReminder && <ReminderModal>⏰ 면접 종료 10분 전입니다</ReminderModal>}
      {showEnded && <EndedModal>💬 면접 시간이 종료되었습니다</EndedModal>}
			<Title>📡 모의면접 진행 중</Title>
			<VideoBox>
				<MyVideoWrapper>
					<Video ref={localVideoRef} autoPlay playsInline muted />
				</MyVideoWrapper>
				<PeerVideoWrapper>
					{remoteConnected ? (
						<>
							<NicknameOverlay>{peerNickname}</NicknameOverlay>
							<Video ref={remoteVideoRef} autoPlay playsInline />
						</>
					) : (
						<LoadingOverlay>상대방 입장 대기 중...</LoadingOverlay>
					)}
				</PeerVideoWrapper>
			</VideoBox>
			<ExitButton onClick={handleExit}>나가기</ExitButton>
		</Wrapper>
	);
};

export default VideoChatModal;


