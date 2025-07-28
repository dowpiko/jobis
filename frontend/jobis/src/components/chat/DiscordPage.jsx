import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import DatePicker from 'react-datepicker'; // 날짜 선택
import { ko } from 'date-fns/locale';    // 달력 한글로 만들기
import 'react-datepicker/dist/react-datepicker.css';
import JoinInterviewModal from '../modal/JoinInterviewModal';
import { useLocation, useNavigate } from 'react-router-dom';
import categories from '../../data/categories';  
import VideoChatModal from './VideoChatModal';
import { AuthContext } from '../../contexts/AuthContext';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  background-color: #f8f9fa;
  font-family: sans-serif;
`;
const TitleInputWrapper = styled.div`       
  display: flex;
  margin-bottom: 10px;
`; 

const PrefixInput = styled.input`          
  flex: 0 0 auto;
  background-color: #f0f0f0;
  border: 1px solid #b0bccb;
  border-radius: 6px 0 0 6px;
  padding: 8px 10px;
  font-size: 14px;
  color: #444;
  cursor: default;
`;

const SuffixInput = styled.input`          
  flex: 1;
  border: 1px solid #b0bccb;
  border-left: none;
  border-radius: 0 6px 6px 0;
  padding: 8px 10px;
  font-size: 14px;
  color: #1f2a37;
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
  flex: 1;
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

const slideDown = keyframes`
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
`;

export const NotificationBanner = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #5c8bc4;
  color: white;
  padding: 14px 20px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 9999;
  animation: ${slideDown} 0.4s ease forwards;
  font-size: 14px;
`;

export const NotificationTitle = styled.div`
  flex: 1;
  white-space: nowrap;
`;

export const NotificationButton = styled.button`
  background-color: white;
  color: #5c8bc4;
  border: none;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
const PenaltyNotice = styled.div`
  color: red;
  font-size: 13px;
  white-space: nowrap;
  margin-left: 10px;

`;

const parseKoreanDate = (str) => {
  try {
    const parts = str.split(' '); // ['Thu', 'Jul', '31', '16:00:00', 'KST', '2025']
    const [weekday, monthStr, day, time, tz, year] = parts;
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [hour, minute, second] = time.split(':').map(Number);
    const month = months[monthStr];

    return new Date(Number(year), month, Number(day), hour, minute, second);
  } catch {
    return new Date(NaN); // fallback
  }
};



