import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  padding: 40px 20px;
  margin: 0 auto;
  position: relative;
`;

const QuestionGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 18px;
  display: block;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  background-color: #d9d9d9;
  border: none;
  padding: 8px;
`;

const AddButton = styled.button`
  background-color: #d9d9d9;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 30px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  cursor: pointer;
`;

const Test17 = () => {
  const [questions, setQuestions] = useState(['', '', '', '']);

  const handleChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleAdd = () => {
    if (questions.length < 15) {
      setQuestions([...questions, '']);
    }
  };

  const handleSubmit = () => {
    console.log('등록된 질문:', questions);
    alert('질문이 등록되었습니다.');
  };

  return (
    <Container>
      공고등록페이지 
      {questions.map((q, index) => (
        <QuestionGroup key={index}>
          <Label>Q.{index + 1}</Label>
          <Input
            type="text"
            value={q}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </QuestionGroup>
      ))}

      {questions.length < 15 && (
        <AddButton onClick={handleAdd}>+ (최대 15개)</AddButton>
      )}

      <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
    </Container>
  );
};

export default Test17;
