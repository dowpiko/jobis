import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import DatePicker from 'react-datepicker'; // 날짜 선택
import { ko } from 'date-fns/locale';    // 달력 한글로 만들기
import 'react-datepicker/dist/react-datepicker.css';
import JoinInterviewModal from '../modal/JoinInterviewModal';
import PenaltyInfoModal from '../modal/PenaltyInfoModal';
import { useLocation } from 'react-router-dom';
import categories from '../../data/categories';  
import VideoChatModal from './VideoChatModal';
import axios from 'axios';


const Nickname = styled.div`
  font-size: 14px;
  color: #0b0c0cff;
  margin-bottom: 4px;
  font-weight: bold;  
`;

const InfoNotice = styled.p`
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 8px;
  margin-top: 4px;
`;

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
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  width: 100%;
`;

const TagAndInputGroup = styled.div`
  display: flex;
  height: 44px;
  flex: 1;
`;

const TagSelect = styled.select`
  width: 100px;
  padding: 0 10px;
  border: 1px solid #b0bccb;
  border-right: none;
  border-radius: 6px 0 0 6px;
  background-color: #e6f0ff;
  color: #1f3a93;
  font-weight: bold;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1f3a93;
  }
`;

const SuffixInput = styled.input`
  flex: 1;
  border: 1px solid #b0bccb;
  border-left: none;
  border-radius: 0 6px 6px 0;
  padding: 0 12px;
  font-size: 14px;
  color: #1f2a37;
`;

const StyledDatePicker = styled(DatePicker).withConfig({
  shouldForwardProp: (prop) => !['blur'].includes(prop),
})`
  height: 44px;
  padding: 0 12px;
  font-size: 14px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
  flex: 1;
  min-width: 160px;
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
  padding: 0 8px;
`;

const Avatar = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  margin: 15px 8px 10px 4px;

`;

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isMine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
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

