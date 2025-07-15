import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  const [myUno, setMyUno] = useState('');
  const [chatList, setChatList] = useState([]);
  const [offerSubmission, setOfferSubmission] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [inputText, setInputText] = useState('');
  const [rno, setRno] = useState('');
  const [cno, setCno] = useState('');
  const rnoRef = useRef(null);

  useEffect(() => {
    rnoRef.current = rno;
  }, [rno]);

  useEffect(() => {
    userCheck();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  const userCheck = () => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data) {
          setMyUno(res.data.uno);
          initUserChatLayout(res.data.uno).then(data => setChatList(data));
        }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });
  };

  const initUserChatLayout = (uno) => {
    return axios.get(`http://localhost:9090/sm/initUserChatLayout?uno=${uno}`)
      .then(res => res.data)
      .catch(err => {
        console.error('❌ 채팅방 목록 조회 실패:', err);
        alert('채팅방을 불러오는 중 오류가 발생했습니다.');
        return [];
      });
  };

  const fetchByRnoChatMessages = async (rno) => {
    try {
      const res = await axios.get(`http://localhost:9090/sm/selectByRnoChatMessages`, {
        params: { rno ,
          uno : myUno
        }
      });
      setChatMessages(res.data);
    } catch (err) {
      console.error('채팅 목록 조회 오류:', err);
    }
  };

  const handleChatCardClick = async (rno, ono, company) => {
    try {
      const res = await axios.get('http://localhost:9090/sm/selectOfferAndSubmission', {
        params: { ono, emp: myUno, company }
      });

      setOfferSubmission(res.data);
      setRno(rno);
      setCno(company);
      await fetchByRnoChatMessages(rno);

      const sendEnterRoom = () => {
        const payload = {
          type: "ENTER_ROOM",
          uno: myUno,
          rno: rno
        };
        socketRef.current.send(JSON.stringify(payload));
      };

      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        const ws = new WebSocket('ws://localhost:9090/ws/userChat');

        ws.onopen = () => {
          console.log('✅ WebSocket 연결됨');
          sendEnterRoom();
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setChatMessages(prev => [...prev, message]);
        };

        ws.onclose = () => console.log('❌ WebSocket 닫힘');
        ws.onerror = (err) => console.error('⚠ WebSocket 오류:', err);

        socketRef.current = ws;
      } else {
        sendEnterRoom();
      }

    } catch (err) {
      console.error('오류 발생:', err);
      alert('데이터 조회 중 오류가 발생했습니다.');
    }
  };


  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const filteredChatList = chatList.filter(item =>
    item.corpNm && item.corpNm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !inputText.trim()) return;

    const payload = {
      rno: rno,
      sender: cno,
      content: inputText.trim(),
      leader : myUno,
    };
    socketRef.current.send(JSON.stringify(payload));
    axios.post('http://localhost:9090/sm/insertChatMessage', payload);

    setInputText('');
  };

  const renderQnA = () => {
    if (!offerSubmission) return null;

    const questions = offerSubmission.o_content ? offerSubmission.o_content.split('\n') : [];
    const answers = offerSubmission.user_content ? offerSubmission.user_content.split('\n') : [];

    return questions.map((q, idx) => (
      <QAItem key={idx}>
        <QuestionText>Q{idx + 1}. {q}</QuestionText>
        <AnswerText>A{idx + 1}. {answers[idx] || '-'}</AnswerText>
      </QAItem>
    ));
  };

  const renderChatMessages = () => {
    return chatMessages.map((msg, idx) => {
      const isMine = msg.sender !== myUno;  // ✅ 내가 보낸 메시지 확인 (=== 로 변경)

      return (
        <ChatMessageWrapper key={idx} isMine={isMine}>
          {isMine ? (
            <>
              {/* ✅ 내가 보낸 메시지의 왼쪽에 읽음 여부 표시 */}
              <div style={{ fontSize: '10px', color: '#888', marginRight: '6px', whiteSpace: 'nowrap' }}>
                {msg.hit !== 1 ? '' : '1'}
              </div>
              <ChatBubble isMine={true}>
                <div style={{ fontSize: '13px' }}>{msg.content}</div>
              </ChatBubble>
            </>
          ) : (
            <>
              <ChatBubble isMine={false}>
                <div style={{ fontSize: '13px' }}>{msg.content}</div>
              </ChatBubble>
            </>
          )}
        </ChatMessageWrapper>
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
            placeholder="이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </PanelHeader>

        {filteredChatList.map((item, index) => (
          <ChatCard key={index} onClick={() => handleChatCardClick(item.rno, item.ono, item.company)}>
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
        <AnnouncementContent>
          {offerSubmission ? (
            <>
              <InfoRow><strong>{offerSubmission.o_title}</strong></InfoRow>
              <InfoRow><strong>{offerSubmission.o_tag}</strong></InfoRow>
              <InfoRow><strong>지원일:</strong> {formatDate(offerSubmission.user_regdate)}</InfoRow>

              <QAWrapper>
                {renderQnA()}
              </QAWrapper>
            </>
          ) : (
            <div style={{ color: '#aaa', fontSize: '13px' }}>공고를 선택하세요</div>
          )}
        </AnnouncementContent>
      </AnnouncementPanel>
    </Wrapper>
  );
};

export default UserChatLayout;