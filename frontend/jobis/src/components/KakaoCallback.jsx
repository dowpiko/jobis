import React, { useEffect, useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

/** ─── Styled Components ───────────────────────────────────────────────────── **/

const Container = styled.div`
  padding: 80px 40px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f7f7f7;
`;

const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 60px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  width: 100px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const NameInput = styled.input`
  flex: 1;
  width: 100%;
  height: 44px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
`;

const DateDisplay = styled.div`
  flex: 1;
  padding: 10px;
  padding-right: 121px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  color: #000;
  text-align: left;
  display: flex;
  align-items: center;
  &:hover {
    border-color: #4a90e2;
    cursor: pointer;
  }
`;

const CalendarButton = styled.button.attrs({ type: 'button' })`
  margin-left: 8px;
  padding: 6px 12px;
  font-size: 14px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const StyledDatePicker = styled(DatePicker)`
  .react-datepicker__input-container input {
    display: none;
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  font-size: 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
`;

const CustomCalendarButton = forwardRef(({ onClick }, ref) => (
  <CalendarButton ref={ref} onClick={onClick}>
    선택
  </CalendarButton>
));

const host = process.env.REACT_APP_HOST;

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('loading');
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [name, setName] = useState('');
  const [codeUsed, setCodeUsed] = useState(false);
  const formatDateToYMD = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code || codeUsed) return;
    setCodeUsed(true);

    axios.post(`http://${host}:9090/user/kakao/check`, { code }, { withCredentials: true })
      .then(res => {
        if (!res.data.success && res.data.message) {
          alert(res.data.message);
          return navigate('/');
        }
        setEmail(res.data.email);
        setAccessToken(res.data.accessToken);
        window.history.replaceState({}, document.title, '/kakao/callback');

        if (res.data.exists) {
          alert('카카오 로그인 성공!');
          navigate('/profile');
        } else {
          setStep('form');
        }
      })
      .catch(err => {
        console.error(err);
        alert('카카오 로그인 실패');
        navigate('/');
      });
  }, [navigate, codeUsed]);

  const MIN_AGE = 19;
  const today = new Date();
  const getAge = (birthday) => {
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (date) => {
    if (getAge(date) < MIN_AGE) {
      alert(`만 ${MIN_AGE}세 이상만 가입이 가능합니다.`);
      return;
    }
    setBirthDate(date);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const nameRegex = /^[가-힣]{2,}$/;
    if (!nameRegex.test(name)) {
      alert('이름을 한글 2자 이상으로 입력해주세요.');
      return;
    }
    if (!birthDate) {
      alert('생년월일을 선택해주세요.');
      return;
    }

    try {
      const res = await axios.post(`http://${host}:9090/user/kakao`, {
        email,
        accessToken,
        birth: birthDate.toISOString().split('T')[0],
        name,
      });
      if (res.data.success) {
        alert('카카오 회원가입 및 로그인 성공!');
        navigate('/profile');
      } else {
        alert('카카오 회원가입 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류 발생');
    }
  };

  if (step === 'loading') {
    return <Container>카카오 로그인 처리 중입니다...</Container>;
  }

  return (
    <Container>
      <Card>
        <Title>추가정보 입력</Title>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <Label>이름 :</Label>
            <NameInput
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="실명을 입력해주세요"
            />
          </FormRow>

          <FormRow>
            <Label>생년월일 :</Label>
            <StyledDatePicker
              selected={birthDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              locale={ko}
              withPortal
              customInput={<DateDisplay>{birthDate ? formatDateToYMD(birthDate) : '생년월일을 입력해주세요'}</DateDisplay>}
            />
          </FormRow>

          <SubmitButton type="submit">확인</SubmitButton>
        </Form>
      </Card>
    </Container>
  );
};

export default KakaoCallback;
