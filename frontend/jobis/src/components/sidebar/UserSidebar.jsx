import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/SIMPLELOGO.png';      // 🔹 로고 이미지
import toggleIcon from '../../img/ChangeIcon.png'; // 🔹 토글 이미지
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F8F9FA;
  color: #1E1E1E;
  font-family: 'Pretendard', 'Inter', sans-serif;
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
  button[data-scrap] {
   display: none;
  }
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

const ModeToggle = styled.button`
  width: 40px;
  height: 40px;
  background: url(${toggleIcon}) center center no-repeat;
  background-size: 30px 30px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(37, 99, 235, 0.1); // Primary hover
  }
`;

const Profile = styled.div`
  position: relative;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #E2E8F0;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #2563EB;
`;

const ProfileName = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
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
  color: #1E1E1E;
  text-align: center;

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
const ScrollContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; // 필수: flex-item 안에서 overflow 동작하게
`;

const MenuScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
  min-height: 0;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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

function UserSidebar({ children }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const { uno, logout } = useContext(AuthContext);
  const [dbCount, setDbCount] = useState(0);
  const location = useLocation();
  const socket = useContext(SocketContext);
  const display = dbCount > 99 ? '99+' : dbCount.toString();
  const len = display.length;  

  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#1F2A37" viewBox="0 0 24 24">
      <path d="M12 24c1.104 0 2-.896 2-2h-4a2 2 0 002 2zm6.364-6V11c0-3.308-2.308-6.104-5.364-6.708V3a1 1 0 10-2 0v1.292C8.944 4.896 6.636 7.692 6.636 11v7L4 19v1h16v-1l-1.636-1zM18 20H6v-.382l1.636-1.636V11c0-2.757 2.243-5 5-5s5 2.243 5 5v6.982L18 19.618V20z"/>
    </svg>
  );

  const handleProfile = async () => {
    try {
      const res = await axios.get('/jsh/checkProfile');
      navigate(res.data.exists ? '/scheduleManager' : '/createProfile');
    } catch (err) {
      console.error('프로필 확인 실패:', err);
      alert('세션이 만료되었거나 오류가 발생했습니다.');
      navigate('/');
    }
  };
  
  useEffect(() => {
    const reload = () => {
      axios.get(`/jsh/getUser?uno=${uno}`)
        .then(data => {
          console.log(data);
          if (data.data) setDbCount(data.data.count);
        })
        .catch(err => {console.error('🔔 알림 카운트 재로딩 실패', err);});
        };

        window.addEventListener('reloadSidebarCount', reload);
        return () => window.removeEventListener('reloadSidebarCount', reload);
  }, []);

  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data?.name) {
          setUserName(res.data.name);
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
 
      if (msg.type === 'chat_notification' && msg.message.sender === uno) {
        setDbCount(c => c + 1);
        return;
      }
    };
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [socket, uno]);

  const handleLogout = async () => {
    try {
      await axios.post('/jsh/logout');
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }
    logout();
    navigate('/');
  };

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/profile')}>
            <img src={logo} alt="Jobis 로고" />
          </Logo>
          <ModeToggle onClick={handleProfile} />
        </TopBar>

        <Profile>
          <ProfileInfo>
            <ProfileImg src="/img/user.svg" alt="profile" />
            <ProfileName>{userName}</ProfileName>
          </ProfileInfo>
          <NotificationWrapper onClick={() => alert('알림 클릭!')}>
            <BellIcon />
            {dbCount > 0 && (
              <NotificationBadge countLength={len}>
                {display}
              </NotificationBadge>
            )}
          </NotificationWrapper>
          <ProfileActions>
            <ProfileButton onClick={() => navigate('/graphPage')}>마이페이지</ProfileButton>
            <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
          </ProfileActions>
        </Profile>
        <ScrollContainer>
          <MenuScroll>
            <Menu>
              <MenuItem onClick={() => navigate('/aiInterview')}>🏠 AI모의 면접</MenuItem>
              <MenuItem onClick={() => navigate('/companyInfo')}>💬 기업 공고 정보</MenuItem>
              <MenuItem onClick={() => navigate('/scrapPage')}>⚙️ 스크랩/지원공고</MenuItem>
              <MenuItem onClick={() => navigate('/userChatLayout')}>💬 채팅</MenuItem>
            </Menu>
          </MenuScroll>

          <Footer>
            <FooterLink href="#">개인정보처리방침</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink href="#">이용약관</FooterLink>
          </Footer>
        </ScrollContainer>
      </Sidebar>

      <Main>{children}</Main>
    </AppLayout>
  );
}

export default UserSidebar;
