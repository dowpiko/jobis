import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  flex-grow: 1;
  max-width: 600px;
  padding: 30px 20px 60px;
  margin: 0 auto;
  background-color: #f8f9fa;
  position: relative;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #1f2a37;
  margin-bottom: 24px;
  text-align: center;
`;

const QuestionListWrapper = styled.div`
  max-height: 600px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b0bccb;
    border-radius: 3px;
  }
`;

const QuestionGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 16px;
  display: block;
  margin-bottom: 6px;
  color: #1f2a37;
`;

const Input = styled.input`
  width: 100%;
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #b0bccb;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;

  &:hover {
    border-color: #5c8bc4;
    background-color: #f0f4f8;
  }
`;

const AddButton = styled.button`
  background-color: #5c8bc4;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4376b6;
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 28px;
  font-size: 16px;
  background-color: #4376b6;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5c8bc4;
  }
`;

const NoticeProgress = () => {
  const [questions, setQuestions] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (i, v) => {
    const arr = [...questions];
    arr[i] = v;
    setQuestions(arr);
  };

  const handleAdd = () => {
    if (questions.length < 15) setQuestions([...questions, '']);
  };

  const handleSubmit = () => {
    console.log('등록된 질문:', questions);
    alert('질문이 등록되었습니다.');
    navigate('/companyMain');
  };

  return (
    <Container>
      <Title>공고 질문 등록</Title>

      <QuestionListWrapper>
        {questions.map((q, idx) => (
          <QuestionGroup key={idx}>
            <Label>Q. {idx + 1}</Label>
            <Input
              type="text"
              value={q}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </QuestionGroup>
        ))}
      </QuestionListWrapper>

      {questions.length < 15 && (
        <AddButton onClick={handleAdd}>+ 질문 추가 (최대 15개)</AddButton>
      )}

      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
    </Container>
  );
};

export default NoticeProgress;
