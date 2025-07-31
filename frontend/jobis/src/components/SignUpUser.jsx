// src/components/SignUpUser.jsx
import React, { useState, forwardRef } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateField } from '../utils/validators'; // 정확한 경로 확인
import { ko } from 'date-fns/locale';

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
  width: 480px !important;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 11px;
  margin-top: 4px;
`;

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <StyledDateInput
    ref={ref}
    onClick={onClick}
    value={value}
    readOnly
    placeholder="생년월일 선택"
  />
));

const CheckButton = styled.button`
  margin-top: 6px;
  margin-left: auto;
  display: block;
  font-size: 11px;
  background-color: #e0e7ef;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #1f2a37;

  &:hover:not(:disabled) {
    background-color: #d4eaf4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
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

  &:hover:not(:disabled) {
    background-color: #4376b6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
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
const host = process.env.REACT_APP_HOST;
const SignUpUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '', pw: '', confirmPassword: '',
    name: '', birthdate: null, email: '',
  });

  const [formErrors, setFormErrors] = useState({
    id: '', pw: '', confirmPassword: '', name: '', email: ''
  });
  const [idOk, setIdOk] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const maxYear = new Date().getFullYear() - 19;
  const maxDateByYear = new Date(maxYear, 11, 31);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value, name === 'confirmPassword' ? formData.pw : '');
    setFormErrors(prev => ({ ...prev, [name]: error }));

    if (name === 'id') setIdOk(false);
    if (name === 'email') {
      setEmailCodeSent(false);
      setEmailVerified(false);
    }
  };

  const handleDateChange = (date) => setFormData(prev => ({ ...prev, birthdate: date }));

  const checkId = async () => {
    if (formErrors.id || !formData.id.trim()) return;
    try {
      const res = await axios.get(`http://${host}:9090/user/checkid?id=${encodeURIComponent(formData.id)}`);
      setIdOk(res.data.available);
      alert(res.data.available ? '사용 가능한 아이디입니다' : '이미 사용 중인 아이디입니다');
    } catch (e) {
      console.error(e);
      alert('중복 확인 오류');
    }
  };

  const sendVerification = async () => {
    if (formErrors.email || !formData.email.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`http://${host}:9090/user/sendemailcode`, { email: formData.email });
      setEmailCodeSent(res.data.success);
      if (res.data.success) alert('코드 발송됨');
      else alert('실패: ' + res.data.message);
    } catch (e) {
      console.error(e);
      alert('전송 오류');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!verifyCode.trim()) return alert('인증 코드를 입력해주세요.');
    try {
      const params = new URLSearchParams([
        ['email', formData.email],
        ['code', verifyCode],
      ]);
      const res = await axios.post(`http://${host}:9090/user/verifyemailcode`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setEmailVerified(res.data.verified);
      alert(res.data.verified ? '✅ 이메일 인증이 완료되었습니다!' : '❌ 인증 코드가 일치하지 않습니다.');
    } catch (e) {
      console.error(e);
      alert('⚠️ 인증 중 오류 발생');
    }
  };

  const handleSubmit = async () => {
    if (Object.values(formErrors).some(msg => msg)) return alert('입력 형식을 확인해주세요.');
    if (!idOk) return alert('아이디 중복 확인을 완료해주세요.');
    if (!emailVerified) return alert('이메일 인증을 완료해주세요.');
    if (!formData.birthdate) return alert('생년월일을 선택해주세요.');

    try {
      const payload = { ...formData, birthdate: formData.birthdate.toISOString().split('T')[0] };
      const res = await axios.post(`http://${host}:9090/user/signup`, payload);
      alert(res.data.success ? '가입 성공' : '가입 실패');
      if (res.data.success) navigate('/');
    } catch (e) {
      console.error(e);
      alert('가입 중 오류');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>개인 회원 가입</Title>
        {['id', 'pw', 'confirmPassword', 'name', 'email'].map(field => (
          <InputGroup key={field}>
            <Label>{field === 'confirmPassword' ? '비밀번호 확인' : field.toUpperCase()}</Label>
            <Input type={field.includes('w') ? 'password' : 'text'}
                   name={field}
                   value={formData[field]}
                   onChange={handleChange} />
            {formErrors[field] && <ErrorText>{formErrors[field]}</ErrorText>}
            {field === 'id' && (
              <CheckButton onClick={checkId}
                           disabled={!!formErrors.id || !formData.id.trim()}>
                ✔️ {idOk ? '사용 가능' : '중복확인'}
              </CheckButton>
            )}
            {field === 'email' && (
              <CheckButton onClick={sendVerification}
                           disabled={emailVerified || loading || !!formErrors.email || !formData.email.trim()}>
                {emailVerified ? '인증완료' : emailCodeSent ? (loading ? '전송중...' : '재전송') : '인증요청'}
              </CheckButton>
            )}
          </InputGroup>
        ))}
        {emailCodeSent && !emailVerified && (
          <InputGroup>
            <Label>인증 코드 입력</Label>
            <Input value={verifyCode} onChange={e => setVerifyCode(e.target.value)} />
            <CheckButton onClick={verifyEmailCode}>확인</CheckButton>
          </InputGroup>
        )}
        <InputGroup>
          <Label>생년월일</Label>
          <DatePicker
            selected={formData.birthdate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            customInput={<CustomInput />}
            maxDate={maxDateByYear}
            locale={ko}
          />
        </InputGroup>        
        <SubmitButton onClick={handleSubmit}>회원 가입</SubmitButton>
        <Message>이미 가입하셨나요? <strong onClick={() => navigate('/')}>로그인</strong></Message>
      </FormWrapper>
    </Container>
  );
};

export default SignUpUser;
