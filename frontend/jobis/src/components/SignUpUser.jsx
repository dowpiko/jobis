import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  height: 100dvh;
  background-color: #f8f9fa;
`;

const FormWrapper = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  width: 480px;
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2a37;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #b0bccb;

  &:hover {
    border-color: #5c8bc4;
    background-color: #f0f4f8;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const StyledDateInput = styled(Input)`
  width: 100% !important;
`;

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <StyledDateInput ref={ref} onClick={onClick} value={value} readOnly placeholder="생년월일 선택" />
));

const CheckButton = styled.button`
  margin-top: 6px;
  font-size: 11px;
  background-color: #e0e7ef;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  float: right;
  cursor: pointer;
  color: #1f2a37;

  &:hover {
    background-color: #d4eaf4;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #5c8bc4;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 15px;
  margin-top: 6px;

  &:hover {
    background-color: #4376b6;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 11px;
  margin-top: 14px;
  color: #6b7280;

  strong {
    color: #4376b6;
    cursor: pointer;
  }
`;

const SignUpUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', confirmPassword: '',
    name: '', birthDate: null, email: '',
  });

  const [usernameOk, setUsernameOk] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username') setUsernameOk(false);
    if (name === 'email') {
      setEmailCodeSent(false);
      setEmailVerified(false);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, birthDate: date }));
  };

  const checkUsername = async () => {
    if (!formData.username.trim()) return alert('아이디 입력');

    try {
      const res = await axios.get(`/jsh/checkusername?username=${encodeURIComponent(formData.username)}`);
      if (res.data.available) {
        alert('사용 가능한 아이디입니다');
        setUsernameOk(true);
      } else {
        alert('이미 사용 중인 아이디입니다');
        setUsernameOk(false);
      }
    } catch (e) {
      console.error(e);
      alert('중복 확인 오류');
    }
  };

  const sendVerification = async () => {
    if (!formData.email.trim()) return alert('이메일 입력');
    setLoading(true);
    try {
      const res = await axios.post('/jsh/sendemailcode', { email: formData.email });
      if (res.data.success) {
        alert('코드 발송됨');
        setEmailCodeSent(true);
      } else {
        alert('실패: ' + res.data.message);
      }
    } catch (e) {
      console.error(e);
      alert('전송 오류');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async () => {
  if (!verifyCode.trim()) {
    alert('인증 코드를 입력해주세요.');
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('email', formData.email);
    params.append('code', verifyCode);

    const res = await axios.post('/jsh/verifyemailcode', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (res.data.verified) {
      alert('✅ 이메일 인증이 완료되었습니다!');
      setEmailVerified(true);
    } else {
      alert('❌ 인증 코드가 일치하지 않습니다.');
    }
  } catch (e) {
    console.error('이메일 인증 오류:', e);
    alert('⚠️ 인증 중 오류 발생');
  }
};


  const handleSubmit = async () => {
    if (!usernameOk) return alert('아이디 중복 확인');
    if (!emailVerified) return alert('이메일 인증 필요');
    if (formData.password !== formData.confirmPassword) return alert('비밀번호 불일치');

    const payload = {
      ...formData,
      birthDate: formData.birthDate?.toISOString().split('T')[0],
    };

    try {
      const res = await axios.post('/api/signup', payload);
      if (res.data.success) {
        alert('가입 성공');
        navigate('/');
      } else {
        alert('가입 실패');
      }
    } catch (e) {
      console.error(e);
      alert('가입 중 오류');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>개인 회원 가입</Title>

        <InputGroup>
          <Label>아이디</Label>
          <Input name="username" value={formData.username} onChange={handleChange} />
          <CheckButton onClick={checkUsername}>
            ✔️ {usernameOk ? '사용 가능' : '중복확인'}
          </CheckButton>
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 확인</Label>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </InputGroup>

        <InputGroup>
          <Label>이름</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </InputGroup>

        <InputGroup>
          <Label>생년월일</Label>
          <DatePicker
            selected={formData.birthDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            customInput={<CustomInput />}
          />
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          <CheckButton onClick={sendVerification} disabled={emailVerified || loading}>
            {emailVerified ? '인증완료' : emailCodeSent ? (loading ? '전송중...' : '재전송') : '인증요청'}
          </CheckButton>
        </InputGroup>

        {emailCodeSent && !emailVerified && (
          <InputGroup>
            <Label>인증 코드 입력</Label>
            <Input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
            <CheckButton onClick={verifyEmailCode}>확인</CheckButton>
          </InputGroup>
        )}

        <SubmitButton onClick={handleSubmit}>회원 가입</SubmitButton>

        <Message>
          이미 가입하셨나요? <strong onClick={() => navigate('/')}>로그인</strong>
        </Message>
      </FormWrapper>
    </Container>
  );
};

export default SignUpUser;
