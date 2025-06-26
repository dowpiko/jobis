import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background-color: #ddd;
  padding: 30px 40px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
`;

const Text = styled.p`
  font-size: 13px;
  margin-bottom: 10px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 40px 14px 14px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 14px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px 30px;
  background: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Modal02 = ({ userId = '사용자아이디', onClose }) => {
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>아이디 확인 및 비밀번호 재설정</Title>

        <Label>ID :</Label>
        <div style={{ marginBottom: 16 }}>{userId}</div>

        <Text>새 비밀번호를 입력하세요.</Text>

        <InputGroup>
          <Input
            type={showPw1 ? 'text' : 'password'}
            placeholder="새 비밀번호"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
          />
          <ToggleButton onClick={() => setShowPw1((prev) => !prev)}>
            {showPw1 ? '🙈' : '👁️'}
          </ToggleButton>
        </InputGroup>

        <InputGroup>
          <Input
            type={showPw2 ? 'text' : 'password'}
            placeholder="새 비밀번호 확인"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />
          <ToggleButton onClick={() => setShowPw2((prev) => !prev)}>
            {showPw2 ? '🙈' : '👁️'}
          </ToggleButton>
        </InputGroup>

        <ButtonWrapper>
          <SubmitButton>변경</SubmitButton>
        </ButtonWrapper>
      </ModalBox>
    </ModalOverlay>
  );
};

export default Modal02;
