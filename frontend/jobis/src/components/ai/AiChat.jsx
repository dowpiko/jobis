import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as GptMicIcon } from '../../assets/icons/GptMicIcon.svg'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { nanoid } from 'nanoid';
import axios from 'axios';
import VoiceRecorder from './VoiceRecorder';
import { FaHeadphones } from 'react-icons/fa';


const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  position: relative;
  padding: 10px;
  font-weight: bold;
  font-size: 1.15rem;
  border-bottom: 1px solid #ccc;

  display: flex;
  justify-content: center;
  align-items: center;
`;



const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const MessageRow = styled.div`
  display: flex;
  margin-bottom: 24px; // ✅ 간격 2배 늘림
  align-items: flex-start;
  justify-content: ${({ $isAi }) => ($isAi ? 'flex-start' : 'flex-end')};
`;



const ProfileImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 8px;
  background-color: #f0f0f0; // 배경 추가
  object-fit: cover;
`;


const MessageBubble = styled.div`
  background-color: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-size: 20px;
  max-width: 1050px;
  width: fit-content;
  word-break: break-word;
  margin: ${({ $isAi }) => ($isAi ? '0 0 0 8px' : '0 8px 0 0')};
  white-space: pre-wrap; // ✅ 이거 추가!
`;

const ListenButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    fill: #666;

    &:hover {
      fill: #000;
    }
  }
`;

const QuestionLabel = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #888;
  margin-bottom: 8px;
`;

const AiMessageBubble = styled(MessageBubble)`
  background-color: #fef3e2;
  position: relative;
  padding-bottom: 36px; // 버튼 공간 확보 (겹침 방지)
`;

const UserMessageBubble = styled(MessageBubble)`
  background-color: #e6f0ff;
`;

const InputFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #ccc;
  gap: 10px;
`;

const TextAreaInput = styled.textarea`
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  resize: none;

  overflow-y: hidden;
  scrollbar-gutter: stable;
  
  min-height: 40px;
  max-height: 96px;
  height: 40px;

  box-sizing: border-box;
  padding: 8px 40px 8px 10px;
  

  /* ✅ 아래 스타일 변경 */
  border: none;
  outline: none;
  color: #333;

  &:focus {
    outline: none;
  }
`;

const LimitWarning = styled.div`
  color: #d00;
  font-size: 12px;
  margin-top: -4px;
  margin-left: 4px;
`;

const InterviewStart = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StartButton = styled.button`
  padding: 14px 24px;
  font-size: 18px;
  background-color: #4376B6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const TopRightControls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
`;

const TopRightButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 0 0 0 10px;
  padding: 6px 8px;
  font-size: 14px; /* 줄어든 텍스트/이모지 크기 */
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #c0392b;
  }
`;
const ButtonArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px; /* 더 넓은 간격 */
`;

const SendButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? "#999" : "#000")};
  color: #fff;
  border: none;
  border-radius: 50%; /* 원형 처리 */
  width: 40px;
  height: 40px;
  font-size: 18px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#999" : "#222")};
  }
`;

const IconButton = styled.button`
  background: ${({ disabled }) => (disabled ? '#fff' : '#000')};
  border: ${({ disabled }) => (disabled ? '1px solid #ccc' : 'none')};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 8px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border 0.2s;

  svg {
    width: 20px;
    height: 20px;
    color: ${({ disabled }) => (disabled ? '#999' : '#fff')};
  }
`;


const TextAreaWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 8px;
  right: 14px;  // ✅ 스크롤과 간격 확보
  background: transparent;
  border: none;
  font-size: 18px;
  font-weight: normal;
  color: #444;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;
