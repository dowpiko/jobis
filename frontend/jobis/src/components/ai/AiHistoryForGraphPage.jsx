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
	border-bottom: 1px solid #CBD5E1; // 부드러운 경계
	color: #1F2A37; // 기본 텍스트 색
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
	background-color: #E0E7EF; // 기존 중립 배경 유지
	object-fit: cover;
	border: 3px solid #94A3B8; // 💡 테두리만 한 단계 진하게
`;


const MessageBubble = styled.div`
	padding: 12px 16px;
	border-radius: 12px;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	font-size: 16px;
	line-height: 1.6;
	max-width: 800px;
	word-break: break-word;
	white-space: pre-wrap;
	margin: ${({ $isAi }) => ($isAi ? '0 0 0 8px' : '0 8px 0 0')};
	color: #1F2A37;
	background-color: ${({ $isAi }) => ($isAi ? '#D0E2F2' : '#CDE7DA')}; // 💡 대비 확실한 색
`;

const AiMessageBubble = styled(MessageBubble)`
	background-color: #B6CDE2; // 💬 AI - 약간 더 어두운 블루
`;
const UserMessageBubble = styled(MessageBubble)`
	background-color: #CDE7DA; // 연한 민트, 패널과 구분 확실
`;


const QuestionLabel = styled.div`
	font-size: 15px;
	font-weight: 600;
	color: #3B4A5A;
	margin-bottom: 6px;
`;

const Placeholder = styled.div`
	font-size: 16px;
	color: #6B7280;
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
