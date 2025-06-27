import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 40px 20px;
  background-color: #F8F9FA;
  font-family: sans-serif;
  color: #1F2A37;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: auto;
  height: auto;
`;


const TitleInput = styled.input`
  width: 100%;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  margin-bottom: 20px;
  color: #1F2A37;

  &:focus {
    outline: none;
    border-color: #4376B6;
    box-shadow: 0 0 0 2px rgba(67, 118, 182, 0.2);
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  height: 44px;
  font-size: 16px;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  padding: 0 12px;
  margin-bottom: 20px;
  color: #1F2A37;

  &:focus {
    outline: none;
    border-color: #4376B6;
  }
`;

const ContentArea = styled.textarea`
  width: 100%;
  height: 250px;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  resize: none;
  font-size: 16px;
  padding: 12px;
  color: #1F2A37;

  &:focus {
    outline: none;
    border-color: #4376B6;
  }
`;

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 30px;
  font-size: 16px;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const CreateAiInterview = () => {
  const navigate = useNavigate();

  const goToAiChat = () => {
    navigate('/AiChat');
  };

  return (
    <FormWrapper>
      <TitleInput type="text" placeholder="제목" />

      <CategorySelect>
        <option>카테고리</option>
        <option>프론트엔드</option>
        <option>백엔드</option>
        <option>디자인</option>
      </CategorySelect>

      <ContentArea placeholder="내용을 입력하세요..." />

      <SubmitWrapper>
        <SubmitButton onClick={goToAiChat}>CREATE</SubmitButton>
      </SubmitWrapper>
    </FormWrapper>
  );
};

export default CreateAiInterview;
