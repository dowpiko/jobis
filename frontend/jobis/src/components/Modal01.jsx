import React from 'react';
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
  font-weight: normal;

  b {
    font-weight: bold;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: none;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
`;

const Modal01 = ({ onClose, onSubmit }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Title>이메일로 <b>ID/PW</b> 찾기</Title>
        <Input type="email" placeholder="이메일을 입력하세요." />
        <ButtonWrapper>
          <SubmitButton onClick={onSubmit}>ID 찾기</SubmitButton>
        </ButtonWrapper>
      </ModalBox>
    </ModalOverlay>
  );
};

export default Modal01;