const host = process.env.REACT_APP_HOST;
const AiChat = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [count, setCount] = useState(1);
  const [previousQuestion, setPreviousQuestion] = useState('');
  const [standards, setStandards] = useState([]);
  const [showRecorder, setShowRecorder] = useState(false);
  const [koreanVoice, setKoreanVoice] = useState(null);
  const currentStreamRef = useRef('');
  const textAreaRef = useRef(null);
  const scrollRef = useRef(null);
  const sendButtonRef = useRef(null);
  const isLimitExceeded = inputText.length >= 1000;


  // 웹소켓 관련 코드
  const SOCKET_URL = `ws://${host}:9090/ws/interview`; // websocket 주소

  const{
    sendMessage,      //문자열을 서버(WebSocket)로 전송하는 함수
    lastMessage,      //마지막으로 수신한 메시지 객체 (이벤트 발생 시 업데이트됨)
    readyState,       //WebSocket 연결 상태 (0: 연결 중, 1: 열림, 2: 닫힘 준비, 3: 닫힘) 숫자로 나옴
  } = useWebSocket(SOCKET_URL, {
    share:true,
    shouldReconnect: () => true,
    reconnectAttempts: 5,
    onOpen: () => {
      console.log('WebSocket 연결됨');
    },
    onError: (event) => {
      console.error('WebSocket 에러', event);
    },
  });


  const startInterview = () => {
    setStarted(true);
    setPreviousQuestion('');

    // WebSocket 연결이 열려있는 경우에만
    if(readyState === ReadyState.OPEN){
      setIsStreaming(true);
      setCurrentStream('');
      sendMessage(JSON.stringify({
        count: count,
        previousQuestion: previousQuestion,  // 첫 메시지에는 이전 질문이 없음
        standards: standards,
        userMessage: ''
      }));
    } else{
      console.warn("WebSocket 연결이 아직 열리지 않았습니다.");
      
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    const el = textAreaRef.current;
    if (el) {
      el.style.height = '24px';
      const scrollHeight = el.scrollHeight;
      const maxHeight = 72;
      el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const messageToSend = inputText.trim();

    setMessages(prev =>[
      ...prev,
      {id: nanoid(), isAi:false, text: messageToSend}
    ]);

    setInputText('');

    if(textAreaRef.current){
      textAreaRef.current.style.height = '40px';
      textAreaRef.current.style.overflowY = 'hidden';
    }

    if(readyState === ReadyState.OPEN){
      setIsStreaming(true);
      setCurrentStream('');
      sendMessage(JSON.stringify({
        count: count,
        previousQuestion: previousQuestion,
        standards: standards,
        userMessage: messageToSend
      }));
    }else{
      console.warn('WebSocket이 연결되어 있지 않습니다.');
    }
  };

  const handleClearInput = () => {
    setInputText('');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '40px';
      textAreaRef.current.style.overflowY = 'hidden';
    }
  };

  const earlyTermination = () => {
    if (window.confirm('면접을 조기에 종료하시겠습니까?\n(일일 횟수 소진)')) {
      navigate('/aiInterview');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (sendButtonRef.current) {
        sendButtonRef.current.click();
      }
    }
  };

  const handleRecord = () => {
    if (!started || isStreaming) return;
    setShowRecorder(true);
  };

  const sendTerminationMessage = () => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify({ type: "terminate" }));
    } else {
      console.warn("WebSocket이 열려 있지 않아 종료 메시지 전송 실패");
    }
  };

  const getQuestionResponse = () => {
    try {
      const parsed = JSON.parse(currentStreamRef.current);
      const finalText = parsed.question;
      const standards = parsed.standards;

      setMessages(prev => [
        ...prev,
        { id: nanoid(), isAi: true, text: finalText }
      ]);
      setStandards(standards);
      setPreviousQuestion(finalText);
      setCount(prev => prev + 1);
    } catch (e) {
      console.error("질문 응답 파싱 실패:", e);
    }
  };

  const getResultResponse = async () => {
    try {
      sendTerminationMessage();
      const resultArray = JSON.parse(currentStreamRef.current);

      // 서버에 결과 전송
      const response = await axios.post(`http://${host}:9090/ymj/saveInterviewResult`, resultArray, {
                            withCredentials: true,
                            headers: {
                              "Content-Type": "application/json"
                            }
                          }); 
      const resultData = response.data;

      // ✅ 응답이 "ok"일 때만 알림 및 이동
      if (resultData === "ok") {
        alert("모의면접이 완료되었습니다.\n결과 페이지로 이동합니다.");
        navigate("/graphPage");
      } else {
        console.warn("서버 응답이 ok가 아님:", resultData);
      }

    } catch (error) {
      console.error("🛑 서버 전송 또는 파싱 실패:", error);
    }
  };

  const handleListen = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();

    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.startsWith('ko') && v.name.toLowerCase().includes('google'));
      setKoreanVoice(koVoice || voices.find(v => v.lang.startsWith('ko')) || null);
    };

    // 초기 음성 로딩 및 변경 이벤트 설정
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages, currentStream]);

  useEffect(() => {
    if (!lastMessage || typeof lastMessage.data !== 'string') return;

    const data = lastMessage.data;

    if (data === '[DONE]') {
      if (currentStreamRef.current.trim()) {
        if (count === 11) {
          getResultResponse();
        } else {
          getQuestionResponse();
        }

        currentStreamRef.current = '';
        setCurrentStream('');
        setIsStreaming(false);
      }
    } else {
      currentStreamRef.current += data;

      const match = currentStreamRef.current.match(/"question"\s*:\s*"([^"]*)/);

      if (match && match[1]) {
        const newText = match[1];
        if (newText !== currentStream) {      // ✅ 상태랑 비교
          setCurrentStream(newText);
        }
      } else {
        if (currentStream !== '') {
          setCurrentStream('');
        }
      }
    }
  }, [lastMessage, count]);  // ❗ currentStream을 의존성 배열에 절대 넣지 말 것



  return (
    <Container>
      {started && (
        <TopRightControls>
          <TopRightButton onClick={earlyTermination}>X</TopRightButton>
        </TopRightControls>
      )}
      <Header>
        {started && (
          <TopRightControls>
            <TopRightButton onClick={earlyTermination}>X</TopRightButton>
          </TopRightControls>
        )}
        {sessionStorage.getItem("surveyTitle")}
      </Header>

      {started ? (
        <ChatContainer ref={scrollRef}>
          {(() => {
            let questionIndex = 1;

            return messages.map((msg, index) => {
              const isAi = msg.isAi;
              const label = isAi ? `Q${questionIndex++}.` : null;

              return (
                <MessageRow key={msg.id} $isAi={isAi}>
                  {isAi ? (
                    <>
                      <ProfileImage src="/img/robot.png" alt="bot" />
                      <AiMessageBubble>
                        <QuestionLabel>{label}</QuestionLabel>
                        {msg.text}
                        {!isStreaming && (
                          <ListenButton onClick={() => handleListen(msg.text)}>
                            <FaHeadphones />
                          </ListenButton>
                        )}
                      </AiMessageBubble>
                    </>
                  ) : (
                    <>
                      <UserMessageBubble>{msg.text}</UserMessageBubble>
                      <ProfileImage src="/img/user.svg" alt="user" />
                    </>
                  )}
                </MessageRow>
              );
            });
          })()}
          {isStreaming && count <= 10 && (
            <MessageRow $isAi={true}>
              <ProfileImage src="/img/robot.png" alt="bot" />
              <AiMessageBubble>
                <QuestionLabel>Q{count}.</QuestionLabel>
                {currentStream}
              </AiMessageBubble>
            </MessageRow>
          )}
        </ChatContainer>
      ) : (
        <InterviewStart>
          <StartButton onClick={startInterview}>면접 시작</StartButton>
        </InterviewStart>
      )}

      <InputFooter>
        <TextAreaWrapper>
          <TextAreaInput
            ref={textAreaRef}
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="답변을 입력하세요."
            maxLength={1000}
            rows={1}
            $isLimitExceeded={isLimitExceeded}
          />

          {isLimitExceeded && (
            <LimitWarning>최대 1000자까지 입력 가능합니다.</LimitWarning>
          )}
          {inputText && (
            <ClearButton onClick={handleClearInput}>X</ClearButton>
          )}
        </TextAreaWrapper>

        <ButtonArea>
          <IconButton
            disabled={!started || isStreaming}
            onClick={handleRecord}
          >
            <GptMicIcon />
          </IconButton>
          <SendButton
            ref={sendButtonRef}
            disabled={!started || isStreaming || !inputText.trim()}
            onClick={handleSend}
          >
            ↑
          </SendButton>
        </ButtonArea>
      </InputFooter>

      {showRecorder && (
        <VoiceRecorder
          onClose={() => setShowRecorder(false)}
          onResult={(text) => {
            setInputText(text);
          }}
        />
      )}
    </Container>
  );


};

export default AiChat;