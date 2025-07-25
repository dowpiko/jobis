import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  min-width: 200px;
  padding: 10px;
  box-sizing: border-box;
  border-right: 1px solid #b0bccb;
  background-color: #f0f2f5;
`;

const PanelTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2a37;
  margin: 0;
`;

const ChatCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.selected ? '#e0e7ef' : '#f0f2f5')};
  border: 2px solid ${(props) => (props.selected ? '#4376B6' : '#b0bccb')};
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: ${(props) => (props.selected ? '0 0 8px rgba(67, 118, 182, 0.5)' : 'none')};

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
  width: 120px;
  height: 28px;
`;

const CorpName = styled.div`
  font-size: 15px;
  color: #1f2a37;
`;

const ChatMessageWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 4px;
  gap: 6px;
`;

const UserChatLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const chatEndRef = useRef(null);
    const [chatList, setChatList] = useState([]);
    const [offerSubmission, setOfferSubmission] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [rno, setRno] = useState(null);
    const [cno, setCno] = useState(null);
    const [inputText, setInputText] = useState('');
    const navigate = useNavigate();
    const [initCheck, setInitCheck] = useState(true);

    const socket = useContext(SocketContext);
    const { hasManuallyLoggedIn, uno: myUno } = useContext(AuthContext);

    // 1) 로그인 직후 한 번만: 내 채팅방 목록 불러오기
    useEffect(() => {
      if (!hasManuallyLoggedIn || !myUno) {
        navigate('/');
        return;
      }
      axios.get(`http://localhost:9090/chat/initUserChatLayout?uno=${myUno}`)
        .then(res => setChatList(res.data))
        .catch(err => {
          console.error('채팅방 목록 조회 실패', err);
          alert('채팅방을 불러오는 중 오류가 발생했습니다.');
        });
    }, [hasManuallyLoggedIn, myUno]);

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
          setChatMessages(prev => [...prev, msg]);
        }
      };
      console.log('🛰️ WS raw data:', chatMessages);

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

      try {
        const resOffer = await axios.get('http://localhost:9090/offers/selectOfferAndSubmission', {
          params: { ono, emp: myUno, company }
        });
        setOfferSubmission(resOffer.data);

        const resMsgs = await axios.get('http://localhost:9090/chat/selectByRnoChatMessages', {
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
      const hit = chatMessages.at(-1).hit;
      const payload = { rno, sender: cno, content: inputText.trim(), leader: myUno, hit : hit};
      socket.send(JSON.stringify(payload));
      axios.post('http://localhost:9090/chat/insertChatMessage', payload).catch(console.error);
      setInputText('');
    };

    // 리스트 필터링
    const filteredChatList = chatList.filter(item =>
      item.corpNm?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    const renderChatMessages = () =>
  chatMessages
    // chat_notification 타입은 아예 걸러내기
    .filter(msg => msg.type !== 'chat_notification')
    .map((msg, i) => {
      const isMine = msg.sender !== myUno;
      return (
        <ChatMessageWrapper key={i} isMine={isMine}>
          {isMine && msg.hit !== 1 && (
            <div style={{ fontSize: '10px', color: '#888', marginRight: 6 }}>
              1
            </div>
          )}
          <ChatBubble isMine={isMine}>
            <div style={{ fontSize: '13px' }}>{msg.content}</div>
          </ChatBubble>
        </ChatMessageWrapper>
      );
    });

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
              <Avatar src="https://via.placeholder.com/32" alt="avatar" />
              <CorpName>{item.corpNm}</CorpName>
            </ChatCard>
          ))}
        </ChatListPanel>

        <ChatPanel>
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
              <div style={{ color:'#aaa', fontSize:'13px' }}>채팅방을 선택하세요</div>
            )}
          </AnnouncementContent>
        </AnnouncementPanel>
      </Wrapper>
    );
  }

export default UserChatLayout;