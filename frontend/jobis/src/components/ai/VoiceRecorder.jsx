import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(4px);
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	z-index: 1000;
`;

const Modal = styled.div`
	background: #fff;
	border-radius: 16px;
	padding: 32px 24px;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	width: 360px;
	text-align: center;
	font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
	margin-bottom: 8px;
	color: #333;
	font-size: 20px;
`;

const Canvas = styled.canvas`
	margin: 16px 0 10px;
	background: #f4f6f8;
	border-radius: 8px;
	border: 1px solid #ddd;
`;

const Time = styled.p`
	font-size: 16px;
	color: #555;
`;

const StatusMessage = styled.p`
	margin-top: 12px;
	color: #888;
`;

const Button = styled.button`
	padding: 10px 18px;
	font-size: 15px;
	font-weight: 500;
	color: ${({ color }) => color || '#fff'};
	background-color: ${({ bg }) => bg || '#0984e3'};
	border: ${({ border }) => border || 'none'};
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.2s ease;
	margin-top: ${({ marginTop }) => marginTop || '12px'};

	&:hover {
		background-color: ${({ hover }) => hover || '#74b9ff'};
	}
`;

const ModalWrapper = styled.div`
	margin-left: 240px;  /* 사이드바 너비만큼 띄움 */
	width: calc(100% - 240px);
	display: flex;
	align-items: center;
	justify-content: center;
`;
const VoiceRecorder = ({ onClose, onResult }) => {
	const [recording, setRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const sourceRef = useRef(null);
	const animationRef = useRef(null);
	const canvasRef = useRef(null);
	const intervalRef = useRef(null);

	const formatTime = (sec) => {
		const minutes = String(Math.floor(sec / 60)).padStart(2, '0');
		const seconds = String(sec % 60).padStart(2, '0');
		return `${minutes}:${seconds}`;
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			audioChunksRef.current = [];
			audioContextRef.current = new AudioContext();

			// 분석기 생성
			analyserRef.current = audioContextRef.current.createAnalyser();
			sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
			sourceRef.current.connect(analyserRef.current);

			drawWaveform(); // 파형 시작

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = async () => {
				setIsProcessing(true);
				stopWaveform();
				clearInterval(intervalRef.current);

				try {
					const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
					const arrayBuffer = await blob.arrayBuffer();
					const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
					const wavBlob = audioBufferToWav(audioBuffer);

					const formData = new FormData();
					formData.append('voice', wavBlob, 'recording.wav');

					const res = await axios.post('/jsh/voicetotext', formData);
					const recognizedText = res.data.text || '';

					if (recognizedText) {
						onResult(recognizedText);
					} else {
						alert('음성 인식 결과 없음');
					}
				} catch (error) {
					console.error('음성 인식 실패:', error);
					alert('음성 인식 실패: ' + (error.response?.data || error.message));
				} finally {
					onClose();
				}
			};

			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start();
			setRecording(true);
			setElapsedTime(0);

			intervalRef.current = setInterval(() => {
				setElapsedTime(prev => prev + 1);
			}, 1000);
		} catch (err) {
			alert("마이크 접근이 거부되었거나 문제가 발생했습니다.");
			onClose();
		}
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
		setRecording(false);
	};

	const drawWaveform = () => {
		const canvas = canvasRef.current;
		if (!canvas || !analyserRef.current) return;

		const ctx = canvas.getContext('2d');
		analyserRef.current.fftSize = 64;
		const bufferLength = analyserRef.current.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			animationRef.current = requestAnimationFrame(draw);

			analyserRef.current.getByteFrequencyData(dataArray);

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const barWidth = canvas.width / bufferLength;
			dataArray.forEach((value, i) => {
				const barHeight = value / 2;
				ctx.fillStyle = '#4376B6';
				ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
			});
		};

		draw();
	};

	const stopWaveform = () => {
		cancelAnimationFrame(animationRef.current);
	};

	const audioBufferToWav = (audioBuffer) => {
		const numChannels = audioBuffer.numberOfChannels;
		const sampleRate = audioBuffer.sampleRate;
		const format = 1;
		const bitDepth = 16;
		const length = audioBuffer.length * numChannels * (bitDepth / 8);
		const buffer = new ArrayBuffer(44 + length);
		const view = new DataView(buffer);

		const writeString = (view, offset, str) => {
			for (let i = 0; i < str.length; i++) {
				view.setUint8(offset + i, str.charCodeAt(i));
			}
		};

		let offset = 0;
		writeString(view, offset, 'RIFF'); offset += 4;
		view.setUint32(offset, 36 + length, true); offset += 4;
		writeString(view, offset, 'WAVE'); offset += 4;
		writeString(view, offset, 'fmt '); offset += 4;
		view.setUint32(offset, 16, true); offset += 4;
		view.setUint16(offset, format, true); offset += 2;
		view.setUint16(offset, numChannels, true); offset += 2;
		view.setUint32(offset, sampleRate, true); offset += 4;
		view.setUint32(offset, sampleRate * numChannels * (bitDepth / 8), true); offset += 4;
		view.setUint16(offset, numChannels * (bitDepth / 8), true); offset += 2;
		view.setUint16(offset, bitDepth, true); offset += 2;
		writeString(view, offset, 'data'); offset += 4;
		view.setUint32(offset, length, true); offset += 4;

		const interleaved = interleave(audioBuffer);
		let index = offset;
		for (let i = 0; i < interleaved.length; i++) {
			let sample = Math.max(-1, Math.min(1, interleaved[i]));
			sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
			view.setInt16(index, sample, true);
			index += 2;
		}

		return new Blob([view], { type: 'audio/wav' });
	};

	const interleave = (audioBuffer) => {
		const numChannels = audioBuffer.numberOfChannels;
		const length = audioBuffer.length * numChannels;
		const result = new Float32Array(length);

		for (let channel = 0; channel < numChannels; channel++) {
			const data = audioBuffer.getChannelData(channel);
			for (let i = 0; i < data.length; i++) {
				result[i * numChannels + channel] = data[i];
			}
		}
		return result;
	};

	useEffect(() => {
		return () => {
			cancelAnimationFrame(animationRef.current);
			clearInterval(intervalRef.current);
		};
	}, []);

  return (
    <Overlay>
      <ModalWrapper>
        <Modal>
          <Title>🎤 음성 녹음</Title>

          <Canvas
            ref={canvasRef}
            width={280}
            height={60}
          />

          <Time>⏱️ {formatTime(elapsedTime)}</Time>

          {isProcessing ? (
            <StatusMessage>⏳ 음성 인식 중입니다...</StatusMessage>
          ) : recording ? (
            <Button
              onClick={stopRecording}
              color="#fff"
              bg="#d63031"
              hover="#c0392b"
            >
              🔴 녹음 중지
            </Button>
          ) : (
            <Button
              onClick={startRecording}
              color="#fff"
              bg="#0984e3"
              hover="#74b9ff"
            >
              🎙️ 녹음 시작
            </Button>
          )}

          {!isProcessing && (
            <Button
              onClick={onClose}
              color="#666"
              bg="transparent"
              hover="#f1f2f6"
              border="1px solid #ccc"
              marginTop="16px"
            >
              닫기
            </Button>
          )}
        </Modal>
      </ModalWrapper>
    </Overlay>
  );

};

export default VoiceRecorder;
