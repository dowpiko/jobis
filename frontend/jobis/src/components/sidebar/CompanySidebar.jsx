import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../img/SIMPLELOGO.png';
import { SocketContext } from '../../contexts/SocketContext';

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F7F9FC;
  color: #1E1E1E;
  font-family: 'Pretendard', sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #EFF4FF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  img {
    width: 120px;
    height: auto;
    cursor: pointer;
  }
`;

const Profile = styled.div`
  position: relative;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #E2E8F0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;  // 각 라인 간격
  font-size: 14px;
  color: #1F2A37;
`;

const ProfileLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1E1E1E;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ProfileButton = styled.button`
  background-color: #2563EB;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: #FFFFFF;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1E40AF;
  }
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 14px;
  border-radius: 10px;
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #2563EB;
    color: #FFFFFF;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6B7280;
`;

const FooterLink = styled.a`
  color: #6B7280;
  text-decoration: none;

  &:hover {
    color: #2563EB;
  }
`;

const FooterDivider = styled.span`
  color: #E2E8F0;
`;

const Main = styled.main`
  flex: 1;
  padding: 30px;
  background-color: #FFFFFF;
  overflow-y: auto;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -6px;
  right: ${(props) => 
    props.countLength === 1 ? '-5px' : 
    props.countLength === 2 ? '-10px' : 
    '-15px'
  }; 
  background-color: #e53935;
  color: white;
  padding: 1px 5px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
  line-height: 1.4;
  white-space: nowrap;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;


function CompanySidebar({ children }) {
  const navigate = useNavigate();
  const [cName, setCName] = useState('');
  const [enpRpFnm, setEnpRpFnm] = useState('');
  const { uno, logout } = useContext(AuthContext);
  const [dbCount, setDbCount] = useState(0);
  const location = useLocation(); 
  const socket = useContext(SocketContext);
  const display  = dbCount > 99 ? '99+' : dbCount.toString();
  const len = display.length; 

  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#1F2A37" viewBox="0 0 24 24">
      <path d="M12 24c1.104 0 2-.896 2-2h-4a2 2 0 002 2zm6.364-6V11c0-3.308-2.308-6.104-5.364-6.708V3a1 1 0 10-2 0v1.292C8.944 4.896 6.636 7.692 6.636 11v7L4 19v1h16v-1l-1.636-1zM18 20H6v-.382l1.636-1.636V11c0-2.757 2.243-5 5-5s5 2.243 5 5v6.982L18 19.618V20z"/>
    </svg>
  );

  const handleLogout = async () => {
    try {
      await axios.post('/jsh/logout');
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }
    logout();
    navigate('/');
  };

  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data) {
          axios.get(`/user/selectCinofoByUno?uno=${res.data.uno}`)
          .then(data => {
              if (data.data) {
                setCName(data.data.corpNm);
                setEnpRpFnm(data.data.enpRpFnm);
                setDbCount(data.data.count);

                if (socket && socket.readyState === WebSocket.OPEN && uno) {
                  socket.send(JSON.stringify({
                    type: 'ENTER_ROOM',
                    uno: uno,
                    rno: 0,
                  }));
                }
              }else {
                return;
              }
            })
        } else {
          alert('로그인이 필요합니다.');
          navigate('/');
        }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!socket) return;
      const handler = (evt) => {
      
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }
  
      if (msg.type === 'chat_notification' && msg.message.sender === uno || !msg) {
        setDbCount(c => c + 1);
        return;
      }
    };
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [socket, uno]);

  useEffect(() => {
    const reload = () => {
      axios.get(`/user/selectCinofoByUno?uno=${uno}`)
        .then(data => {
          if (data.data) {
            if (data.data.count === dbCount) {
              return;
            }else{
              setDbCount(data.data.count);
            }
          }
        })
        .catch(err => {console.error('🔔 알림 카운트 재로딩 실패', err);});
        };

        window.addEventListener('reloadSidebarCount', reload);
        return () => window.removeEventListener('reloadSidebarCount', reload);
  }, []);

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/companyMain')}>
            <img src={logo} alt="Jobis 로고" />
          </Logo>
        </TopBar>

        <Profile>
          <NotificationWrapper onClick={() => alert('알림 클릭!')}>
            <BellIcon />
            {dbCount > 0 && (
              <NotificationBadge countLength={len}>
                {display}
              </NotificationBadge>
            )}
          </NotificationWrapper>

          <ProfileInfo>
            <ProfileLine>
              <strong>기업명 :</strong> <span>{cName}</span>
            </ProfileLine>
            <ProfileLine>
              <strong>대표자명 :</strong> <span>{enpRpFnm}</span>
            </ProfileLine>
          </ProfileInfo>

          <ProfileActions>
            <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
          </ProfileActions>
        </Profile>

        <Menu>
          <MenuItem onClick={() => navigate('/companyMain')}>🏠 공고</MenuItem>
          <MenuItem onClick={() => navigate('/companyChatLayout')}>💬 채팅</MenuItem>

        </Menu>

        <Footer>
          <FooterLink href="#">개인정보처리방침</FooterLink>
          <FooterDivider>|</FooterDivider>
          <FooterLink href="#">이용약관</FooterLink>
        </Footer>
      </Sidebar>

      <Main>{children}</Main>
    </AppLayout>
  );
}

export default CompanySidebar;
