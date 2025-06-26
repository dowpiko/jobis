import React from 'react';
import styled from 'styled-components';

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
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

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

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 2px solid #4376B6;
  }

  span {
    font-size: 17px;
    font-weight: bold;
    color: #1F2A37;
  }
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
  transition: background-color 0.3s;

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
  transition: background-color 0.2s, color 0.2s;
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
  transition: color 0.2s;

  &:hover {
    color: #4376B6;
  }
`;

const FooterDivider = styled.span`
  color: #B0BCCB;
`;

const Side = () => {
  return (
    <Sidebar>
      <TopBar>
        <Logo>🌐Jobis</Logo>
        <ModeToggle>↔️</ModeToggle>
      </TopBar>

      <Profile>
        <ProfileInfo>
          <img src="https://via.placeholder.com/48" alt="profile" />
          <span>HamanJo</span>
        </ProfileInfo>
        <ProfileActions>
          <ProfileButton>마이페이지</ProfileButton>
          <ProfileButton>로그아웃</ProfileButton>
        </ProfileActions>
      </Profile>

      <Menu>
        <MenuItem>🏠 대시보드</MenuItem>
        <MenuItem>💬 채팅</MenuItem>
        <MenuItem>⚙️ 설정</MenuItem>
      </Menu>

      <Footer>
        <FooterLink href="#">개인정보처리방침</FooterLink>
        <FooterDivider>|</FooterDivider>
        <FooterLink href="#">이용약관</FooterLink>
      </Footer>
    </Sidebar>
  );
};

export default Side;
