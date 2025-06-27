import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f7f3f3;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 18px;
`;

const JoinButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
`;

const ChatBox = styled.div`
  margin-top: 20px;
`;

const ChatBubble = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 4px;
`;

const Bubble = styled.div`
  background-color: #d9d9d9;
  padding: 12px;
  border-radius: 12px;
  max-width: 70%;
`;

const MeetingInfo = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #333;
`;

const PeopleCount = styled.span`
  color: green;
  margin-left: 10px;
`;

const ActionButton = styled.button`
  background-color: #222;
  color: white;
  border: none;
  font-size: 12px;
  padding: 2px 10px;
  margin-left: 6px;
  border-radius: 4px;
`;

const InputSection = styled.div`
  margin-top: 30px;
  background-color: #d9d9d9;
  padding: 20px;
  border-radius: 8px;
`;

const InputRow = styled.div`
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  height: 36px;
  padding: 8px;
  border: none;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;

const Select = styled.select`
  flex: 1;
  height: 36px;
  padding: 6px;
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: black;
  color: white;
  font-size: 18px;
  border: none;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

const DiscordPage = () => {
  return (
    <Container>
      <Header>
        <Title>‘박말선’님 과의 화상 채팅 일정</Title>
        <JoinButton>회의 참여</JoinButton>
      </Header>

      <ChatBox>
        <small>금일 16:00 시</small>

        <ChatBubble>
          <Avatar src="https://via.placeholder.com/40" />
          <div>
            <Bubble>모의 면접 해요!</Bubble>
            <MeetingInfo>
              일시 : 2025.04.21 | 16:00 시
              <PeopleCount>0 / 1 👥</PeopleCount>
              <ActionButton>참가</ActionButton>
            </MeetingInfo>
          </div>
        </ChatBubble>

        <ChatBubble style={{ justifyContent: 'flex-end' }}>
          <div>
            <Bubble style={{ float: 'right' }} />
          </div>
          <Avatar src="https://via.placeholder.com/40" />
        </ChatBubble>

        <ChatBubble>
          <Avatar src="https://via.placeholder.com/40" />
          <Bubble />
        </ChatBubble>
      </ChatBox>

      <InputSection>
        <InputRow>
          <Input placeholder="제목" />
        </InputRow>

        <SelectRow>
          <Select>
            <option>연</option>
          </Select>
          <Select>
            <option>월</option>
          </Select>
          <Select>
            <option>일</option>
          </Select>
          <Select>
            <option>시</option>
          </Select>
          <SendButton>↑</SendButton>
        </SelectRow>
      </InputSection>
    </Container>
  );
};

export default DiscordPage;
