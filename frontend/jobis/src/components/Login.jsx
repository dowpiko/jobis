import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import FindPwModal from './modal/FindPwModal';
import ResetPwModal from './modal/ResetPwModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initKakao } from 'kakao-js-sdk';
import NaverIcon from '../img/btn_Naver.png';
import KakaoIcon from '../img/btn_Kakao.png';
import GoogleIcon from '../img/btn_Google.png';
import logo from '../img/SIMPLELOGO.png'; // 🔹 로고 이미지 import
import { AuthContext } from '../contexts/AuthContext';

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ $blur }) => ($blur ? 'rgba(247,249,252,0.6)' : '#F1F5F9')};
  backdrop-filter: ${({ $blur }) => ($blur ? 'blur(6px)' : 'none')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;   // ✅ 중앙 정렬 → 위로 정렬
  padding-top: 80px;             // ✅ 위쪽 여백만 줌 (원하는 값으로 조절)
  pointer-events: ${({ $blur }) => ($blur ? 'none' : 'all')};
  font-family: 'Pretendard', 'Inter', sans-serif;
`;

const Header = styled.div`
  margin-bottom: 0px;
  width: 100%;
  text-align: center;
  img {
    width: 280px;
    height: auto;
  }
`;

const LoginBox = styled.div`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 40px 32px;
  width: 380px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

const ToggleTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  font-size: 15px;
  font-weight: 600;
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#3B4F7A' : 'transparent')};
  color: ${({ $active }) => ($active ? '#3B4F7A' : '#6B7280')};
  cursor: pointer;

  &:hover {
    color: #2C3E66;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #1E293B;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  text-align: left;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 15px;
  background-color: #F3F4F6;
  color: #1E293B;
  box-sizing: border-box;

  &:focus {
    border-color: #3B4F7A;
    background-color: #fff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #3B4F7A;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2C3E66;
  }
`;

const Options = styled.div`
  margin-top: 18px;
  font-size: 13px;
  color: #6B7280;
  text-align: center;

  span {
    margin: 0 10px;
    cursor: pointer;

    &:hover {
      color: #3B4F7A;
      text-decoration: underline;
    }
  }
`;

const SocialLoginIconButton = styled.button`
  width: 52px;
  height: 52px;
  margin: 0 10px;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: contain;
    image-rendering: auto;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

const SocialIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  height: 60px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transition: opacity 0.3s ease;
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [modalStep, setModalStep] = useState(null);
  const [isPersonal, setIsPersonal] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    initKakao(process.env.REACT_APP_KAKAO_JS_KEY)
      .then()
      .catch(console.error);
  }, []);

  const signUpPage = () => navigate('/signUp');

  const handleUserLogin = async () => {
    if(pw==="kakao"|| pw==="naver"||pw==="google"){
      alert("소셜 로그인을 이용해 주세요");
      return;
    }
    try {
      const res = await axios.post('/jsh/login', { id, pw });

      if (res.data.success) {
        login(res.data);
        const userType = res.data.userType;
        if ((isPersonal && userType !== 'user') || (!isPersonal && userType !== 'company')) {
          alert('선택한 로그인 유형과 계정 유형이 일치하지 않습니다.');
          return;
        }
        navigate(userType === 'user' ? '/profile' : '/companyMain');
      } else {
        alert(res.data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(process.env.REACT_APP_NAVER_REDIRECT_URI);
    const STATE = Math.random().toString(36).substring(2);
    const naverAuthUrl =
      `https://nid.naver.com/oauth2.0/authorize?response_type=code` +
      `&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;
    window.location.href = naverAuthUrl;
  };

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_JS_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

const handleGoogleLogin = () => {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = encodeURIComponent(process.env.REACT_APP_GOOGLE_REDIRECT_URI);
  const SCOPE = encodeURIComponent('openid email profile');  // ✅ 꼭 이렇게!
  const RESPONSE_TYPE = 'code';

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}` +
    `&response_type=${RESPONSE_TYPE}&scope=${SCOPE}` +
    `&access_type=offline&prompt=consent`; // 👈 이 옵션도 추천 (refresh_token 받기 위함)

  window.location.href = googleAuthUrl;
};


  return (
    <>
      <Wrapper $blur={modalStep !== null}>
        <Header>
          <img src={logo} alt="Jobis 로고" style={{ width: '280px', marginBottom: '12px' }} />
        </Header>
        <LoginBox>
          <ToggleTabs>
            <Tab $active={isPersonal} onClick={() => setIsPersonal(true)}>👤 개인</Tab>
            <Tab $active={!isPersonal} onClick={() => setIsPersonal(false)}>🏢 기업</Tab>
          </ToggleTabs>

          <Title>login</Title>

          <FormGroup>
            <Label htmlFor="userId">ID :</Label>
            <Input
              type="text"
              id="userId"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="userPw">PW :</Label>
            <Input
              type="password"
              id="userPw"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </FormGroup>

          <Button onClick={handleUserLogin}>
            {isPersonal ? 'user login' : 'company login'}
          </Button>

          <Options>
            <span onClick={() => setModalStep('id')}>ID/PW 찾기</span> |
            <span onClick={signUpPage}>회원가입</span>
          </Options>

          <SocialIconContainer $visible={isPersonal}>
            <SocialLoginIconButton onClick={handleNaverLogin}>
              <img src={NaverIcon} alt="네이버" />
            </SocialLoginIconButton>
            <SocialLoginIconButton onClick={handleKakaoLogin}>
              <img src={KakaoIcon} alt="카카오" />
            </SocialLoginIconButton>
            <SocialLoginIconButton onClick={handleGoogleLogin}>
              <img src={GoogleIcon} alt="구글" />
            </SocialLoginIconButton>
          </SocialIconContainer>
        </LoginBox>
      </Wrapper>

      {modalStep === 'id' && (
        <FindPwModal onClose={() => setModalStep(null)} onSubmit={() => setModalStep('resetPw')} />
      )}
      {modalStep === 'resetPw' && (
        <ResetPwModal onClose={() => setModalStep(null)} userId={id} />
      )}
    </>
  );
};

export default Login;
