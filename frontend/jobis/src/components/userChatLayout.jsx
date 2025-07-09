import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  border-right: 1px solid #b0bccb;
  background-color: #f0f2f5;
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
  &:hover {
    background-color: #c6d8ec;
  }
`;

const AnnouncementPanel = styled.div`
  flex: 2.2;
  padding: 16px;
  background-color: #f0f2f5;
  overflow-y: auto;
`;

const UserChatLayout = () => {
  const [chatList, setChatList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data) {
          setUserInfo(res.data);
          initChatList(res.data.uno);
        } else {
          alert('로그인이 필요합니다.');
          navigate('/');
        }
      })
      .catch(() => {
        alert('세션 오류');
        navigate('/');
      });
  }, []);

  const initChatList = async (uno) => {
    try {
      const res = await axios.get(`http://localhost:9090/sm/userChatList?uno=${uno}`);
      setChatList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChatCardClick = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await axios.get(`http://localhost:9090/sm/userChatMessages?chatId=${chatId}`);
      setChatMessages(res.data);

      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        const ws = new WebSocket('ws://localhost:9090/ws/userChat');
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setChatMessages(prev => [...prev, message]);
        };
        socketRef.current = ws;
      }

    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = () => {
    if (!socketRef.current || !inputText.trim()) return;
    const payload = { chatId: selectedChat, sender: userInfo.uno, content: inputText.trim() };
    socketRef.current.send(JSON.stringify(payload));
    axios.post('http://localhost:9090/sm/insertUserChatMessage', payload);
    setInputText('');
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  return (
    <Wrapper>
      <ChatListPanel>
        {chatList.map((chat, idx) => (
          <ChatCard key={idx} selected={selectedChat === chat.chatId} onClick={() => handleChatCardClick(chat.chatId)}>
            <div>{chat.companyName || '-'}</div>
          </ChatCard>
        ))}
      </ChatListPanel>

      <ChatPanel>
        <ChatContent>
          {chatMessages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.sender === userInfo.uno ? 'flex-end' : 'flex-start', background: msg.sender === userInfo.uno ? '#d1e7dd' : '#e2e3e5', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px' }}>{msg.content}</div>
          ))}
          <div ref={chatEndRef} />
        </ChatContent>

        <InputContainer>
          <Input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }} placeholder="채팅을 입력하세요." />
          <Button onClick={sendMessage}>▶️</Button>
        </InputContainer>
      </ChatPanel>

      <AnnouncementPanel>
        {selectedChat ? <div style={{ fontSize: '13px', color: '#374151' }}>공고 내용 표시 영역</div> : <div style={{ color: '#aaa', fontSize: '13px' }}>채팅방을 선택하세요</div>}
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default UserChatLayout;
