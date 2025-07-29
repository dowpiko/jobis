import axios from 'axios';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SocketContext } from '../../contexts/SocketContext';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 99%;
  font-family: sans-serif;
  background-color: #f8f9fa;
  border: 1px solid #afafb0ff;
  border-radius: 6px;
`;

const ChatListPanel = styled.div`
  flex: 1.3;
  min-width: 300px;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #b0bccb;
  background-color: #f0f2f5;

  display: flex;
  flex-direction: column;
`;

const ChatCardsContainer = styled.div`
  flex: 1;               /* 남은 공간 모두 차지 */
  overflow-y: auto;      /* 이 영역만 스크롤 */
  margin-top: 10px;      /* 헤더/필터와 간격 */
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 3px;
  }
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2a37;
  margin: 0 0 0 20px;
`;

const ChatCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.selected ? '#e0e7ef' : '#f0f2f5')};
  border: 2px solid ${(props) => (props.selected ? '#4376B6' : '#b0bccb')};
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: ${(props) => (props.selected ? '0 0 8px rgba(67, 118, 182, 0.5)' : 'none')};

  &:hover {
    background-color: #d4eaf4;
  }
`;

const Avatar = styled.img`
  margin-right: 8px;
  width: 38px;
  height: 38px;
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
  display: flex;
  flex-direction: column;
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
  flex: 2.2;  // 💡 기존보다 넓히기 (회색 여백 없애기)
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
  margin-bottom: 20px;
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

const ChatBubble = styled.div`
  max-width: 60%;
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 12px;
  word-break: break-word;
  background-color: ${(props) => (props.isMine ? '#d1e7dd' : '#e2e3e5')};
  align-self: ${(props) => (props.isMine ? 'flex-start' : 'flex-end')};
  border-top-left-radius: ${(props) => (props.isMine ? '0' : '12px')};
  border-top-right-radius: ${(props) => (props.isMine ? '12px' : '0')};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  padding: 5px 10px;
  font-size: 12px;
  border: 1px solid #b0bccb;
  border-radius: 4px;
  outline: none;
  width: 180px;
  height: 28px;
`;

const ChatMessageWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 4px;
  gap: 6px;
`;

const ReadCount = styled.div`
  font-size: 10px;
  color: #888;
  white-space: nowrap;
`;

const JobFilterSelect = styled.select`
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid #b0bccb;
  outline: none;
  background-color: #fff;
  margin-bottom: 10px;

  option {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #666;
  text-align: ${(props) => (props.isMine ? 'left' : 'right')};
  margin-top: 4px;
  padding: 0 2px;
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 16px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ccc;
    margin: 0 8px;
  }
`;

const ChatName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #1f2a37;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 20px;
  padding: 20px;
  text-align: center;
