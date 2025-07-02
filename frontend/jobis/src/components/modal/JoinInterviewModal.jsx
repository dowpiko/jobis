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
  z-index: 1000;
`;

const ModalWrapper = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 0 0 12px;
  color: #1f2a37;
`;

const Description = styled.p`
  font-size: 14px;
  color: #374151;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled.button`
  background: #d1d5db;
  color: #111827;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #c0c4cb;
  }
`;

const ConfirmButton = styled.button`
  background: #5c8bc4;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #4376b6;
  }
`;

const Modal = ({  onClose, chat, onConfirm}) => {
  return (
    <ModalOverlay>
      <ModalWrapper>
        <Title>{chat.r_title}</Title>
        <Description>
          면접 리더 : <strong>{chat.leader_name}</strong> 
        </Description>
        <Description>모의 면접 날짜: {chat.sch_date.toLocaleString('ko-KR')}</Description>
        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>참여하기</ConfirmButton>
        </ButtonGroup>
      </ModalWrapper>
    </ModalOverlay>
  );
};

export default Modal;
