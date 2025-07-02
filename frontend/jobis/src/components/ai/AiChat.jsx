import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as GptMicIcon } from '../../assets/icons/GptMicIcon.svg'

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
  margin-bottom: 12px;
  align-items: flex-start;
  justify-content: ${({ isAi }) => (isAi ? 'flex-start' : 'flex-end')};
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
  margin: ${({ isAi }) => (isAi ? '0 0 0 8px' : '0 8px 0 0')};
  white-space: pre-wrap; // ✅ 이거 추가!
`;


const AiMessageBubble = styled(MessageBubble)`
  background-color: #fef3e2;
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
// 스트리밍 시뮬레이션 함수
const streamResultAsync = (prompt, onChunk, onComplete) => {
  const question = "이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...이것은 단지 플레이스홀더 텍스트로 사용되기 위한 예시 문장일 뿐이며...";
  let index = 0;
  const interval = setInterval(() => {
    if (index < question.length) {
      onChunk(question[index]);
      index++;
    } else {
      clearInterval(interval);
      onComplete();
    }
  }, 5);
};

const AiChat = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentStream, setCurrentStream] = useState('');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const textAreaRef = useRef(null);
  const scrollRef = useRef(null);
  const sendButtonRef = useRef(null);
  const isLimitExceeded = inputText.length >= 300;

  const startInterview = () => {
    setStarted(true);
    setIsStreaming(true);
    let tempStream = '';
    streamResultAsync("면접 시작", (chunk) => {
      tempStream += chunk;
      setCurrentStream(tempStream);
    }, () => {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), isAi: true, text: tempStream }
      ]);
      setCurrentStream('');
      setIsStreaming(false);
    });
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
    const now = Date.now();
    setMessages(prev => [
      ...prev,
      { id: now, isAi: false, text: inputText.trim() }
    ]);
    setInputText('');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '40px';
      textAreaRef.current.style.overflowY = 'hidden';
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

  const toggleRecording = () => setIsRecording(prev => !prev);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (sendButtonRef.current) {
        sendButtonRef.current.click();
      }
    }
  };

  const handleRecord = ()=>{
    alert("마이크 버튼 클릭");
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStream]);

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
          {messages.map(msg => (
            <MessageRow key={msg.id} isAi={msg.isAi}>
              {msg.isAi ? (
                <>
                  <ProfileImage src="/img/robot.png" alt="bot" />
                  <AiMessageBubble>{msg.text}</AiMessageBubble>
                </>
              ) : (
                <>
                  <UserMessageBubble>{msg.text}</UserMessageBubble>
                  <ProfileImage src="/img/user.svg" alt="user" />
                </>
              )}
            </MessageRow>
          ))}

          {currentStream && (
            <MessageRow isAi={true}>
              <ProfileImage src="/img/robot.png" alt="bot" />
              <AiMessageBubble>{currentStream}</AiMessageBubble>
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
            placeholder= "답변을 입력하세요."
            maxLength={300}
            rows={1}
            isLimitExceeded={isLimitExceeded}
          />

          {isLimitExceeded && (
            <LimitWarning>최대 300자까지 입력 가능합니다.</LimitWarning>
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
    </Container>
  );
};

export default AiChat;