const SendButton = styled.button`
  height: 44px;
  padding: 0 14px;
  background-color: #5c8bc4;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: #4673a9;
  }
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
const BlurOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #1F2A37;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const host = process.env.REACT_APP_HOST;
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
  const [myUno, setMyUno] = useState(null);
  const [selectedSub, setSelectedSub] = useState(subList[0]?.name || '');
  const [titleSuffix, setTitleSuffix] = useState('');  
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [alertedCnos, setAlertedCnos] = useState(new Set());
  const [bannerChat, setBannerChat] = useState(null);
  const [penalty, setPenalty] = useState(null);
  const [now,setNow] = useState(new Date());
  const [showVideoModal, setShowVideoModal] = useState(false);
  const hasProfile = localStorage.getItem('hasProfile') === 'true';
  const [photoNum,setPhotoNum] = useState({});
  const [nicknameMap, setNicknameMap] = useState({});
  const [showPenaltyInfo, setShowPenaltyInfo] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  const scrollRef = useRef(null);
  const prevChatListLength = useRef(0);
  const socketRef = useRef(null);


  const refreshMySchedules = async () => {
    try {
      const res = await axios.get(`http://${host}:9090/chat/getUserChat`, {
        withCredentials: true,
      });

      const parsed = res.data.map(c => ({
        ...c,
        sch_date: new Date(c.sch_date),
      }));

      setAllMyChats(parsed.filter(c => c.leader === myUno || c.member));
    } catch (err) {
      console.error('❌ 내 일정 새로고침 실패:', err);
    }
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30000); // 30초마다 현재 시간 갱신

    return () => clearInterval(timer);
  }, []);

  // 세션 uno랑 leader랑 비교
  useEffect(() => {
    axios.get(`http://${host}:9090/user/getMyUno`, { withCredentials: true })
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setMyUno(res.data);
        }
      })
      .catch(err => {
        if (err.response?.status === 401) {
          alert('로그인 상태가 아닙니다.');
          window.location.href = '/';
        } else {
          console.error('세션 uno 가져오기 실패:', err);
        }
      });
    }, []);

  useEffect(() => {
    if (subList.length > 0) setSelectedSub(subList[0].name);
    else setSelectedSub('');
  }, [category, subList]);

  useEffect(() => {
    setVisibleCount(9);  
  }, [filterDate]);

  


  const fetchChatList = async () => {
    const url = category === '전체'
      ? `http://${host}:9090/chat/getUserChat`
      : `http://${host}:9090/chat/getUserChatByTag?r_tag=${encodeURIComponent(category)}`;

    try {
      const res = await axios.get(url, { withCredentials: true });

      const parsed = res.data.map(chat => ({
        ...chat,
        sch_date: new Date(chat.sch_date),
      })).reverse();

      setChatList(parsed);
    } catch (err) {
      console.error('채팅 목록 불러오기 실패:', err);
    }
  };

  // 전체 일정 불러오기
  useEffect(() => {
    if (!myUno) return;

    axios.get(`http://${host}:9090/chat/getUserChat`, {
      withCredentials: true
    })
    .then(res => {
      const parsed = res.data.map(c => ({
        ...c,
        sch_date: new Date(c.sch_date),
      }));
      setAllMyChats(parsed.filter(c => c.leader === myUno || c.member));
    })
    .catch(err => {
      console.error('전체 내 일정 불러오기 실패:', err);
    });
  }, [myUno]);

  // 패널티 일정 가져오기
  useEffect(() => {
    if (myUno === null) return;

    axios.get(`http://${host}:9090/chat/getPenaltyStatus`, {withCredentials: true})
    .then(res => {
      if (res.headers['content-type']?.includes('application/json')) {
        console.log("🚨 패널티 정보:", res.data);
        setPenalty(res.data);
      } else {
        console.warn("⚠️ 응답에 JSON이 없습니다.");
      }
    })
    .catch(err => {
      console.error('패널티 axios 에러:', err);
    });
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
  // const visibleChats = chatList.slice(-visibleCount);
  // 날짜별 필터링
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

  const filteredChats = useMemo(() => {
    if (!filterDate) return chatList;

    return chatList.filter(chat => {
      const c = chat.sch_date;
      return (
        c.getFullYear() === filterDate.getFullYear() &&
        c.getMonth() === filterDate.getMonth() &&
        c.getDate() === filterDate.getDate()
      );
    });
  }, [chatList, filterDate]);

  const visibleChats = filteredChats.slice(-visibleCount);

  // 알람 useEffect
  useEffect(() => {
    const checkUpcoming = () => {
      const now = new Date();

      const upcoming = allMyChats.filter(chat => {
        if (!chat.member) return false;

        const start = new Date(chat.sch_date.getTime() - 30 * 60 * 1000); // 30분 전
        const end = new Date(chat.sch_date.getTime() + 60 * 60 * 1000);  // 1시간 후

        return now >= start && now <= end && !alertedCnos.has(chat.cno);
      });

  if (upcoming.length > 0) {
    upcoming.forEach(chat => {
      console.log("📢 알림 띄움:", chat.r_title, chat.sch_date.toLocaleString());
      setBannerChat(chat);
      setAlertedCnos(prev => {
        const newSet = new Set(prev);
        newSet.add(chat.cno);
        return newSet;
      });
    });
  } else if (
    bannerChat &&
    (now < new Date(bannerChat.sch_date.getTime() - 30 * 60 * 1000) ||
    now > new Date(bannerChat.sch_date.getTime() + 60 * 60 * 1000))
  ) {
    console.log('🔕 알림 닫힘 (시간 벗어남)');
    setBannerChat(null);
  }

    };

    checkUpcoming();

    const interval = setInterval(checkUpcoming, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [allMyChats, alertedCnos]);

  useEffect(() => {
    console.log('👁 bannerChat changed:', bannerChat);
  }, [bannerChat]);


  
  const handleCreateChat = async () => {
    if (!selectedDate || !titleSuffix.trim()) {
      alert('제목과 날짜를 모두 입력하세요');
      return;
    }

    const payload = {
      r_title: `[${selectedSub}] ${titleSuffix}`,
      r_tag: category,
      sch_date: selectedDate.toISOString(),
      leader: myUno,
      r_regdate: ''
    };

    try {
      const res = await axios.post(
        `http://${host}:9090/chat/insertUserChat`,
        payload,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data === 'success') {
        fetchChatList();
        setVisibleCount(9); // 다시 9개부터 시작
        setShouldScrollToBottom(true); // 스크롤 맨 아래로
        // WebSocket 중복 방지 주석 유지
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주시기 바랍니다.');
        window.location.href = '/';
      } else {
        console.error('Insert 요청 에러:', err);
      }
    }

    setTitleSuffix('');
    setSelectedDate(null);
    refreshMySchedules();
  };

  const handleOnConfirm = async () => {
    if (!selectedChat || !selectedChat.cno) {
      console.error('❌ 참여하려는 chat이 잘못됨:', selectedChat);
      return;
    }

    try {
      const res = await axios.post(
        `http://${host}:9090/chat/joinChat`,
        { cno: selectedChat.cno },
        {
          withCredentials: true,
          headers: {
            'Accept': 'text/plain;charset=UTF-8',
            'Content-Type': 'application/json',
          },
          responseType: 'text', // 중요: 응답을 텍스트로 받기
        }
      );

      const text = res.data;
      if (text === '참여 완료') {
        alert('성공적으로 참여했습니다!');
        setShowModal(false);
        fetchChatList(); // 채팅 목록 갱신
      } else {
        alert(`참여에 실패했습니다: ${text}`);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/';
      } else {
        console.error('참여 요청 실패:', err);
        alert('서버 오류가 발생했습니다.');
      }
    }

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

      if (message.type === 'delete') {
        console.log('🗑️ 삭제된 cno:', message.cno);
        setChatList(prev => prev.filter(chat => chat.cno !== message.cno));
        return;
      }

      if (message.type === 'schedule') {
        let schDate = parseKoreanDate(message.sch_date);
        if (isNaN(schDate)) {
          schDate = new Date(message.sch_date.replace(' ', 'T'));
        }
        setSelectedDate(schDate);
      }

    } catch (err) {
      console.error('📛 WebSocket 메시지 파싱 오류:', err);
    }
  };

  return () => {
    socket.close();
    console.log('🛑 WebSocket 연결 종료');
  };
}, [myUno]);



  // websocket 관련
  useEffect(() => {

    if (myUno === null) return;

    
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
        refreshMySchedules();
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


  // 사진 
  const fetchLeaderProfile = useCallback(async (uno) => {
    if (photoNum[uno]) return;

    try {
      const res = await axios.get(
        `http://${host}:9090/user/getProfileImageByUno`,
        {
          params: { uno },
          withCredentials: true
        }
      );

      const data = res.data;
      if (data.success && data.profileImageUrl) {
        setPhotoNum(prev => ({ ...prev, [uno]: data.profileImageUrl }));
        setNicknameMap(prev => ({ ...prev, [uno]: data.nickname }));
      }
    } catch (e) {
      console.error('❌ 프로필 이미지 axios 요청 실패:', e);
    }
  }, [photoNum]);

  useEffect(() => {
    visibleChats.forEach(chat => {
      if (chat.leader && !photoNum[chat.leader]) {
        fetchLeaderProfile(chat.leader);
      }
    });
  }, [visibleChats, fetchLeaderProfile, photoNum]);

  
  useEffect(() => {
    fetchChatList();
  }, [category]);

  return (  
    
     <Wrapper>
    {bannerChat && (
      <NotificationBanner>
        <NotificationTitle>
          {bannerChat.r_title} |{' '}
          {bannerChat.sch_date.toLocaleDateString('ko-KR')} {bannerChat.sch_date.toLocaleTimeString('ko-KR')}
        </NotificationTitle>
        <NotificationButton onClick={() => setShowVideoModal(true)}>참여</NotificationButton>
      </NotificationBanner>
    )}
      {!hasProfile && (
        <BlurOverlay>
          ⚠️ 먼저 프로필을 생성해야 면접 일정에 참여할 수 있습니다.
        </BlurOverlay>
      )}
      <Container>
        <Header>
          <Title>태그 : {category}</Title>
          
          <FilterRow>
            <StyledDatePicker
              selected={filterDate}
              onChange={date => setFilterDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="일정 날짜로 필터링"
              isClearable
              locale={ko}
            />
          </FilterRow>
        </Header>


        <ChatBox ref={scrollRef} onScroll={handleScroll}> {/* ✅ 스크롤 감지 */}
          {filterDate && visibleChats.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
              📭 해당 날짜에는 모집중인 모의 면접 일정이 없습니다
            </div>
          )}
          {visibleChats.map((chat) => {
            const isMine = chat.leader === myUno;
            return (
              <ChatBubble key={chat.cno} $isMine={isMine}>
                  {!isMine && (
                   <Avatar src={photoNum[chat.leader] || '/img/user.svg'} alt="avatar" />
                  )}
                <BubbleContainer $isMine={isMine}>
                      {!isMine && (
                        <Nickname>{nicknameMap[chat.leader] || '알 수 없음'}</Nickname>
                      )}
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
                      const isWithinSixHours  = timeDiff <= 6 * 60 * 60 * 1000;

                      if (isPast) {
                        return <span style={{ marginLeft: '10px', color: 'gray' }}>지난 일정입니다</span>;
                      } else if (isBlocked) {
                        return <span style={{ marginLeft: '10px', color: 'red' }}>패널티로 인해 참여가 불가능합니다</span>;
                      } else if (chat.member) {
                        return <span style={{ marginLeft: '10px', color: 'red' }}>인원이 꽉 찼습니다</span>;
                      } else if (isWithinSixHours) {
                        return <span style={{ marginLeft: '10px', color: 'gray' }}>모의면접 하루 전부터는 참여가 불가합니다</span>;
                      }else if (isConflict(chat.sch_date)) {
                          return <span style={{ marginLeft: '10px', color: 'gray' }}>
                            ⚠ 다른 일정과 시간이 겹칩니다
                          </span>;
                        } else {
                                return (
                              <ActionButton
                                onClick={() => {
                                  const nowReal = new Date(); // 2중으로 막아버리기
                                  const diff = chat.sch_date.getTime() - nowReal.getTime();
                                  
                                  if (chat.sch_date < nowReal) {
                                    alert('이미 지난 일정입니다. 참여할 수 없습니다.');
                                    return;
                                  }
                                  if (diff <= 6 * 60 * 60 * 1000) {
                                    alert('모의면접 6시간 전부터는 참여가 불가능합니다.');
                                    return;
                                  }
                                  if (isConflict(chat.sch_date)) {
                                    alert('⚠ 이미 일정에 겹치는 시간대가 있습니다.\n해당 방에 참여할 수 없습니다.');
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
          <TitleInputWrapper>
          <TagAndInputGroup>
            <TagSelect
              value={selectedSub}
              onChange={e => setSelectedSub(e.target.value)}
            >
              {subList.map(sub => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </TagSelect>

            <SuffixInput
              placeholder="제목을 입력하세요"
              value={titleSuffix}
              onChange={e => setTitleSuffix(e.target.value)}
            />
          </TagAndInputGroup>

          <StyledDatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            placeholderText="날짜 선택"
            dateFormat="yyyy-MM-dd HH:mm"
            minDate={new Date()}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
            filterTime={(time) => {
              const now = new Date();
              const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
              const isAfterSixHours = time.getTime() >= sixHoursLater.getTime();
              const isNotConflicting = !blockedIntervals.some(({ start, end }) => time >= start && time <= end);
              return isAfterSixHours && isNotConflicting;
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
        </TitleInputWrapper>

          <InfoNotice>
            ※ 모의 면접 일정의 생성은 지금부터 <strong>6시간 이후</strong>의 시간만 가능합니다.<br />
            또한 상대가 있는 24시간 이내의 일정을 취소할 시{' '}
            <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowPenaltyInfo(true)}>
              패널티
            </strong>
            가 부여됩니다.
          </InfoNotice>
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

        {showPenaltyInfo && (
          <PenaltyInfoModal penalty={penalty} onClose={() => setShowPenaltyInfo(false)} />
        )}
      </Container>
    </Wrapper>
  );
};

export default DiscordPage;
