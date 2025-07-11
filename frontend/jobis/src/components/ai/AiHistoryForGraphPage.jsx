// src/components/AIHistoryForGraphPage.jsx
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: transparent;
`;

const Header = styled.div`
	padding: 10px 0;
	font-weight: bold;
	font-size: 1.15rem;
	text-align: center;
	border-bottom: 1px solid #3a4a63;
	color: #ffffff;
`;

const ChatContainer = styled.div`
	flex: 1;
	overflow-y: auto;
	padding: 16px;
`;

const MessageRow = styled.div`
	display: flex;
	margin-bottom: 24px;
	align-items: flex-start;
	justify-content: ${({ $isAi }) => ($isAi ? 'flex-start' : 'flex-end')};
`;

const ProfileImage = styled.img`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	margin: 0 8px;
	background-color: #3a4a63;
	object-fit: cover;
	border: 2px solid #4f6583;
`;

const MessageBubble = styled.div`
	padding: 12px;
	border-radius: 12px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
	font-size: 16px;
	max-width: 800px;
	word-break: break-word;
	white-space: pre-wrap;
	margin: ${({ $isAi }) => ($isAi ? '0 0 0 8px' : '0 8px 0 0')};
	color: #ecf0f1;
`;

const AiMessageBubble = styled(MessageBubble)`
	background-color: #34495e;
`;

const UserMessageBubble = styled(MessageBubble)`
	background-color: #2d7d9a;
`;

const QuestionLabel = styled.div`
	font-size: 16px;
	font-weight: bold;
	color: #f9cb9c;
	margin-bottom: 6px;
`;

const Placeholder = styled.div`
	font-size: 16px;
	color: #aab2bd;
	padding: 20px;
	text-align: center;
`;


const AiHistoryForGraphPage = ({ title = "면접 기록", records = [] }) => {
  if (!Array.isArray(records) || records.length === 0) {
    return (
      <Container>
        <Header>{title}</Header>
        <Placeholder>면접 기록이 없습니다.</Placeholder>
      </Container>
    );
  }

  return (
    <Container>
      <Header>{title}</Header>
      <ChatContainer>
        {records.map((item, idx) => (
          <React.Fragment key={idx}>
            <MessageRow $isAi={true}>
              <ProfileImage src="/img/robot.png" alt="bot" />
              <AiMessageBubble>
                <QuestionLabel>Q{item.num}.</QuestionLabel>
                {item.question}
              </AiMessageBubble>
            </MessageRow>
            <MessageRow $isAi={false}>
              <UserMessageBubble>{item.answer}</UserMessageBubble>
              <ProfileImage src="/img/user.svg" alt="user" />
            </MessageRow>
          </React.Fragment>
        ))}
      </ChatContainer>
    </Container>
  );
};

export default AiHistoryForGraphPage;
