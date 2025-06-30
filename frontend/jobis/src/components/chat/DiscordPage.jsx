import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker'; // 날짜 선택
import { ko } from 'date-fns/locale';    // 달력 한글로 만들기
import 'react-datepicker/dist/react-datepicker.css';

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
  margin-left: 12px;
`;

const ActionButton = styled.button`
  background-color: #5c8bc4;
  color: white;
  border: none;
  font-size: 12px;
  padding: 2px 10px;
  margin-left: 10px;
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
const SendButton = styled.button`
  padding: 8px 16px;         
  background-color: #5c8bc4;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;       
  height: 52px;             
`;

const StyledDatePicker = styled(DatePicker).withConfig({
  shouldForwardProp: (prop) =>
    !['blur'].includes(prop),
})`
  width: 100%;
  height: 34px;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


const DiscordPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [title,setTitle] = useState('');
  const [chatList, setChatList] = useState([]);

  const handleCreateChat = () => {
  const formattedDate = selectedDate.toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(' ', 'T');

  const payload = {
    r_title: title,
    r_tag: '직종 중 택1',
    leader: 1,
    member: 2,
    sch_date: formattedDate,
  };

  fetch('/cjs/insertUserChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  setChatList((prev) => [
    ...prev,
    {
      id: Date.now(),
      title,
      date: selectedDate,
    },
  ]);
  setTitle('');
  setSelectedDate(null);
};



    // const handleCreateChat =()=>{
    //   if(!title || !selectedDate){
    //     alert('제목 또는 날짜를 입력해주세요.');
    //     return;
    //   }
    //    setChatList((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now(),
    //     title,
    //     date: selectedDate,
    //   },
    // ]);
    // setTitle('');
    // setSelectedDate(null);
    // };

  return (
    <Wrapper>
      <Container>
        {/* 
        header랑  chattime은 그냥 알림 표시
        시간 되면 알림표시가 뜨게 하는 방식으로 
         */}
        <Header>
          <Title>‘박말선’님과의 화상 채팅 일정</Title>
          <JoinButton>회의 참여</JoinButton>
        </Header>

        <ChatBox>
          <ChatTime>금일 16:00 시</ChatTime>
        </ChatBox>
        {/* 동적 채팅 출력 */}
          {/* {chatList.map((chat) => (
            <ChatBubble key={chat.id}>
              <Avatar src="https://via.placeholder.com/40" alt="avatar" />
              <BubbleContainer>
                <Bubble>{chat.title}</Bubble>
                <MeetingInfo>
                    일시:{' '}
                    {chat.date.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}{' '}
                    |{' '}
                    {chat.date.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  <PeopleCount>0/1 👥</PeopleCount>
                  <ActionButton>참가</ActionButton>
                </MeetingInfo>
              </BubbleContainer>
            </ChatBubble>
          ))} */}

        <InputSection>
          <InputRow>
            <Input placeholder="제목 입력"  value={title} onChange={(e)=>setTitle(e.target.value)}/>
          </InputRow>

        <DateRow>
          <StyledDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="날짜 선택"
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect         // ✅ 시간 선택 UI 표시
            timeIntervals={30}     // ✅ 30분 간격 선택
            timeFormat="HH:mm"     // ✅ 24시간 형식으로 시간 표시
            locale={ko}
            timeCaption="시간"       
          />
          <SendButton onClick={handleCreateChat}>모집하기</SendButton>
        </DateRow>
        </InputSection>
      </Container>
    </Wrapper>
  );
};

export default DiscordPage;
