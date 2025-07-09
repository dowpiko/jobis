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

function CompanySidebar({ children }) {
  const navigate = useNavigate();
  const [cName, setCName] = useState('');
  const [enpRpFnm, setEnpRpFnm] = useState('');

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
          <MenuItem onClick={() => navigate('/companyChat')}>💬 채팅</MenuItem>

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
