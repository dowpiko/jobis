import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  height: 100dvh; /* ✅ 모바일 호환 안정적인 전체 높이 */
  background-color: #f8f9fa;
  font-family: sans-serif;
  box-sizing: border-box;
`;

const FormWrapper = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  width: 480px;
  max-height: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2a37;
  margin-bottom: 24px;
  font-size: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #1f2a37;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #b0bccb;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #6b7280;
  }
`;

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
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6px;
  transition: background-color 0.2s;

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

const SignUpCmp = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate('/login');
  };

  return (
    <Container>
      <FormWrapper>
        <Title>기업 회원 회원가입</Title>

        <InputGroup>
          <Label>아이디</Label>
          <Input type="text" />
          <CheckButton>✔️ 아이디 확인</CheckButton>
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <Input type="password" />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 확인</Label>
          <Input type="password" />
        </InputGroup>

        <InputGroup>
          <Label>기업명</Label>
          <Input type="text" />
        </InputGroup>

        <InputGroup>
          <Label>사업자등록번호</Label>
          <Input type="text" />
          <CheckButton>✔️ 확인</CheckButton>
        </InputGroup>

        <InputGroup>
          <Label>대표자명</Label>
          <Input type="text" />
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input type="email" />
          <CheckButton>✔️ 이메일 인증</CheckButton>
        </InputGroup>

        <SubmitButton onClick={toLogin}>회원 가입</SubmitButton>

        <Message>
          이미 가입된 회원이신가요? <strong onClick={toLogin}>로그인</strong>
        </Message>
      </FormWrapper>
    </Container>
  );
};

export default SignUpCmp;
