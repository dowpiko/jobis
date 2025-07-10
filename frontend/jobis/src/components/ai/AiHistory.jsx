// AiHistory.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';

// Styles (AiChat과 유사하게)
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;`
;
const Header = styled.div`
  position: relative;
  padding: 10px;
  font-weight: bold;
  font-size: 1.15rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;`
;
const TopRightControls = styled.div`
  position: absolute;
  top: 0; right: 0; z-index: 10;`
;
const TopRightButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 0 0 0 10px;
  padding: 6px 8px;
  font-size: 14px;
  cursor: pointer;
  &:hover { background-color: #c0392b; }`
;
const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;`
;
const MessageRow = styled.div`
  display: flex;
  margin-bottom: 24px;
  align-items: flex-start;
  justify-content: ${({ $isAi }) => ($isAi ? 'flex-start' : 'flex-end')};`
;
const ProfileImage = styled.img`
  width: 56px; height: 56px;
  border-radius: 50%;
  margin: 0 8px;
  background-color: #f0f0f0;
  object-fit: cover;`
;
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
  white-space: pre-wrap;`
;
const AiMessageBubble = styled(MessageBubble)`
  background-color: #fef3e2;`
;
const UserMessageBubble = styled(MessageBubble)`
  background-color: #e6f0ff;`
;

const QuestionLabel = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #888;
  margin-bottom: 8px;`
;

const AiHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { content: raw, title } = location.state || {};
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!raw) {
      console.warn("❗No content passed to AiHistory");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      console.log("📦Parsed records:", parsed);
      setRecords(parsed);
    } catch (e) {
      console.error("🛑 Failed to parse history content:", e);
    }
  }, [raw]);

  return (
    <Container>
      <TopRightControls>
        <TopRightButton onClick={() => navigate('/aiInterview')}>X</TopRightButton>
      </TopRightControls>
      <Header>{title || "면접 기록"}</Header>
      <ChatContainer>
        {records.map((item, idx) => (
          <React.Fragment key={nanoid()}>
            <MessageRow $isAi={true}>
              <ProfileImage src="/img/robot.png" alt="bot" />
              <AiMessageBubble>
                <QuestionLabel>Q{item.num}.</QuestionLabel>
                {item.question}
              </AiMessageBubble>
            </MessageRow>
            <MessageRow $isAi={false}>
              <UserMessageBubble>
                {item.answer}
              </UserMessageBubble>
              <ProfileImage src="/img/user.svg" alt="user" />
            </MessageRow>
          </React.Fragment>
        ))}
      </ChatContainer>
    </Container>
  );
};

export default AiHistory;