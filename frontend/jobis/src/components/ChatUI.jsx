import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #F8F9FA;
  font-family: sans-serif;
`;

const Title = styled.div`
  border: 2px solid #4376B6;
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #1F2A37;
  background-color: #ffffff;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #B0BCCB;
  padding-top: 14px;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 14px;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  outline: none;
  background-color: #ffffff;
  color: #1F2A37;

  &:focus {
    border-color: #4376B6;
  }
`;

const SendButton = styled.button`
  padding: 10px;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const IconButton = styled.button`
  padding: 10px;
  background-color: #E0E7EF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #C3D5EA;
  }
`;

const ChatUI = () => {
  const navigate = useNavigate();

  const dataVisualization = () => {
    navigate('/dataVisualization');
  };

  return (
    <Container>
      <Title>제목</Title>
      <InputContainer>
        <Input type="text" placeholder="채팅을 입력하세요." />
        <SendButton>▶️</SendButton>
        <IconButton>🎤</IconButton>
        <IconButton>🔄</IconButton>
        <IconButton onClick={dataVisualization}>면접 종료</IconButton>
      </InputContainer>
    </Container>
  );
};

export default ChatUI;
