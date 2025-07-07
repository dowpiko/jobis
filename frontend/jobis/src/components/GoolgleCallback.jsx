import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

const Container = styled.div`
  padding: 40px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px;
  font-size: 16px;
  width: 200px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('loading');
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [codeUsed, setCodeUsed] = useState(false);

  useEffect(() => {
    const codeFromUrl = new URL(window.location.href).searchParams.get('code');
    if (!codeFromUrl || codeUsed) return;

    setCodeUsed(true);

    axios.post('/jsh/google/check', { code: codeFromUrl })
      .then((res) => {
        if (!res.data.success && res.data.message) {
          alert(res.data.message);
          return navigate('/');
        }

        setEmail(res.data.email);
        setAccessToken(res.data.accessToken);
        window.history.replaceState({}, document.title, '/google/callback');

        if (res.data.exists) {
          alert('구글 로그인 성공!');
          navigate('/profile');
        } else {
          setStep('form');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('구글 로그인 실패');
        navigate('/');
      });
  }, [navigate, codeUsed]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthDate) {
      alert('생년월일을 선택해주세요.');
      return;
    }

    try {
      const res = await axios.post('/jsh/google', {
        email,
        accessToken,
        birth: birthDate.toISOString().split('T')[0],
      });

      if (res.data.success) {
        alert('구글 회원가입 및 로그인 성공!');
        navigate('/profile');
      } else {
        alert('구글 회원가입 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류 발생');
    }
  };

  const today = new Date();
  const maxBirth = new Date(today.getFullYear() - 19, 11, 31); // 2005-12-31

  if (step === 'loading') return <Container>구글 로그인 처리 중입니다...</Container>;

  return (
    <Container>
      <Title>추가 정보 입력</Title>
      <Description>생년월일을 선택해주세요 (2005년 12월 31일 이전만 가능)</Description>
      <form onSubmit={handleSubmit}>
        <StyledDatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          dateFormat="yyyy-MM-dd"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={maxBirth}
          placeholderText="생년월일 선택"
          locale={ko}
        />
        <br />
        <SubmitButton type="submit">확인</SubmitButton>
      </form>
    </Container>
  );
};

export default GoogleCallback;
