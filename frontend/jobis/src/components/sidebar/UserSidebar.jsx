import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const ModeToggle = styled.button`
  width: 40px;
  height: 40px;
  background-color: #4376B6;
  border: none;
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const Profile = styled.div`
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
  align-items: center;
  gap: 16px;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #4376B6;
`;

const ProfileName = styled.span`
  font-size: 17px;
  font-weight: bold;
  color: #1F2A37;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileButton = styled.button`
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  color: #FFFFFF;
  font-size: 13px;
  cursor: pointer;

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

function UserSidebar({ children }) {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/profile')}>🌐Jobis</Logo>
          <ModeToggle onClick={() => navigate('/scheduleManager')}>↔️</ModeToggle>
        </TopBar>

        <Profile>
          <ProfileInfo>
            <ProfileImg src="https://via.placeholder.com/48" alt="profile" />
            <ProfileName>HamanJo</ProfileName>
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
