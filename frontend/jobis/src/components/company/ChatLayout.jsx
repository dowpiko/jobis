import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  font-family: sans-serif;
  background-color: #f8f9fa;
`;

const ChatListPanel = styled.div`
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #b0bccb;
  background-color: #f0f2f5;
`;

const PanelTitle = styled.h3`
  margin-bottom: 10px;
  color: #1f2a37;
`;

const ChatCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.selected ? '#e0e7ef' : '#f0f2f5')};
  border: 1px solid ${(props) => (props.selected ? '#4376B6' : '#b0bccb')};
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #d4eaf4;
  }
`;

const Avatar = styled.img`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const ChatPanel = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #b0bccb;
  background-color: #ffffff;
`;

const ChatContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid #b0bccb;
  background-color: #f0f2f5;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
  outline: none;
`;

const Button = styled.button`
  padding: 10px;
  margin-left: 8px;
  border: none;
  background-color: #e0e7ef;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c6d8ec;
  }
`;

const AnnouncementPanel = styled.div`
  width: 20%;
  padding: 16px;
  background-color: #f0f2f5;
  box-sizing: border-box;
  overflow-y: auto;
`;

const AnnouncementContent = styled.div`
  text-align: left;
  font-size: 13px;
`;

const InfoRow = styled.div`
  margin-bottom: 4px;
  font-size: 13px;
  color: #374151;

  strong {
    color: #1f2a37;
    margin-right: 4px;
  }
`;

const QAWrapper = styled.div`
  margin-top: 10px;
`;

const QAItem = styled.div`
  margin-bottom: 8px;
`;

const QuestionText = styled.div`
  font-weight: 600;
  color: #111827;
  font-size: 13px;
`;

const AnswerText = styled.div`
  color: #374151;
  padding-left: 8px;
  font-size: 13px;
`;

const ChatLayout = () => {
  const [chatList, setChatList] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [offerSubmission, setOfferSubmission] = useState(null);

  const initChatLayout = async () => {
    try {
      const cno = 21;
      const res = await axios.get(`http://localhost:9090/sm/initChatLayout?cno=${cno}`);
      const processedData = res.data.map(item => ({
        ...item,
        name: item.name || '-',
        birthYear: item.birthdate ? `${new Date(item.birthdate).getFullYear()}년생` : '-',
      }));
      setChatList(processedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    initChatLayout();
  }, []);

  const handleChatCardClick = async (ono, uno) => {
    setShowAnnouncement(true);

    try {
      const res = await axios.get(`http://localhost:9090/sm/selectOfferAndSubmission`, {
        params: { ono, uno }
      });
      setOfferSubmission(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('오류 발생:', err);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Wrapper>
      <ChatListPanel>
        <PanelTitle>채팅</PanelTitle>
        {chatList.map((item, index) => (
          <ChatCard key={index} selected={false} onClick={() => handleChatCardClick(item.ono, item.emp)}>
            <Avatar src="https://via.placeholder.com/32" alt="avatar" />
            <div>
              <div>{item.name}({item.birthYear})</div>
            </div>
          </ChatCard>
        ))}
      </ChatListPanel>

      <ChatPanel>
        <ChatContent>
          {/* 기존 채팅 내용 */}
        </ChatContent>
        <InputContainer>
          <Input type="text" placeholder="채팅을 입력하세요." />
          <Button>▶️</Button>
          <Button>🎤</Button>
          <Button>🔄</Button>
        </InputContainer>
      </ChatPanel>

      <AnnouncementPanel>
        {showAnnouncement && offerSubmission ? (
          <AnnouncementContent>
            <InfoRow><strong>지원일:</strong> {formatDate(offerSubmission.user_regdate)}</InfoRow>

            <QAWrapper>
              {(() => {
                const questions = offerSubmission.o_content ? offerSubmission.o_content.split('\n') : [];
                const answers = offerSubmission.user_content ? offerSubmission.user_content.split('\n') : [];
                return questions.map((q, idx) => (
                  <QAItem key={idx}>
                    <QuestionText>Q{idx + 1}. {q}</QuestionText>
                    <AnswerText>A{idx + 1}. {answers[idx] || '-'}</AnswerText>
                  </QAItem>
                ));
              })()}
            </QAWrapper>
          </AnnouncementContent>
        ) : (
          <div style={{ color: '#aaa', fontSize: '13px' }}>공고를 선택하세요</div>
        )}
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default ChatLayout;
