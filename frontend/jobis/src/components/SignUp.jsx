import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  font-family: sans-serif;
  text-align: center;
  padding: 80px 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-bottom: 40px;
  font-size: 28px;
  color: #1f2a37;
`;

const BoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
`;

const Box = styled.div`
  width: 200px;
  height: 200px;
  background: #e0e7ef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #d0ddef;
  }
`;

const IconWrapper = styled.div`
  background-color: #5c8bc4;
  padding: 16px;
  border-radius: 50%;
  margin-bottom: 16px;
`;

const Icon = styled.span`
  font-size: 48px;
  color: white;
`;

const Label = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #1f2a37;
`;

const SignUp = () => {
  const navigate = useNavigate();

  const goToUserLogin = () => {
    navigate('/signUpUser');
  };

  const goToCmpLogin = () => {
    navigate('/signUpCmp');
  };

  return (
    <Container>
      <Title>회원가입</Title>
      <BoxWrapper>
        <Box onClick={goToUserLogin}>
          <IconWrapper>
            <Icon>👤</Icon>
          </IconWrapper>
          <Label>개인회원</Label>
        </Box>
        <Box onClick={goToCmpLogin}>
          <IconWrapper>
            <Icon>👥</Icon>
          </IconWrapper>
          <Label>기업회원</Label>
        </Box>
      </BoxWrapper>
    </Container>
  );
};

export default SignUp;
