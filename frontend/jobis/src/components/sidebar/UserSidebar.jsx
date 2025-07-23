import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/SIMPLELOGO.png';      // 🔹 로고 이미지
import toggleIcon from '../../img/ChangeIcon.png'; // 🔹 토글 이미지
import { AuthContext } from '../../contexts/AuthContext';
import { SocketContext } from '../../contexts/SocketContext';
import SubscribeModal from '../subscribe/SubscribeModal';

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
  position: relative;  // ✅ 여기!
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
const CrownIcon = styled.img`
  position: absolute;
  top: -35px;
  left: 16px;
  width: 60px;
  height: 60px;
  z-index: 5;
`;

const MenuGroup = styled.div`
  position: relative;
`;

const SubMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;       // ✅ 아이템 중앙 정렬
  gap: 8px;
  overflow: hidden;
  margin-top: 6px;
  transition: all 0.3s ease;

  max-height: 200px;
  opacity: 1;
  transform: translateY(0);

  &.hidden {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
    pointer-events: none;
  }
`;


const SubMenuItem = styled(MenuItem)`
  width: 85%;
  font-size: 13px;
  padding: 12px 10px;
  background-color: #f9fafb;
  margin: 0 auto;

  &:hover {
    background-color: #2563EB;  // ✅ 상위 메뉴와 동일한 색상
    color: #FFFFFF;             // ✅ 상위 메뉴와 동일한 글자색
  }
`;

const PremiumMiniTag = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  text-align: left;
  margin-top: -12px;        // ✅ 공백 제거
  margin-left: 4px;
  padding: 0;           // ✅ 패딩도 없음
  line-height: 1;       // ✅ 라인 간격 최소화
`;
const SubscriptionInfoPanel = styled.div`
  margin-top: 10px;
  background: #f1f5f9;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  animation: slideDown 0.3s ease forwards;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  color: #6b7280;
  font-size: 13px;
`;

const DateText = styled.span`
  color: #1e293b;
  font-weight: 500;
  font-size: 14px;
`;

const PayButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 6px 10px;
  font-size: 13px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-end; // ❗️ 요 한 줄 추가
  margin-left: auto;    // 🔥 핵심: 오른쪽으로 밀기

  &:hover {
    background-color: #1d4ed8;
  }
`;

const PayButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;



const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

function UserSidebar({ children }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const { uno, logout } = useContext(AuthContext);
  const [dbCount, setDbCount] = useState(0);
  const [subscribeUntil, setSubscribeUntil] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [subscribeUpdated, setSubscribeUpdated] = useState(false);
  const [showSubInfoPanel, setShowSubInfoPanel] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
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
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data?.name) {
          console.log('✅ 로그인된 사용자 정보:', res.data);
          setUserName(res.data.name);
          setDbCount(res.data.count);
          if (res.data.subscribe === 1 && res.data.subscribeDate) {
            const now = Date.now();
            const subscribeDate = Number(res.data.subscribeDate);
            if (subscribeDate >= now) {
              setIsPremium(true);
              setSubscribeUntil(subscribeDate);
            }
          }
          if (socket && socket.readyState === WebSocket.OPEN && uno) {
            socket.send(JSON.stringify({
              type: 'ENTER_ROOM',
              uno: uno,
              rno: 0,
            }));
          }
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
    const reload = () => {
      axios.get(`/jsh/getUser?uno=${uno}`)
        .then(data => {
          if (data.data) setDbCount(data.data.count);
        })
        .catch(err => {console.error('🔔 알림 카운트 재로딩 실패', err);});
        };

        window.addEventListener('reloadSidebarCount', reload);
        return () => window.removeEventListener('reloadSidebarCount', reload);
  }, []);
  useEffect(() => {
    if (subscribeUpdated) {
      navigate(0);  // 🔄 새로고침
    }
  }, [subscribeUpdated]);
  const handleSubscribed = () => {
    setShowSubInfoPanel(false);
    setSubscribeUpdated(true);  // ✅ 상태 변경만
  };
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
          {isPremium && <CrownIcon src="/img/crown.png" alt="프리미엄 왕관" />}

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
          {isPremium && <PremiumMiniTag>Premium</PremiumMiniTag>}
          <ProfileActions>
            {isPremium ? (
              <ProfileButton onClick={() => setShowSubInfoPanel(prev => !prev)}>구독 정보</ProfileButton>
            ) : (
              <ProfileButton onClick={() => setShowSubscribeModal(true)}>구독</ProfileButton>
            )}
            <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
          </ProfileActions>
          {showSubInfoPanel && (
            <SubscriptionInfoPanel>
              <InfoRow>
                <Label>구독 만료일</Label>
                <DateText>{subscribeUntil ? formatDate(subscribeUntil) : '없음'}</DateText>
              </InfoRow>
              <PayButtonWrapper>
                <PayButton onClick={() => setShowSubscribeModal(true)}>결제</PayButton>
              </PayButtonWrapper>
            </SubscriptionInfoPanel>
          )}
        </Profile>

        <ScrollContainer>
          <MenuScroll>
            <Menu>
              <MenuGroup
                onMouseEnter={() => setShowSubMenu(true)}
                onMouseLeave={() => setShowSubMenu(false)}
              >
                <MenuItem>🏠 AI 모의 면접</MenuItem>
                <SubMenuContainer className={showSubMenu ? '' : 'hidden'}>
                  <SubMenuItem onClick={() => navigate('/aiInterview')}>AI 면접하기</SubMenuItem>
                  <SubMenuItem onClick={() => navigate('/graphPage')}>면접 결과 분석</SubMenuItem>
                </SubMenuContainer>
              </MenuGroup>
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
      {showSubscribeModal && (
        <SubscribeModal
          uno={uno}
          onClose={() => setShowSubscribeModal(false)}
          onSubscribed={handleSubscribed}
        />
      )}
    </AppLayout>
  );
}

export default UserSidebar;