const DiscordPage = () => {

  const location = useLocation();
  const category = location.state?.category || '전체';   
  const matched = categories.find(c => c.category === category); 
  const subList = matched?.subCategories || [];  

  const [selectedDate, setSelectedDate] = useState(null);
  const [chatList, setChatList] = useState([]);       // 태그별 채팅 
  const [allMyChats, setAllMyChats] = useState([]);   // 전체 채팅(달력 제한용)
  const [showModal,setShowModal] =useState(false);
  const [selectedChat,setSelectedChat] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);   // 로드시 버튼 수
  const [isAtBottom, setIsAtBottom] = useState(true);    // 스크롤 위치 상태 저장
  // const [myUno, setMyUno] = useState(() => window.myUno);
  const [myUno, setMyUno] = useState(null);
  const [selectedSub, setSelectedSub] = useState(subList[0]?.name || '');
  const [titleSuffix, setTitleSuffix] = useState('');  
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [alertedCnos, setAlertedCnos] = useState(new Set());
  const [bannerChat, setBannerChat] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const [now,setNow] = useState(new Date());
  const [showVideoModal, setShowVideoModal] = useState(false);
  const {nickname} = useContext(AuthContext);

  const scrollRef = useRef(null);
  const prevChatListLength = useRef(0);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const refreshMySchedules = () => {
    fetch('http://localhost:9090/getUserChat', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(c => ({
          ...c,
          sch_date: new Date(c.sch_date),
        }));
        setAllMyChats(parsed.filter(c => c.leader === myUno || c.member));
      });
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000); // 30초마다 현재 시간 갱신

    return () => clearInterval(timer);
  }, []);

  // 세션 uno랑 leader랑 비교
  useEffect(() => {
    fetch('http://localhost:9090/getMyUno', { credentials: 'include' })
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

   useEffect(() => {
    if (subList.length > 0) setSelectedSub(subList[0].name);
    else setSelectedSub('');
  }, [category, subList]);


  const fetchChatList = () => {
     const url = category === '전체'
      ? '/getUserChat'
      : `/getUserChatByTag?r_tag=${encodeURIComponent(category)}`;
    fetch(url,{ credentials: 'include' })
      .then((res) => res.json())
      .then(data => {
        const parsed = data.map((chat) => ({
          ...chat,
          sch_date: new Date(chat.sch_date), // 문자열 → Date 객체로 변환
        }))
        .reverse();
        setChatList(parsed);
      })
      .catch(err => console.error('채팅 목록 불러오기 실패:', err));
  };
  useEffect(() => {
    fetchChatList(); 
  }, [category]);

  // 전체 일정 불러오기
   useEffect(() => {
    fetch('http://localhost:9090/getUserChat', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(c => ({
          ...c,
          sch_date: new Date(c.sch_date),
        }));
        setAllMyChats(parsed.filter(c => c.leader === myUno || c.member));
      })
      .catch(err => console.error('전체 내 일정 불러오기 실패:', err));
  }, [myUno]);

  // 패널티 일정 가져오기
  useEffect(() => {
    if (myUno === null) return;

    fetch('/getPenaltyStatus', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('패널티 조회 실패');

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          // console.warn("⚠️ 응답에 JSON이 없습니다.");
          return null; // 또는 적절한 fallback 객체
        }

        return res.json();
      })
      .then(data => {
        if (data) {
          console.log("🚨 패널티 정보:", data);
          setPenalty(data);
        }
      })
      .catch(err => console.error('패널티 fetch 에러:', err));
  }, [myUno]);

  const isBlocked = penalty?.count >= 3 && new Date(penalty.until) > new Date();

  //  패널티 until 시간으로 바꾸기
  const formattedUntil = useMemo(() => {
    if (!penalty?.until) return '';
    return new Date(penalty.until).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, [penalty]);


  // 처음 로드시 스크롤 맨 아래로
  useEffect(() => {
    const box = scrollRef.current;
    if (box && chatList.length > 0 ) {
      setTimeout(() => {
        box.scrollTop = box.scrollHeight;
      }, 0);
    }
  }, []); 


    //  스크롤 위로 → 더 과거 추가
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
    if ((isAtBottom || shouldScrollToBottom) && newMessagesAdded) {
        setTimeout(() => {
          box.scrollTop = box.scrollHeight;
        }, 0);
      if (shouldScrollToBottom) setShouldScrollToBottom(false);
    }
     prevChatListLength.current = chatList.length;
  }, [chatList, isAtBottom,shouldScrollToBottom]);
  const visibleChats = chatList.slice(-visibleCount);




  // 알람 useEffect
  useEffect(() => {
  const checkUpcoming = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const upcoming = allMyChats.filter(chat => {
      return (
        chat.sch_date > now &&
        chat.sch_date <= oneHourLater &&
        chat.member &&                       // 같이 할 사람 있을때만
        !alertedCnos.has(chat.cno)   
      );
    });

    if (upcoming.length > 0) {
      upcoming.forEach(chat => {
        setBannerChat(chat);
        setAlertedCnos(prev => {
          const newSet = new Set(prev);
          newSet.add(chat.cno);
          return newSet;
        });
      });
    }
  };

  checkUpcoming(); 

  const interval = setInterval(checkUpcoming, 60000);

  return () => clearInterval(interval);
}, [allMyChats, alertedCnos]);





  const handleCreateChat = () => {
    if (!selectedDate || !titleSuffix.trim()) {
    alert('제목과 날짜를 모두 입력하세요');
    return;
    }
    const payload = {
      r_title: `[${selectedSub}] ${titleSuffix}`,
      r_tag: category,
       sch_date: selectedDate.toISOString(),
      // sch_date: formatLocalDateTime(selectedDate),
      leader : myUno,
      r_regdate : ''
    };
    
     console.log('✅ 모집하기 payload:', payload);
    //   세션 만료되면 alert
      fetch('http://localhost:9090/insertUserChat', {
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
          setShouldScrollToBottom(true); // 스크롤 맨 아래로
          //이미 백에서 broadcast하고 있기 때문에 여기서 한번더 부를필요가 없음(2번 올라간것처럼 보이게됨)
          // if (socketRef.current?.readyState === WebSocket.OPEN) {
          //   socketRef.current.send(JSON.stringify(payload));
          // }  
        }
      })
      .catch(err => console.error('Insert 요청 에러:', err));


      setTitleSuffix('');
      setSelectedDate(null);

  refreshMySchedules();

};



