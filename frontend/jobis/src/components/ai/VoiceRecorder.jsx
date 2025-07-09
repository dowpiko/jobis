import React, { useState, useRef } from 'react';
import axios from 'axios';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    audioChunksRef.current = [];
    audioContextRef.current = new AudioContext();

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const wavBlob = audioBufferToWav(audioBuffer);

      const formData = new FormData();
      formData.append('voice', wavBlob, 'recording.wav');

      try {
        const res = await axios.post('/jsh/voicetotext', formData);
        setResult(res.data.text || '결과 없음');
      } catch (err) {
        setResult('에러 발생: ' + (err.response?.data || err.message));
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
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

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? '녹음 중지' : '녹음 시작'}
      </button>
      <div style={{ marginTop: '1rem' }}>
        <strong>STT 결과:</strong>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default VoiceRecorder;
