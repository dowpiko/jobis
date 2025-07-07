import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker'; // 날짜 선택
import { ko } from 'date-fns/locale';    // 달력 한글로 만들기
import 'react-datepicker/dist/react-datepicker.css';
import JoinInterviewModal from '../modal/JoinInterviewModal';
//  import useWebSocket from '../useWebSocket';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';


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
  max-height: 650px;     // ✅ 스크롤 제한 높이 추가
  overflow-y: auto;
  padding-bottom: 10px;
  border: 1px solid #ccc; // (선택) 시각적으로 구분
  background-color: #fff; // (선택) 가시성 향상
`;

const ChatBubble = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 14px;
  flex-direction: ${(props) => (props.$isMine ? 'row-reverse' : 'row')};
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
  align-items: ${(props) => (props.$isMine ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled.div`
   background-color: ${(props) => (props.$isMine ? '#d1eaff' : '#ffffff')};
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
  const [showModal,setShowModal] =useState(false);
  const [selectedChat,setSelectedChat] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);   // 로드시 버튼 수
  const [isAtBottom, setIsAtBottom] = useState(true);    // 스크롤 위치 상태 저장
  const [myUno, setMyUno] = useState(() => window.myUno);
  const scrollRef = useRef(null);
  const prevChatListLength = useRef(0);
  const socketRef = useRef(null);


  const fetchChatList = () => {
    fetch('/getUserChat')
      .then((res) => res.json())
      .then((data) => {
          console.log('서버에서 받은 데이터:', data); // ✅ 확인용
        const parsed = data.map((chat) => ({
          ...chat,
          sch_date: new Date(chat.sch_date), // 문자열 → Date 객체로 변환
        }))
        .reverse();
        setChatList(parsed);
      });
  };
  useEffect(() => {
    fetchChatList(); 
    // const interval = setInterval(fetchChatList, 5000); 
    // return () => clearInterval(interval);
  }, []);

  // 처음 로드시 스크롤 맨 아래로
  useEffect(() => {
    const box = scrollRef.current;
    if (box && chatList.length > 0 ) {
      setTimeout(() => {
        box.scrollTop = box.scrollHeight;
      }, 0);
    }
  }, []); 


    // ❸ 스크롤 위로 → 더 과거 추가
  const handleScroll = () => {
    const box = scrollRef.current;
    const isBottom = Math.abs(box.scrollHeight - box.scrollTop - box.clientHeight) <= 1;
    
    setIsAtBottom(isBottom);

    if (box.scrollTop === 0 && visibleCount < chatList.length) {
      const prevHeight = box.scrollHeight;
      setVisibleCount((prev) => Math.min(prev + 5, chatList.length));
      setTimeout(() => {
        box.scrollTop = box.scrollHeight - prevHeight + 0.5;
      }, 0);
    }
  };
  useEffect(() => {
    const box = scrollRef.current;
    const newMessagesAdded = chatList.length > prevChatListLength.current;
    if (isAtBottom && newMessagesAdded) {
        setTimeout(() => {
          box.scrollTop = box.scrollHeight;
        }, 0);
    }
     prevChatListLength.current = chatList.length;
  }, [chatList, isAtBottom]);
  const visibleChats = chatList.slice(-visibleCount);


  const handleCreateChat = () => {
    if (!selectedDate || !title.trim()) {
    alert('제목과 날짜를 모두 입력하세요');
    return;
    }

    const formattedDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      r_title: title,
      r_tag: '직종 중 택1',
      sch_date: formattedDate,
      leader : myUno,
    };
    //   세션 만료되면 alert
      fetch('/insertUserChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (res.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인해주시기 바랍니다.');
          window.location.href = '/'; // 로그인 페이지로 이동
          return;
        }
        return res.text();
      })
      .then(text => {
        if (text === 'success') {
          fetchChatList();
          setVisibleCount(9); // 다시 9개부터 시작
          if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(payload));
          }
        }
      })
      .catch(err => console.error('Insert 요청 에러:', err));


      setTitle('');
      setSelectedDate(null);
};

 // 세션 uno랑 leader랑 비교
 useEffect(() => {
   fetch('/getMyUno', { credentials: 'include' })
     .then(res => {
       if (res.status === 401) {
         alert('로그인 상태가 아닙니다.');
         window.location.href = '/';
         return;
       }
       return res.json();
     })
     .then(uno => {
       if (uno !== undefined) setMyUno(uno);
     })
     .catch(err => console.error('세션 uno 가져오기 실패:', err));
 }, []);

