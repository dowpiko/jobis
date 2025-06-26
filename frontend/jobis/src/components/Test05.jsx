import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
`;

const CenterBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const CreateBox = styled.button`
  width: 300px;
  height: 300px;
  background-color: #aaa;
  border: none;
  border-radius: 8px;
  font-size: 24px;
  color: white;
  cursor: pointer;
`;

const Test05 = () => {
  const navigate = useNavigate();

  const toAiInterviewPage =()=>{
    navigate('/toAiInterviewPage')
  }
  return (
    <Container>
      <Label>기록</Label>
      <Select>
        <option>2025.07.01 프로그래머 면접 1</option>
        <option>2025.07.02 기획자 면접 2</option>
      </Select>

      <CenterBoxWrapper>
        <CreateBox onClick={toAiInterviewPage}>생성</CreateBox>
      </CenterBoxWrapper>
    </Container>
  );
};

export default Test05;
