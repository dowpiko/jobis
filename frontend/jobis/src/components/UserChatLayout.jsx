import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SocketContext } from '../contexts/SocketContext';
import { AuthContext }   from '../contexts/AuthContext';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  font-family: sans-serif;
  background-color: #f8f9fa;
`;

const ChatListPanel = styled.div`
  flex: 1.3;
  min-width: 300px;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #b0bccb;
  background-color: rgb(239, 244, 255)

  display: flex;
  flex-direction: column;
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
  background-color: ${(props) => (props.selected ? '#e0e7ef' : '#rgb(239, 244, 255)')};
  border: 2px solid ${(props) => (props.selected ? '#808080ff' : '#cdd6e2ff')};
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #d4eaf4;
  }
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
  flex: 2.2;
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

const CorpName = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #1f2a37;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 8px;
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

const Avatar = styled.img`
  margin-right: 8px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
`;
const host = process.env.REACT_APP_HOST;

const UserChatLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [chatList, setChatList] = useState([]);
    const [offerSubmission, setOfferSubmission] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [rno, setRno] = useState(null);
    const [cno, setCno] = useState(null);
    const [inputText, setInputText] = useState('');
    const [initCheck, setInitCheck] = useState(true);
    const [isChatSelected, setIsChatSelected] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const socket = useContext(SocketContext);
    const { hasManuallyLoggedIn, uno: myUno } = useContext(AuthContext);

    // 1) 로그인 직후 한 번만: 내 채팅방 목록 불러오기
    useEffect(() => {
      if (!hasManuallyLoggedIn || !myUno) {
        navigate('/');
        return;
      }
      axios.get(`http://${host}:9090/chat/initUserChatLayout?uno=${myUno}`)
        .then(res => setChatList(res.data))
        .catch(err => {
          console.error('채팅방 목록 조회 실패', err);
          alert('채팅방을 불러오는 중 오류가 발생했습니다.');
        });
    }, [hasManuallyLoggedIn, myUno]);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const initialRno = parseInt(params.get('rno'));
      if (initialRno && chatList.length > 0) {
        const room = chatList.find(c => c.rno === initialRno);
        if (room) {
          handleChatCardClick(room.rno, room.ono, room.company);
        }
      }
    }, [location.search, chatList]);
    
    // 2) 선택된 방(rno) 변경 시 한 번만 ENTER_ROOM 보내기
    useEffect(() => {
      if (!socket || !myUno || !rno) return;
      socket.send(JSON.stringify({ type: 'ENTER_ROOM', uno: myUno, rno }));
    }, [socket, myUno, rno]);

    // 3) 전역 소켓 메시지 리스너
    useEffect(() => {
      if (!socket) return;

      const handler = event => {
        const msg = JSON.parse(event.data);
        if (msg.type === 'read_update') {
          setChatMessages(prev =>
            prev.map(m =>
              m.sender === msg.uno && m.rno === msg.rno && m.hit !== 1
              ? { ...m, hit: 1 }
              : m
            )
          );
        } else {
          const enrichedMessage = {
            ...msg,
            cl_regdate: msg.cl_regdate || Date.now(), // 시간 없으면 지금 시간으로
          };
          setChatMessages(prev => [...prev, enrichedMessage]);
        }
      };

      socket.addEventListener('message', handler);
      return () => socket.removeEventListener('message', handler);
    }, [socket]);

    // 4) 메시지 도착 시 스크롤
    useEffect(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, [chatMessages]);

    // 채팅방 선택
    const handleChatCardClick = async (rno, ono, company) => {
      setOfferSubmission(null);
      setChatMessages([]);
      setRno(rno);
      setCno(company);
      setInitCheck(false);
      setInputText('');
      setIsChatSelected(true);

      try {
        const resOffer = await axios.get(`http://${host}:9090/offers/selectOfferAndSubmission`, {
          params: { ono, emp: myUno, company }
        });
        setOfferSubmission(resOffer.data);

        const resMsgs = await axios.get(`http://${host}:9090/chat/selectByRnoChatMessages`, {
          params: { rno, uno: myUno }
        });
        setChatMessages(resMsgs.data);
      } catch (err) {
        console.error('데이터 조회 오류', err);
        alert('데이터 조회 중 오류가 발생했습니다.');
      }
      
      window.dispatchEvent(new Event('reloadSidebarCount'));
    };

    // 메시지 전송
    const sendMessage = () => {
      if (!socket || socket.readyState !== WebSocket.OPEN || !inputText.trim()) return;
      const lastMessage = chatMessages.at(-1);
      const hit = lastMessage ? lastMessage.hit : 0;
      const payload = { rno, sender: cno, content: inputText.trim(), leader: myUno, hit : hit};

      socket.send(JSON.stringify(payload));
      axios.post(`http://${host}:9090/chat/insertChatMessage`, payload).catch(console.error);
      setInputText('');
    };

    // 리스트 필터링
    const filteredChatList = chatList.filter(item =>
      item.corpNm?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = dayNames[date.getDay()];
      return `${month}월 ${day}일 ${weekday}`;
    };

    // Q&A 렌더 헬퍼
    const renderQnA = () => {
      if (!offerSubmission) return null;
      const qs = offerSubmission.o_content?.split('\n') || [];
      const as = offerSubmission.user_content?.split('\n') || [];
      return qs.map((q, i) => (
        <QAItem key={i}>
          <QuestionText>Q{i+1}. {q}</QuestionText>
          <AnswerText>A{i+1}. {as[i] || '-'}</AnswerText>
        </QAItem>
      ));
    };

    // 채팅 메시지 렌더 헬퍼
    const renderChatMessages = () => {
      let lastDate = null;

      return chatMessages
        .filter(msg => msg.type !== 'chat_notification')
        .map((msg, i) => {
          const isMine = msg.sender !== myUno;
          const currentDateLabel = getDateLabel(msg.cl_regdate);

          const showDateDivider = lastDate !== currentDateLabel;
          lastDate = currentDateLabel;

          return (
            <React.Fragment key={i}>
              {showDateDivider && (
                <DateDivider>{currentDateLabel}</DateDivider>
              )}

              <ChatMessageWrapper isMine={isMine}>
                {isMine && msg.hit !== 1 && (
                  <div style={{ fontSize: '10px', color: '#888', marginRight: 6 }}>1</div>
                )}
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
    };
    return (
      <Wrapper>
        <ChatListPanel>
          <PanelHeader>
            <PanelTitle>채팅</PanelTitle>
            <SearchInput
              type="text"
              placeholder="회사명 검색"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </PanelHeader>
          {filteredChatList.map((item, idx) => (
            <ChatCard
              key={idx}
              selected={item.rno === rno}
              onClick={() => handleChatCardClick(item.rno, item.ono, item.company)}
            >
              <Avatar src={`/profile/usercustom/${item.company}.png`} alt="avatar" />
              <CorpName>{item.corpNm}</CorpName>
            </ChatCard>
          ))}
        </ChatListPanel>

        <ChatPanel>
          {isChatSelected ? (
            <>
              <ChatContent>
                {renderChatMessages()}
                <div ref={chatEndRef} />
              </ChatContent>
              <InputContainer>
                <Input
                  type="text"
                  placeholder="메시지를 입력하세요"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && sendMessage()}
                  readOnly = {initCheck}
                />
                <Button onClick={sendMessage}>▶️</Button>
              </InputContainer>
            </>
            ) : (
            <EmptyState>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>💬</div>
              <div>채팅방을 선택해 대화를 시작하세요!</div>
              <div>💡 왼쪽에서 연락을 준 회사들의 목록을 확인해 보세요.</div>
            </EmptyState>
          )}
        </ChatPanel>

        <AnnouncementPanel>
          <AnnouncementContent>
            {offerSubmission ? (
              <>
                <InfoRow><strong>{offerSubmission.o_title}</strong></InfoRow>
                <InfoRow><strong>{offerSubmission.o_tag}</strong></InfoRow>
                <InfoRow><strong>지원일:</strong> {new Date(offerSubmission.user_regdate).toLocaleDateString()}</InfoRow>
                <QAWrapper>{renderQnA()}</QAWrapper>
              </>
            ) : (
              ''
            )}
          </AnnouncementContent>
        </AnnouncementPanel>
      </Wrapper>
    );
  }

export default UserChatLayout;