`;

const CompanyChatLayout = () => {
  const [chatList, setChatList] = useState([]);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [offerSubmission, setOfferSubmission] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const [activeChatKey, setActiveChatKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatSelected, setIsChatSelected] = useState(false);
  const socket = useContext(SocketContext);
  const [myUno, setMyUno] = useState('');
  const [initCheck, setInitCheck] = useState(true);
  const [interviewList, setInterviewList] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [searchParams] = useSearchParams();
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  const initChatLayout = async (uno) => {
    try {
      const res = await axios.get(`http://${host}:9090/chat/initCompanyChatLayout?cno=${uno}`);

      const processedData = res.data.map(item => ({
        ...item,
        name: item.name || '-',
      }));

      processedData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));
      setChatList(processedData);

      const uniqueJobs = Array.from(
        new Map(processedData.map(item => [item.ono, item])).values()
      );
      const onoList = uniqueJobs.map(job => job.ono);

      const responses = await Promise.all(
        onoList.map(ono =>
          axios.get(`http://${host}:9090/offers/oneInterViewByOno`, {
            params: { ono }
          })
        )
      );

      setInterviewList(responses.map(res => res.data));
    } catch (err) {
      console.error(err);
    }
  };
  
  const filteredChatList = chatList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedJobFilter === '' || item.ono === parseInt(selectedJobFilter))
  );

  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data){
          setMyUno(res.data.uno);
          initChatLayout(res.data.uno);
        }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });
  }, [navigate]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [chatMessages]);

  useEffect(() => {
    const urlRno = searchParams.get('rno');
    if (!urlRno || !myUno || chatList.length === 0) return;

    const matched = chatList.find(chat => chat.rno === parseInt(urlRno));
    if (matched) {
      handleChatCardClick(matched.ono, matched.emp);
    }
  }, [chatList, myUno, searchParams]);

  useEffect(() => {
    if (
      !selectedChat?.rno ||
      !myUno ||
      !socket ||
      socket.readyState !== WebSocket.OPEN
    )
      return;

    socket.send(
      JSON.stringify({
        type: 'ENTER_ROOM',
        uno: myUno,
        rno: selectedChat.rno,
      })
    );
  }, [selectedChat?.rno, myUno, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'read_update') {
        const { uno: readerUno, rno: roomNo } = message;
        if (roomNo === selectedChat?.rno) {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.sender === selectedChat.emp && msg.hit !== 1
                ? { ...msg, hit: 1 }
                : msg
            )
          );
        }
      } else {
        const enrichedMessage = {
          ...message,
          cl_regdate: message.cl_regdate || Date.now(), // 시간 없으면 지금 시간으로
        };
        setChatMessages((prev) => [...prev, enrichedMessage]);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, selectedChat?.rno, selectedChat?.emp]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleChatCardClick = async (ono, emp) => {
    const newChatKey = `${ono}_${emp}`;
    setInitCheck(false);

    if (activeChatKey === newChatKey) return;

    setShowAnnouncement(true);
    setActiveChatKey(newChatKey);
    setIsChatSelected(true);

    try {
      const res = await axios.get(`http://${host}:9090/offers/selectOfferAndSubmission`, {
        params: { ono, emp, company: myUno },
      });
      setOfferSubmission(res.data);

      const { rno } = res.data;
      setSelectedChat({ ono, emp, company: myUno, rno });

      await fetchByRnoChatMessages(rno, myUno);
    } catch (err) {
      console.error('오류 발생:', err);
    }
    
    window.dispatchEvent(new Event('reloadSidebarCount'));
  };

  const fetchByRnoChatMessages = async (rno, uno) => {
    try {
      const res = await axios.get(`http://${host}:9090/chat/selectByRnoChatMessages`, {
        params: { rno ,
          uno : uno
        }
      });
      setChatMessages(res.data);
    } catch (err) {
      console.error('채팅 목록 조회 오류:', err);
    }
  };

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !inputText.trim()) return;
    const lastMessage = chatMessages.at(-1);
    const hit = lastMessage ? lastMessage.hit : 0;

    const payload = {
      rno:      selectedChat?.rno,
      sender:   selectedChat?.emp,
      content:  inputText.trim(),
      leader:   myUno,
      hit: hit,
    };
    socket.send(JSON.stringify(payload));
    axios.post(`http://${host}:9090/chat/insertChatMessage`, payload);

    setInputText('');
  };

  const truncate = (text, length = 16) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;
    return `${ampm} ${hours}:${String(minutes).padStart(2, '0')}`;
  };
  
  const getDateLabel = (timestamp) => {
    const date = new Date(timestamp);
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = dayNames[date.getDay()];
    return `${month}월 ${day}일 ${weekday}`;
  };
  
  return (
    <Wrapper>
      <ChatListPanel>
        <PanelHeader>
          <PanelTitle>채팅</PanelTitle>
          <SearchInput
            type="text"
            placeholder="이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </PanelHeader>

         <JobFilterSelect value={selectedJobFilter} onChange={(e) => setSelectedJobFilter(e.target.value)}>
          <option value="">전체 공고 보기</option>
          {interviewList.map((job) => (
            <option
              key={job.ono}
              value={job.ono}
              title={job.o_title}  // 마우스 오버 시 전체 제목
            >
              {truncate(job.o_title)} ({formatDate(job.o_activedays)})
            </option>
          ))}
        </JobFilterSelect>

        <ChatCardsContainer>
          {filteredChatList.map((item, index) => {
            const chatKey = `${item.ono}_${item.emp}`;
            const isSelected = chatKey === activeChatKey;
            return (
              <ChatCard
                key={index}
                selected={isSelected}
                onClick={() => handleChatCardClick(item.ono, item.emp)}
              >
                <Avatar src={`/profile/${item.emp}.png`} alt="avatar" />
                <ChatName title={item.name}>{item.name}</ChatName>
              </ChatCard>
            );
          })}
        </ChatCardsContainer>
      </ChatListPanel>

      <ChatPanel>
        {isChatSelected ? (
          <>
        <ChatContent>
          {(() => {
            let lastDate = null;
            return chatMessages
              .filter(msg => msg.type !== 'chat_notification')
              .map((msg, idx) => {
                const isMine = msg.sender !== selectedChat?.company;
                const currentDateLabel = getDateLabel(msg.cl_regdate);
                const showDateDivider = lastDate !== currentDateLabel;
                lastDate = currentDateLabel;

                return (
                  <React.Fragment key={idx}>
                    {showDateDivider && <DateDivider>{currentDateLabel}</DateDivider>}
                    <ChatMessageWrapper isMine={isMine}>
                      {isMine && msg.hit !== 1 && <ReadCount>1</ReadCount>}
                      {isMine ? (
                        <>
                          <MessageTime isMine={isMine}>{formatTime(msg.cl_regdate)}</MessageTime>
                          <ChatBubble isMine={isMine}>
                            <div style={{ fontSize: '13px', marginBottom: '4px' }}>{msg.content}</div>
                          </ChatBubble>
                        </>
                      ) : (
                        <>
                          <ChatBubble isMine={isMine}>
                            <div style={{ fontSize: '13px', marginBottom: '4px' }}>{msg.content}</div>
                          </ChatBubble>
                          <MessageTime isMine={isMine}>{formatTime(msg.cl_regdate)}</MessageTime>
                        </>
                      )}
                    </ChatMessageWrapper>
                  </React.Fragment>
                );
              });
          })()}
          <div ref={chatEndRef} />
        </ChatContent>
        <InputContainer>
          <Input
            type="text"
            placeholder="채팅을 입력하세요."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            readOnly = {initCheck}
          />
          <Button onClick={sendMessage}>▶️</Button>
          <Button>🎤</Button>
          <Button>🔄</Button>
        </InputContainer>
        </>
        ) : (
          <EmptyState>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>💬</div>
            <div>채팅방을 선택해 대화를 시작하세요!</div>
            <div>💡 왼쪽에서 지원자 목록을 클릭해 보세요.</div>
          </EmptyState>
        )}
      </ChatPanel>

      <AnnouncementPanel>
        {showAnnouncement && offerSubmission ? (
          <AnnouncementContent>
            <InfoRow><strong>{offerSubmission.o_title}</strong></InfoRow>
            <InfoRow><strong>{offerSubmission.o_tag}</strong></InfoRow>
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
          ''
        )}
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default CompanyChatLayout;
