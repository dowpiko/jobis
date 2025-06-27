import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  background-color: #F8F9FA;
  color: #1F2A37;
  box-sizing: border-box;
  font-family: sans-serif;
`;

const QuestionBlock = styled.div`
  margin-bottom: 30px;
`;

const QuestionLabel = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4376B6;
`;

const AnswerBox = styled.textarea`
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  padding: 8px;
  font-size: 16px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4376B6;
    box-shadow: 0 0 0 2px rgba(67, 118, 182, 0.2);
  }
`;

const FileButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const FileButton = styled.button`
  padding: 10px 20px;
  background-color: #aaaaaa;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #888888;
  }
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  padding: 12px 32px;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const Test09 = () => {
  const navigate = useNavigate();
  const toScrap = () => navigate('/toScrap');

  return (
    <MainContent>
      {[1, 2, 3].map((num) => (
        <QuestionBlock key={num}>
          <QuestionLabel>
            Q{num}. 질문 내용입니다. 어쩌구저쩌구?
          </QuestionLabel>
          <AnswerBox placeholder="답변을 입력하세요…" />
        </QuestionBlock>
      ))}

      <FileButtons>
        <FileButton>이력서 첨부</FileButton>
        <FileButton>영상 첨부</FileButton>
      </FileButtons>

      <SubmitButton onClick={toScrap}>제출</SubmitButton>
    </MainContent>
  );
};

export default Test09;