const handleOnConfirm = () => {
  if (!selectedChat) return;

  fetch('/joinChat', {
    method: 'POST',
    credentials: 'include', // 세션 유지
    headers: {
      'Accept': 'text/plain;charset=UTF-8', 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cno: selectedChat.cno })
  })
    .then((res) => {
      if (res.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/';
        return;
      }
      return res.text(); 
    })
    .then((text) => {
      if (!text) return;
      if (text === '참여 완료') {
        alert('성공적으로 참여했습니다!');
        setShowModal(false);
        fetchChatList(); // 채팅 목록 갱신
      } else {
        alert(`참여에 실패했습니다: ${text}`);
      }
    })
    .catch((err) => {
      console.error('참여 요청 실패:', err);
      alert('서버 오류가 발생했습니다.');
    });
};
// websocket 관련
useEffect(() => {
  const socket = new WebSocket("ws://localhost:9090/ws/userChat");
  socketRef.current = socket;

  socket.onopen = () => {
    console.log("✅ WebSocket 연결됨");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("📩 실시간 메시지 수신:", message);
    setChatList((prev) => [...prev, {
      ...message,
      sch_date: new Date(message.sch_date),
    }]);
  };

  socket.onerror = (err) => {
    console.error("⚠️ WebSocket 오류:", err);
  };

  socket.onclose = () => {
    console.log("❌ WebSocket 연결 종료");
  };

  return () => socket.close();
}, []);

  
  return (
     <Wrapper>
      <Container>
        <Header>
          <Title>‘박말선’님과의 화상 채팅 일정</Title>
          <JoinButton>회의 참여</JoinButton>
        </Header>
        <ChatBox ref={scrollRef} onScroll={handleScroll}> {/* ✅ 스크롤 감지 */}
          {visibleChats.map((chat) => {
            const isMine = chat.leader === myUno;
            return (
              <ChatBubble key={chat.cno} $isMine={isMine}>
                {!isMine && <Avatar src="https://via.placeholder.com/40" alt="avatar" />}
                {!isMine && <div>{chat.leader_name}</div>}
                <BubbleContainer $isMine={isMine}>
                  <Bubble $isMine={isMine}>{chat.r_title}</Bubble>
                  <MeetingInfo>
                    일시:{' '}
                    {chat.sch_date.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}{' '}
                    |{' '}
                    {chat.sch_date.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                    <PeopleCount>{chat.member ? '1/1' : '0/1'} 👥</PeopleCount>

                    {/* 참가 버튼 조건 분기 */}
                    {!isMine && (
                      chat.member ? (
                        <span style={{ marginLeft: '10px', color: 'red' }}>인원이 꽉 찼습니다</span>
                      ) : (
                        <ActionButton
                          onClick={() => {
                            setSelectedChat(chat);
                            setShowModal(true);
                          }}
                        >
                          참가
                        </ActionButton>
                      )
                    )}
                  </MeetingInfo>
                </BubbleContainer>
              </ChatBubble>
            );
          })}
        </ChatBox>

        <InputSection>
          <InputRow>
            <Input
              placeholder="제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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

        {showModal && (
          <JoinInterviewModal
            onClose={() => setShowModal(false)}
            chat={selectedChat}
            onConfirm={handleOnConfirm}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default DiscordPage;
