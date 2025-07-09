import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F8F9FA;
  color: #1F2A37;
  font-family: sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #DCE3EA;
  border-right: 1px solid #B0BCCB;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 12px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
`;

const Logo = styled.div`
  font-size: 24px;
  color: #1F2A37;
  cursor: pointer;
`;

const Profile = styled.div`
  position: relative;          // 👉 추가
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #B0BCCB;
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
  gap: 10px;           // "기업명 :" 과 값 사이 간격
  white-space: nowrap;  // 줄바꿈 방지
  font-size: 14px;
`;

const ProfileName = styled.span`
  font-size: 17px;
  font-weight: bold;
  color: #1F2A37;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;   // 👉 오른쪽 정렬
`;

const ProfileButton = styled.button`
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: #FFFFFF;
  font-size: 13px;
  cursor: pointer;
  margin-top: 6px;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #B0BCCB;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 18px 14px;
  border-radius: 8px;
  background-color: #FFFFFF;
  border: 1px solid #B0BCCB;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: #1F2A37;

  &:hover {
    background-color: #5C8BC4;
    color: #FFFFFF;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #B0BCCB;
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
  padding: 2px 4px;

  &:hover {
    color: #4376B6;
  }
`;

const FooterDivider = styled.span`
  color: #B0BCCB;
`;

const Main = styled.main`
  flex: 1;
  padding: 30px;
  background-color: #FFFFFF;
  overflow-y: auto;
  border-left: 1px solid #B0BCCB;
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
  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#1F2A37" viewBox="0 0 24 24">
      <path d="M12 24c1.104 0 2-.896 2-2h-4a2 2 0 002 2zm6.364-6V11c0-3.308-2.308-6.104-5.364-6.708V3a1 1 0 10-2 0v1.292C8.944 4.896 6.636 7.692 6.636 11v7L4 19v1h16v-1l-1.636-1zM18 20H6v-.382l1.636-1.636V11c0-2.757 2.243-5 5-5s5 2.243 5 5v6.982L18 19.618V20z"/>
    </svg>
  );
  const notificationCount = 900;
  const displayNotificationCount = notificationCount > 99 ? '99+' : notificationCount.toString();
  const countLength = displayNotificationCount.length;  

  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data) {
          axios.get(`sm/selectCinofoByUno?uno=${res.data.uno}`)
            .then(data => {
              if (data.data) {
                setCName(data.data.corpNm)
                setEnpRpFnm(data.data.enpRpFnm)
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
  }, [navigate]);

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/companyMain')}>🌐Jobis</Logo>
        </TopBar>

        <Profile>
          <NotificationWrapper onClick={() => alert('알림 클릭!')}>
            <BellIcon />
            {notificationCount > 0 && (
              <NotificationBadge countLength={countLength}>
                {displayNotificationCount}
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
            <ProfileButton onClick={() => navigate('/')}>로그아웃</ProfileButton>
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
