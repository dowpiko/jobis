import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  font-family: sans-serif;
  text-align: center;
  margin-top: 50px;
`;

const Title = styled.h2`
  margin-bottom: 30px;
`;

const BoxWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
`;

const Box = styled.div`
  width: 150px;
  height: 150px;
  background: #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div`
  background-color: ${props => (props.type === 'individual' ? '#e6dafe' : 'transparent')};
  padding: 10px;
  border-radius: 16px;
  margin-bottom: 10px;
`;

const Icon = styled.span`
  font-size: 40px;
`;

const Label = styled.span`
  font-size: 16px;
`;


const SignupChoice = () => {

  const navigate =useNavigate();
  const goToUserLogin=()=>{
    navigate('/signUpUser');
  };
  const goToCmpLogin =()=>{
    navigate('/signUpCmp');
  };
  return (
    <Container>
      <Title>회원가입</Title>
      <BoxWrapper>
        <Box onClick={goToUserLogin}> 
          <IconWrapper type="individual">
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

export default SignupChoice;
