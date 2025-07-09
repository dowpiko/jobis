import React, { useState, useEffect } from 'react';

const ChromeTTSWithVoiceSelect = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

  // 브라우저에서 음성 리스트 불러오기
  useEffect(() => {
    const loadVoices = () => {
      const voiceList = speechSynthesis.getVoices();
      setVoices(voiceList);

      // 기본값 설정 (한국어 음성 우선)
      const defaultKorean = voiceList.find(v => v.lang.startsWith('ko'));
      if (defaultKorean) {
        setSelectedVoiceURI(defaultKorean.voiceURI);
      } else if (voiceList.length > 0) {
        setSelectedVoiceURI(voiceList[0].voiceURI);
      }
    };

    // 일부 브라우저에서 비동기로 로딩되므로 이벤트 등록
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices(); // 초기 호출
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🗣 크롬 내장 TTS (보이스 선택)</h2>

      <input
        type="text"
        value={text}
        placeholder="말할 텍스트를 입력하세요"
        onChange={(e) => setText(e.target.value)}
        style={{ width: '300px', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="voiceSelect">음성 선택: </label>
        <select
          id="voiceSelect"
          value={selectedVoiceURI}
          onChange={(e) => setSelectedVoiceURI(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        >
          {voices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSpeak}>읽어주기</button>
    </div>
  );
};

export default ChromeTTSWithVoiceSelect;
