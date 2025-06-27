import React, { useState } from 'react';
import styled from 'styled-components';
import Modal01 from './Modal01';
import Modal02 from './Modal02'; // 새 모달 import
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
  background-color: ${({ blur }) => (blur ? 'rgba(255,255,255,0.4)' : 'transparent')};
  backdrop-filter: ${({ blur }) => (blur ? 'blur(4px)' : 'none')};
  transition: backdrop-filter 0.2s ease;
  pointer-events: ${({ blur }) => (blur ? 'none' : 'all')};
`;

const LoginBox = styled.div`
  background-color: #d9d9d9;
  padding: 30px 40px;
  border-radius: 5px;
  text-align: center;
  width: 350px;
  pointer-events: all;
`;

const Title = styled.h2`margin-bottom: 20px;`;
const FormGroup = styled.div`margin-bottom: 15px;text-align: left;`;
const Label = styled.label`display: inline-block;width: 50px;font-weight: bold;font-size: 18px;`;
const Input = styled.input`width: 75%;padding: 8px;font-size: 16px;`;
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
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Login = () => {
  const [modalStep, setModalStep] = useState(null); // null | 'id' | 'resetPw'
  const navigate = useNavigate();

  const announcementPage = () => navigate('/companyNotice');
  const getProfileSelection = () => navigate('/profileselection');

  return (
    <>
      <Wrapper blur={modalStep !== null}>
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
          <Button onClick={getProfileSelection}>user login</Button>
          <Button onClick={announcementPage}>company login</Button>
          <Options>
            <span onClick={() => setModalStep('id')}>ID/PW 찾기</span> |
            <span>회원가입</span>
          </Options>
        </LoginBox>
      </Wrapper>

      {/* 모달 렌더링 */}
      {modalStep === 'id' && (
        <Modal01 onClose={() => setModalStep(null)} onSubmit={() => setModalStep('resetPw')} />
      )}
      {modalStep === 'resetPw' && (
        <Modal02 onClose={() => setModalStep(null)} userId="exampleUserId" />
      )}
    </>
  );
};

export default Login;

