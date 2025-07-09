import React, { useState, useRef } from 'react';

const BrowserSTT = () => {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const initializeRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('이 브라우저는 STT를 지원하지 않습니다.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; // 언어: 한국어
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onerror = (event) => {
      console.error('🎤 STT 오류:', event.error);
      alert('음성 인식 오류: ' + event.error);
    };

    return recognition;
  };

  const handleToggleRecording = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      const recognition = initializeRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        recognition.start();
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎤 브라우저 STT 테스트</h2>
      <button onClick={handleToggleRecording}>
        {listening ? '🎙️ 녹음 중지' : '🎙️ 말하기 시작'}
      </button>

      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        인식된 텍스트: <strong>{text}</strong>
      </p>
    </div>
  );
};

export default BrowserSTT;
