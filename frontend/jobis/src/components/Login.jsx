import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FindPwModal from './modal/FindPwModal';
import ResetPwModal from './modal/ResetPwModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initKakao } from 'kakao-js-sdk';
import NaverIcon from '../img/btn_Naver.png';
import KakaoIcon from '../img/btn_Kakao.png';
import GoogleIcon from '../img/btn_Google.png';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #F8F9FA;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ blur }) => (blur ? 'rgba(255,255,255,0.4)' : 'transparent')};
  backdrop-filter: ${({ blur }) => (blur ? 'blur(4px)' : 'none')};
  transition: backdrop-filter 0.2s ease;
  pointer-events: ${({ blur }) => (blur ? 'none' : 'all')};
`;

const LoginBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #B0BCCB;
  border-radius: 8px;
  padding: 40px 50px;
  width: 360px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  text-align: center;
  pointer-events: all;
`;

const ToggleTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  font-size: 15px;
  font-weight: bold;
  background: none;
  border: none;
  margin: 0 10px;
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 3px solid ${({ active }) => (active ? '#4376B6' : 'transparent')};
  color: ${({ active }) => (active ? '#4376B6' : '#6B7280')};
  transition: all 0.3s;

  &:hover {
    color: #4376B6;
  }
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-size: 24px;
  color: #1F2A37;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
  text-align: left;
`;

const Label = styled.label`
  display: inline-block;
  width: 60px;
  font-weight: bold;
  font-size: 16px;
  color: #1F2A37;
`;

const Input = styled.input`
  width: 350px;
  padding: 8px;
  font-size: 15px;
  border: 1px solid #B0BCCB;
  border-radius: 4px;
  background-color: #F1F5F9;
  color: #1F2A37;
  pointer-events: all;

  &:focus {
    border-color: #4376B6;
    background-color: #ffffff;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const Options = styled.div`
  margin-top: 18px;
  font-size: 13px;
  color: #6B7280;

  span {
    margin: 0 8px;
    cursor: pointer;

    &:hover {
      color: #4376B6;
      text-decoration: underline;
    }
  }
`;

const SocialLoginIconButton = styled.button`
  width: 50px;
  height: 50px;
  margin: 8px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img, svg {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: transform 0.2s ease-in-out;
  }
  &:hover img, &:hover svg {
    transform: scale(1.1);
    filter: brightness(1.1);
  }
`;

const SocialIconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const Login = () => {
  const [modalStep, setModalStep] = useState(null);
  const [isPersonal, setIsPersonal] = useState(true);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    initKakao(process.env.REACT_APP_KAKAO_JS_KEY)
      .then(() => console.log('✅ Kakao SDK Initialized'))
      .catch(console.error);
  }, []);

  const signUpPage = () => navigate('/signUp');

  const handleUserLogin = async () => {
    try {
      const res = await axios.post('/jsh/login', { id, pw });

      if (res.data.success) {
        const userType = res.data.userType; // "user" or "company"
        
        // 탭에서 선택한 유형과 실제 로그인된 유형이 불일치할 경우 로그인 차단
        if ((isPersonal && userType !== 'user') || (!isPersonal && userType !== 'company')) {
          alert('선택한 로그인 유형과 계정 유형이 일치하지 않습니다.');
          return;
        }

        alert('로그인 성공!');
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
    const SCOPE = encodeURIComponent('email profile');
    const RESPONSE_TYPE = 'code';
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}` +
      `&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <>
      <Wrapper blur={modalStep !== null}>
        <LoginBox>
          <ToggleTabs>
            <Tab active={isPersonal} onClick={() => setIsPersonal(true)}>👤 개인</Tab>
            <Tab active={!isPersonal} onClick={() => setIsPersonal(false)}>🏢 기업</Tab>
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

          {isPersonal && (
            <SocialIconContainer>
              <SocialLoginIconButton onClick={handleNaverLogin}>
                <img
                  src={NaverIcon}
                  alt="네이버"
                />
              </SocialLoginIconButton>
              <SocialLoginIconButton onClick={handleKakaoLogin}>
                <img
                  src={KakaoIcon}
                  alt="카카오"
                />
              </SocialLoginIconButton>
              <SocialLoginIconButton onClick={handleGoogleLogin}>
                <img
                  src={GoogleIcon}
                  alt="구글"
                />
              </SocialLoginIconButton>
            </SocialIconContainer>
          )}

          <Options>
            <span onClick={() => setModalStep('id')}>ID/PW 찾기</span> |
            <span onClick={signUpPage}>회원가입</span>
          </Options>
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
