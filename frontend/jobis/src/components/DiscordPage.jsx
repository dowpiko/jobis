import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background-color: #f8f9fa;
  font-family: sans-serif;
`;

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #1f2a37;
  margin: 0;
`;

const JoinButton = styled.button`
  background-color: #5c8bc4;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #4376b6;
  }
`;

const ChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
`;

const ChatTime = styled.small`
  color: #6b7280;
  margin-bottom: 8px;
  display: block;
`;

const ChatBubble = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 4px;
`;

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Bubble = styled.div`
  background-color: #ffffff;
  border: 1px solid #b0bccb;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2a37;
  max-width: 70%;
`;

const MeetingInfo = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
`;

const PeopleCount = styled.span`
  color: green;
  margin-left: 10px;
`;

const ActionButton = styled.button`
  background-color: #5c8bc4;
  color: white;
  border: none;
  font-size: 12px;
  padding: 2px 10px;
  margin-left: 6px;
  border-radius: 6px;
  cursor: pointer;
`;

const InputSection = styled.div`
  padding: 16px 0;
  border-top: 1px solid #dcdcdc;
`;

const InputRow = styled.div`
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 34px;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  flex: 1;
  height: 34px;
  padding: 6px 8px;
  font-size: 13px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #5c8bc4;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const DiscordPage = () => {
  return (
    <Wrapper>
      <Container>
        <Header>
          <Title>‘박말선’님과의 화상 채팅 일정</Title>
          <JoinButton>회의 참여</JoinButton>
        </Header>

        <ChatBox>
          <ChatTime>금일 16:00 시</ChatTime>

          <ChatBubble>
            <Avatar src="https://via.placeholder.com/40" alt="avatar" />
            <BubbleContainer>
              <Bubble>모의 면접 해요!</Bubble>
              <MeetingInfo>
                일시: 2025.04.21 | 16:00
                <PeopleCount>0/1 👥</PeopleCount>
                <ActionButton>참가</ActionButton>
              </MeetingInfo>
            </BubbleContainer>
          </ChatBubble>

          <ChatBubble>
            <Avatar src="https://via.placeholder.com/40" alt="avatar" />
            <BubbleContainer>
              <Bubble>안녕하세요. 반갑습니다!</Bubble>
            </BubbleContainer>
          </ChatBubble>
        </ChatBox>

        <InputSection>
          <InputRow>
            <Input placeholder="제목 입력" />
          </InputRow>

          <SelectRow>
            <Select><option>연</option></Select>
            <Select><option>월</option></Select>
            <Select><option>일</option></Select>
            <Select><option>시</option></Select>
            <SendButton>↑</SendButton>
          </SelectRow>
        </InputSection>
      </Container>
    </Wrapper>
  );
};

export default DiscordPage;
