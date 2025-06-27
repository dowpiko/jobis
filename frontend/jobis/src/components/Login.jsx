import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  width: 70%;
  padding: 8px;
  font-size: 15px;
  border: 1px solid #B0BCCB;
  border-radius: 4px;
  background-color: #F1F5F9;
  color: #1F2A37;

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

const Login = () => {
  const navigate = useNavigate();
  const announcementPage =()=>{
    navigate('/companyNotice')
  }
  const getProfileSelection =()=>{
    navigate('/profileselection')
  }
  return (
    <Wrapper>
      <LoginBox>
        <Title>Login</Title>
        <FormGroup>
          <Label htmlFor="userId">ID :</Label>
          <Input type="text" id="userId" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="userPw">PW :</Label>
          <Input type="password" id="userPw" />
        </FormGroup>
        <Button onClick={getProfileSelection}>User Login</Button>
        <Button onClick={announcementPage}>Company Login</Button>
        <Options>
          <span>ID/PW 찾기</span> |
          <span>회원가입</span>
        </Options>
      </LoginBox>
    </Wrapper>
  );
};

export default Login;
