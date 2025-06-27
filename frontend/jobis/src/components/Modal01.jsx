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
  background-color: #f0f2f5;
  padding: 40px 50px;
  border-radius: 12px;
  width: 480px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-weight: normal;
  color: #1f2a37;

  b {
    font-weight: bold;
    color: #4376b6;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  font-size: 14px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
  box-sizing: border-box;
  margin-bottom: 16px;
  outline: none;

  &::placeholder {
    color: #6b7280;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  padding: 10px 18px;
  background-color: #5c8bc4;
  color: white;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4376b6;
  }
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
