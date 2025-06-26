import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FormWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const TitleInput = styled.input`
  width: 100%;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background-color: #d9d9d9;
  border: none;
  margin-bottom: 20px;
`;

const CategorySelect = styled.select`
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  padding: 0 12px;
  margin-bottom: 10px;
`;

const ContentArea = styled.textarea`
  width: 100%;
  height: 250px;
  background-color: #d9d9d9;
  border: 1px solid #333;
  resize: none;
  font-size: 16px;
  padding: 10px;
`;

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 30px;
  font-size: 16px;
  background-color: #d9d9d9;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const Test06 = () => {

  const navigate = useNavigate();
  const goToAiChat =()=>{
    navigate('/AiChat')
  }

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

export default Test06;
