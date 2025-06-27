import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;
`;

const QuestionBlock = styled.div`
  margin-bottom: 30px;
`;

const QuestionLabel = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AnswerBox = styled.textarea`
  width: 100%;
  height: 60px;
  background-color: #ddd;
  border: none;
  margin-bottom: 10px;
`;

const FileButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const FileButton = styled.button`
  padding: 10px 20px;
  background-color: #ccc;
  border: none;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  padding: 10px 30px;
  background-color: #ccc;
  font-size: 18px;
  border: none;
  cursor: pointer;
`;

const Test09 = () => {
  const navigate= useNavigate();
    const toScrap = ()=>{
      navigate('/toScrap')
    }
  return (
      <MainContent>
        {[1, 2, 3].map((num) => (
          <QuestionBlock key={num}>
            <QuestionLabel>Q. 질문내용입니다 어쩌구저쩌구</QuestionLabel>
            <AnswerBox />
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
