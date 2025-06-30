import React from 'react';
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
  flex: 0.75; /* ✅ 채팅창 넓힘 */
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
  flex: 0.25; /* ✅ 공고 패널 좁힘 */
  display: flex;
  align-items: center;
  justify-content: center;
  writing-mode: vertical-rl;
  font-size: 24px;
  font-weight: bold;
  color: #4376b6;
  background-color: #f0f2f5;
`;


const ChatLayout = () => {
  return (
    <Wrapper>
      {/* 채팅 목록 */}
      <ChatListPanel>
        <PanelTitle>채팅</PanelTitle>
        <ChatCard selected>
          <Avatar src="https://via.placeholder.com/32" alt="avatar" />
          <div>
            <div>이름 : 홍길동</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </ChatCard>
        <ChatCard>
          <Avatar src="https://via.placeholder.com/32" alt="avatar" />
          <div>
            <div>이름 : 안산시</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </ChatCard>
        <ChatCard>
          <Avatar src="https://via.placeholder.com/32" alt="avatar" />
          <div>
            <div>이름 : 아우치</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </ChatCard>
      </ChatListPanel>

      {/* 채팅창 */}
      <ChatPanel>
        <ChatContent>
          {/* 대화내용 생략 */}
        </ChatContent>
        <InputContainer>
          <Input type="text" placeholder="채팅을 입력하세요." />
          <Button>▶️</Button>
          <Button>🎤</Button>
          <Button>🔄</Button>
        </InputContainer>
      </ChatPanel>

      {/* 공고 패널 */}
      <AnnouncementPanel>
        고<br />공<br />당<br />해
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default ChatLayout;
