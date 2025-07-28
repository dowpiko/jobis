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
	const [localStreamReady, setLocalStreamReady] = useState(false);
	const [remoteConnected, setRemoteConnected] = useState(false); // 상대 입장 여부
  const [showReminder, setShowReminder] = useState(false);
  const [showEnded, setShowEnded] = useState(false);
	const [peerNickname, setPeerNickname] = useState('');
	const [localStream, setLocalStream] = useState(null);
	useEffect(() => {
		if (!cno) return;

		const socket = new WebSocket(`${SIGNALING_SERVER_URL}?cno=${cno}`);
		websocket.current = socket;

		socket.onopen = () => {
			const formattedScheduleTime = new Date(scheduleTime).toISOString().slice(0, 19); // "2025-07-28T14:32:00"

			socket.send(JSON.stringify({
				type: 'join',
				cno,
				scheduleTime: formattedScheduleTime
			}));
		};

		socket.onmessage = async (message) => {
			const data = JSON.parse(message.data);

			if (data.type === 'ready') {
				if (peerConnection.current) {
					await makeOffer();
				} else {
					console.warn('⚠️ peerConnection 아직 초기화 안 됨. makeOffer() 스킵');
				}
			}

			if (data.type === 'offer') {
				if (!peerConnection.current) {
					console.warn('⚠️ peerConnection이 아직 초기화되지 않음. offer 처리 스킵');
					return;
				}

				try {
					await peerConnection.current.setRemoteDescription(
						new RTCSessionDescription({ type: 'offer', sdp: data.sdp })
					);
					const answer = await peerConnection.current.createAnswer();
					await peerConnection.current.setLocalDescription(answer);
					socket.send(JSON.stringify({
						type: 'answer',
						cno,
						sdp: answer.sdp
					}));
				} catch (err) {
					console.error('📡 offer 처리 중 오류:', err);
				}
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
				setShowEnded(true);
				setTimeout(() => {
					setShowEnded(false);
					handleExit();
				}, 2000);
			}
		};

		return () => {
			socket.close();
			websocket.current = null;
		};
	}, [cno]);
	useEffect(() => {
		if (scheduleTime) {
			console.log('🕒 전달받은 scheduleTime:', scheduleTime);
		}
	}, [scheduleTime]);

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
	useEffect(() => {
		console.log("동료 이름: ", peerNickname);
	}, [peerNickname]);

	const startWebRTC = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			setLocalStream(stream); // 상태에 저장

			peerConnection.current = new RTCPeerConnection(CONFIG);

			peerConnection.current.onicecandidate = (event) => {
				if (event.candidate) {
					websocket.current?.send(JSON.stringify({
						type: 'candidate',
						cno,
						candidate: event.candidate
					}));
				}
			};

			peerConnection.current.ontrack = (event) => {
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = event.streams[0];
				}
				setRemoteConnected(true);
			};

			stream.getTracks().forEach((track) => {
				peerConnection.current.addTrack(track, stream);
			});

			setLocalStreamReady(true);
		} catch (err) {
			console.error('장치 접근 실패:', err);
			setLocalStreamReady(false);
		}
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
	useEffect(() => {
		if (localStream && localVideoRef.current) {
			localVideoRef.current.srcObject = localStream;
			localVideoRef.current.play?.().catch(err =>
				console.warn('🎬 local video 재생 실패:', err)
			);
		}
	}, [localStream]);

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

		if (localStream) {
			localStream.getTracks().forEach(track => track.stop());
			setLocalStream(null);
		}

		if (websocket.current) {
			websocket.current.close();
			websocket.current = null;
		}

		setRemoteConnected(false);
		setLocalStreamReady(false);
	};
// ✅ 장치 초기화 트리거
useEffect(() => {
	if (cno && !localStreamReady) {
		startWebRTC();
	}
}, [cno]);

	return (
		<Wrapper>
      {showReminder && <ReminderModal>⏰ 면접 종료 10분 전입니다</ReminderModal>}
      {showEnded && <EndedModal>💬 면접 시간이 종료되었습니다</EndedModal>}
			<Title>📡 모의면접 진행 중</Title>
			<VideoBox>
				<MyVideoWrapper>
					{localStreamReady ? (
						<Video ref={localVideoRef} autoPlay playsInline muted />
					) : (
						<LoadingOverlay>📷 장치가 준비되지 않았습니다</LoadingOverlay>
					)}
				</MyVideoWrapper>
				<PeerVideoWrapper>
					<NicknameOverlay>
						{peerNickname || '닉네임 불러오는 중...'}
					</NicknameOverlay>

					{remoteConnected ? (
						<Video ref={remoteVideoRef} autoPlay playsInline />
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


