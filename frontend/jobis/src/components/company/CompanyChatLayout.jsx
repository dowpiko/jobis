import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  font-family: sans-serif;
  background-color: #f8f9fa;
`;

const ChatListPanel = styled.div`
  flex: 1.3;  // 💡 대략 16% 비율에 맞게 조정
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
  width: 120px;
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
  const socketRef = useRef(null);
  const [myUno, setMyUno] = useState('');
  const navigate = useNavigate();
  
  const initChatLayout = async (uno) => {
    try {
      const res = await axios.get(`http://localhost:9090/sm/initCompanyChatLayout?cno=${uno}`);

      const processedData = res.data.map(item => ({
        ...item,
        name: item.name || '-',
      }));

      processedData.sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

      setChatList(processedData);
    } catch (err) {
      console.error(err);
    }
  };
  
  const filteredChatList = chatList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedChat?.rno || !myUno) return;

    const ws = new WebSocket('ws://localhost:9090/ws/userChat');
    socketRef.current = ws;

    const sendEnterRoom = () => {
      const payload = {
        type: 'ENTER_ROOM',
        uno: myUno,
        rno: selectedChat.rno,
      };
      ws.send(JSON.stringify(payload));
    };

    ws.onopen = () => {
      console.log('✅ WebSocket 연결됨');
      sendEnterRoom();
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'read_update') {
        const { uno: readerUno, rno: roomNo } = message;
        if (roomNo === selectedChat?.rno) {
          setChatMessages((prev) =>
            prev.map((msg) => {
              if (msg.sender === selectedChat.emp && msg.hit !== 1) {
                return { ...msg, hit: 1 };
              }
              return msg;
            })
          );
        }
      } else {
        setChatMessages((prev) => [...prev, message]);
      }
    };

    ws.onclose = () => {};
    ws.onerror = () => {};

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
        console.log('🧹 WebSocket 연결 정리됨');
      }
    };
  }, [selectedChat?.rno, myUno]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleChatCardClick = async (ono, emp) => {
    const newChatKey = `${ono}_${emp}`;

    if (activeChatKey === newChatKey) return;

    setShowAnnouncement(true);
    setActiveChatKey(newChatKey);

    try {
      const res = await axios.get(`http://localhost:9090/sm/selectOfferAndSubmission`, {
        params: { ono, emp, company: myUno },
      });
      setOfferSubmission(res.data);

      const { rno } = res.data;
      setSelectedChat({ ono, emp, company: myUno, rno });

      await fetchByRnoChatMessages(rno, myUno);
    } catch (err) {
      console.error('오류 발생:', err);
    }
  };

  const fetchByRnoChatMessages = async (rno, uno) => {
    try {
      const res = await axios.get(`http://localhost:9090/sm/selectByRnoChatMessages`, {
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
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !inputText.trim()) return;

    const payload = {
      rno: selectedChat?.rno,
      sender: selectedChat?.emp,
      content: inputText.trim(),
      leader: myUno,
    };
    socketRef.current.send(JSON.stringify(payload));
    axios.post('http://localhost:9090/sm/insertChatMessage', payload);

    setInputText('');
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

        {filteredChatList.map((item, index) => {
          const chatKey = `${item.ono}_${item.emp}`;
          const isSelected = chatKey === activeChatKey;

          return (
            <ChatCard
              key={index}
              selected={isSelected}
              onClick={() => handleChatCardClick(item.ono, item.emp)}
            >
              <Avatar src="https://via.placeholder.com/32" alt="avatar" />
              <div>{item.name}</div>
            </ChatCard>
          );
        })}
      </ChatListPanel>

      <ChatPanel>
        <ChatContent>
          {chatMessages.map((msg, idx) => {
            const isMine = msg.sender !== selectedChat?.company;
            
            return (
              <ChatMessageWrapper key={idx} isMine={isMine}>
                {isMine && msg.hit !== 1 && <ReadCount>1</ReadCount>}
                <ChatBubble isMine={isMine}>
                  <div style={{ fontSize: '13px' }}>{msg.content}</div>
                </ChatBubble>
              </ChatMessageWrapper>
            );
          })}
          <div ref={chatEndRef} />
        </ChatContent>
        <InputContainer>
          <Input
            type="text"
            placeholder="채팅을 입력하세요."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          />
          <Button onClick={sendMessage}>▶️</Button>
          <Button>🎤</Button>
          <Button>🔄</Button>
        </InputContainer>
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
          <div style={{ color: '#aaa', fontSize: '13px' }}>공고를 선택하세요</div>
        )}
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default CompanyChatLayout;
