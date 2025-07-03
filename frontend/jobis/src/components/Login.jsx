import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FindPwModal from './modal/FindPwModal';
import ResetPwModal from './modal/ResetPwModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initKakao } from 'kakao-js-sdk';

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

const NaverLoginWrapper = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover img {
    filter: brightness(1.1);
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
  }
`;

const NaverImg = styled.img`
  height: 50px;
  width: auto;
  border-radius: 4px;

  @media (max-width: 768px) {
    height: 42px;
  }
`;

const KakaoLoginWrapper = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-top: 10px;

  &:hover img {
    filter: brightness(1.1);
    transform: scale(1.02);
    transition: all 0.2s ease-in-out;
  }
`;

const KakaoImg = styled.img`
  height: 50px;
  width: auto;
  border-radius: 4px;

  @media (max-width: 768px) {
    height: 42px;
  }
`;

const Login = () => {
  const [modalStep, setModalStep] = useState(null);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    initKakao(process.env.REACT_APP_KAKAO_JS_KEY)
      .then(() => console.log('✅ Kakao SDK Initialized'))
      .catch(console.error);
  }, []);

  const companyMain = () => navigate('/companyMain');
  const signUpPage = () => navigate('/signUp');

  const handleUserLogin = async () => {
    try {
      const res = await axios.post('/jsh/login', { id, pw });
      if (res.data.success) {
        alert('로그인 성공!');
        navigate('/profile');
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

  return (
    <>
      <Wrapper blur={modalStep !== null}>
        <LoginBox>
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

          <Button onClick={handleUserLogin}>user login</Button>
          <Button onClick={companyMain}>company login</Button>

          <NaverLoginWrapper onClick={handleNaverLogin}>
            <NaverImg
              src="https://static.nid.naver.com/oauth/big_g.PNG"
              alt="네이버 로그인"
            />
          </NaverLoginWrapper>

          <KakaoLoginWrapper onClick={handleKakaoLogin}>
            <KakaoImg
              src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
              alt="카카오 로그인"
            />
          </KakaoLoginWrapper>

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
