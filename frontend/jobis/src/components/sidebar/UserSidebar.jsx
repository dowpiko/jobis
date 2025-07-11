import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../img/SIMPLELOGO.png';      // 🔹 로고 이미지
import toggleIcon from '../../img/ChangeIcon.png'; // 🔹 토글 이미지

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

function UserSidebar({ children }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

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
  }, [navigate]);

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
          <ProfileActions>
            <ProfileButton onClick={() => navigate('/graphPage')}>마이페이지</ProfileButton>
            <ProfileButton onClick={() => navigate('/')}>로그아웃</ProfileButton>
          </ProfileActions>
        </Profile>

        <Menu>
          <MenuItem onClick={() => navigate('/aiInterview')}>🏠 AI모의 면접</MenuItem>
          <MenuItem onClick={() => navigate('/companyInfo')}>💬 기업 공고 정보</MenuItem>
          <MenuItem onClick={() => navigate('/scrapPage')}>⚙️ 스크랩/지원공고</MenuItem>
          <MenuItem onClick={() => navigate('/userChatLayout')}>💬 채팅</MenuItem>
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

export default UserSidebar;