const handleOnConfirm = () => {
  if (!selectedChat) return;
  if (!selectedChat || !selectedChat.cno) {
    console.error('❌ 참여하려는 chat이 잘못됨:', selectedChat);
    return;
  }

  fetch('http://localhost:9090/joinChat', {
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

    refreshMySchedules();
};

// 스케줄 조정
  const blockedIntervals = allMyChats.map(chat => ({
    start: new Date(chat.sch_date.getTime() - 60 * 60 * 1000),
    end:   new Date(chat.sch_date.getTime() + 60 * 60 * 1000),
  }));

const isConflict = (date) =>
  blockedIntervals.some(({ start, end }) =>
    date >= start && date <= end
);
const handleDateChange = (date)=>{
  if (isConflict(date)) {
      alert('⚠ 이미 일정이 있습니다. 해당 시간대를 선택할 수 없습니다.');
      return;
    }
  setSelectedDate(date);
}


// websocket 관련
useEffect(() => {

  if (myUno === null) return;

  const host = process.env.REACT_APP_HOST;
  const wsUrl = `ws://${host}:9090/ws/userChat2`;
  console.log('▶️ 웹소켓 연결 시도:', wsUrl);
  const socket = new WebSocket(wsUrl);
  socketRef.current = socket;

  socket.onopen = () => {
    console.log('✅ WebSocket 연결됨:', wsUrl);
  };
  
  socket.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log('📩 [WS 수신 원본 메시지]', message);

    // 삭제 메시지 처리
    if (message.type === 'delete') {
      console.log('🗑️ 삭제된 cno:', message.cno);
      setChatList(prev => prev.filter(chat => chat.cno !== message.cno));
      return;
    }

    // 일정 업데이트 메시지 처리
    if (message.type === 'schedule') {
      let schDate = parseKoreanDate(message.sch_date);
      if (isNaN(schDate)) {
        schDate = new Date(message.sch_date.replace(' ', 'T'));
      }
      if (isNaN(schDate)) {
        console.error('❌ 여전히 Invalid Date 발생:', message.sch_date);
        return;
      }

      const regDate = message.r_regdate
        ? new Date(message.r_regdate.replace(' ', 'T'))
        : new Date();

      setChatList(prev => {
        const withoutOld = prev.filter(chat => chat.cno !== message.cno);
        const updatedChatList = [...withoutOld, {
          ...message,
          sch_date: schDate,
          r_regdate: regDate,
        }];
        return updatedChatList.sort((a, b) => a.r_regdate - b.r_regdate);
      });
    }

  } catch (e) {
    console.error('⚠️ 메시지 파싱 실패:', e);
  }
};

  socket.onerror = (err) => {
    console.error('⚠️ WebSocket 오류:', err);
  };
  socket.onclose = (evt) => {
    console.log(`❌ WebSocket 연결 종료 (code=${evt.code}, reason=${evt.reason})`);
  };
  return () => {
    console.log('🛑 WebSocket 연결 닫음:', wsUrl);
    socket.close();
  };
}, [category, myUno]);  

  // 화상채팅 참여
  const handleJoin = () => {
      const handleJoin = () => {
        setShowVideoModal(true);
      };
  };


  
  return (
    
     <Wrapper>
      {bannerChat && (
        <NotificationBanner>
          <NotificationTitle>
            {bannerChat.r_title} |{' '}
            {bannerChat.sch_date.toLocaleDateString('ko-KR')} {bannerChat.sch_date.toLocaleTimeString('ko-KR')}
          </NotificationTitle>
          <NotificationButton onClick={() => setShowVideoModal(true)}>참여</NotificationButton>
          <NotificationButton onClick={() => setBannerChat(null)}>닫기</NotificationButton>
        </NotificationBanner>
      )}
      <Container>
        <Header>
          <Title>태그 : {category}</Title>
          <JoinButton onClick={handleJoin}>회의 참여</JoinButton>
        </Header>
        <ChatBox ref={scrollRef} onScroll={handleScroll}> {/* ✅ 스크롤 감지 */}
          {visibleChats.map((chat) => {
            const isMine = chat.leader === myUno;
            return (
              <ChatBubble key={chat.cno} $isMine={isMine}>
                {!isMine && <Avatar src="https://placehold.co/40x40" alt="avatar" />}
                {/* {!isMine && <div>{chat.leader_name}</div>} */}
                {!isMine && <div>{nickname}</div>}
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
                    {!isMine && (() => {
                      const timeDiff = chat.sch_date.getTime() - now.getTime();
                      const isPast = chat.sch_date < now;
                      const isWithinOneDay = timeDiff <= 24 * 60 * 60 * 1000;

                      if (isPast) {
                        return <span style={{ marginLeft: '10px', color: 'gray' }}>지난 일정입니다</span>;
                      } else if (isBlocked) {
                        return <span style={{ marginLeft: '10px', color: 'red' }}>패널티로 인해 참여가 불가능합니다</span>;
                      } else if (chat.member) {
                        return <span style={{ marginLeft: '10px', color: 'red' }}>인원이 꽉 찼습니다</span>;
                      } else if (isWithinOneDay) {
                        return <span style={{ marginLeft: '10px', color: 'gray' }}>모의면접 하루 전부터는 참여가 불가합니다</span>;
                      } else {
                        return (
                          <ActionButton
                            onClick={() => {
                              const nowReal = new Date(); // 💥 클릭 시점 기준으로 다시 검증
                              const diff = chat.sch_date.getTime() - nowReal.getTime();
                              
                              if (chat.sch_date < nowReal) {
                                alert('이미 지난 일정입니다. 참여할 수 없습니다.');
                                return;
                              }
                              if (diff <= 24 * 60 * 60 * 1000) {
                                alert('모의면접 하루 전부터는 참여가 불가능합니다.');
                                return;
                              }
                              if (isConflict(chat.sch_date)) {
                                alert('⚠ 이미 일정에 겹치는 시간대가 있습니다.\n해당 방에 참여할 수 없습니다.');
                                return;
                              }

                              setSelectedChat(chat);
                              setShowModal(true);
                            }}
                          >
                            참가
                          </ActionButton>
                        );
                      }
                    })()}
                  </MeetingInfo>
                </BubbleContainer>
              </ChatBubble>
            );
          })}
        </ChatBox>

        <InputSection>
         <InputRow>
            <select
              value={selectedSub}
              onChange={e => setSelectedSub(e.target.value)}
              /* ... 스타일 ... */
            >
              {subList.map(sub => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </InputRow>
           <TitleInputWrapper>                                          
            <PrefixInput
              readOnly
              value={`[${selectedSub}]`}                              
            />
            <SuffixInput
              placeholder="제목을 입력하세요"                            
              value={titleSuffix}                                      
              onChange={e => setTitleSuffix(e.target.value)}          
            />
          </TitleInputWrapper>  

          <DateRow>
            <StyledDatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              placeholderText="날짜 선택"
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))} // ✅ 한달 이내로 제한
              filterTime={(time) => {
                  const now = new Date();
                  const selectedDay = selectedDate || new Date();
                  const isToday = selectedDay.toDateString() === now.toDateString();

                  if (isToday) {
                      return time.getTime() >= now.getTime() &&
                          !blockedIntervals.some(({ start, end }) => time >= start && time <= end);
                  }
                  return !blockedIntervals.some(({ start, end }) => time >= start && time <= end);
              }}
              showTimeSelect
              timeIntervals={30}
              timeFormat="HH:mm"
              locale={ko}
              timeCaption="시간"
            />
              {isBlocked ? (
                <PenaltyNotice>
                  '{formattedUntil}'까지 모의면접 생성, 참여가 불가능합니다.
                </PenaltyNotice>
              ) : (
                <SendButton onClick={handleCreateChat}>모집하기</SendButton>
              )}
            
          </DateRow>
        </InputSection>

        {showModal && (
          <JoinInterviewModal
            onClose={() => setShowModal(false)}
            chat={selectedChat}
            onConfirm={handleOnConfirm}
          />
        )}
        {showVideoModal && (
          <VideoChatModal
            cno={bannerChat?.cno}
            scheduleTime={bannerChat?.sch_date}
            myUno={myUno}
            peerUno={
              bannerChat?.leader === myUno
                ? bannerChat?.member
                : bannerChat?.leader
            }
            onExit={() => setShowVideoModal(false)}
          />
        )}
      </Container>
    </Wrapper>
  );
};

export default DiscordPage;
