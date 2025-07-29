import React, { useEffect, useRef, useState } from 'react';

const SIGNALING_SERVER_URL = 'ws://' + process.env.REACT_APP_HOST + ':9090/signal';
const CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const VideoChat = () => {
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnection = useRef(null);
	const websocket = useRef(null);

	const yourIdRef = useRef('');
	const targetIdRef = useRef('');
	const [connected, setConnected] = useState(false);
	const [yourId, setYourId] = useState(''); // UI 표시용만 유지

	useEffect(() => {
		const id = window.name || prompt("당신의 ID를 입력하세요");
		window.name = id;

		yourIdRef.current = id;
		setYourId(id); // UI에서 표시만

		websocket.current = new WebSocket(SIGNALING_SERVER_URL);

		websocket.current.onopen = () => {
			websocket.current.send(JSON.stringify({ type: 'join', from: id }));
		};

		websocket.current.onmessage = async (message) => {
			const data = JSON.parse(message.data);
			console.log("📩 받은 메시지:", data);

			if (data.type === 'offer') {
				await peerConnection.current.setRemoteDescription(
					new RTCSessionDescription({ type: 'offer', sdp: data.sdp })
				);
				const answer = await peerConnection.current.createAnswer();
				await peerConnection.current.setLocalDescription(answer);

				console.log("📤 answer 보냄 from:", yourIdRef.current);

				websocket.current.send(JSON.stringify({
					type: 'answer',
					from: yourIdRef.current,
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
			if (event.candidate && targetIdRef.current) {
				websocket.current.send(JSON.stringify({
					type: 'candidate',
					from: yourIdRef.current,
					to: targetIdRef.current,
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

		targetIdRef.current = target;

		const offer = await peerConnection.current.createOffer();
		await peerConnection.current.setLocalDescription(offer);

		websocket.current.send(JSON.stringify({
			type: 'offer',
			from: yourIdRef.current,
			to: targetIdRef.current,
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
