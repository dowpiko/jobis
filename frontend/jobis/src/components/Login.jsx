import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* ❗️ 배경과 겹칠 때 무응답 방지 */
`;

const LoginBox = styled.div`
  background-color: #d9d9d9;
  padding: 30px 40px;
  border-radius: 5px;
  text-align: center;
  width: 350px;
  pointer-events: all; /* ❗️ 클릭 이벤트 허용 */
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  display: inline-block;
  width: 50px;
  font-weight: bold;
  font-size: 18px;
`;

const Input = styled.input`
  width: 75%;
  padding: 8px;
  font-size: 16px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 6px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const Options = styled.div`
  margin-top: 15px;
  font-size: 14px;

  span {
    margin: 0 10px;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const announcementPage =()=>{
    console.log('1234')
    navigate('/announcementPage')
  }
  return (
    <Wrapper>
      <LoginBox>
        <Title>login</Title>
        <FormGroup>
          <Label htmlFor="userId">ID :</Label>
          <Input type="text" id="userId" />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="userPw">PW :</Label>
          <Input type="password" id="userPw" />
        </FormGroup>
        <Button onClick={announcementPage}>user login</Button>
        <Button onClick={announcementPage}>company login</Button>
        <Options>
          <span>ID/PW 찾기</span> |
          <span>회원가입</span>
        </Options>
      </LoginBox>
    </Wrapper>
  );
};

export default Login;
