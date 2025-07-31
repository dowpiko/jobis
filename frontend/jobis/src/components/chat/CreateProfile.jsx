import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F8F9FA;
`;

const ContentBox = styled.div`
  background-color: white;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 500px;
  max-width: 90%;
  margin-top: -80px;
  margin-left: -100px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #1F2A37;
  margin-bottom: 24px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #4B5563;
  line-height: 1.6;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #4376B6;
  margin-bottom: 10px;
  margin-top: 50px;
`;

const CreateButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #4376B6;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const CreateProfile = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/createProfileForm');
  };

  return (
    <Wrapper>
      <ContentBox>
        <Title>화상 모의면접을 시작해볼까요?</Title>
        <Description>
          AI 기반 화상 모의면접을 진행하려면 먼저 프로필을 생성해주세요.<br />
          프로필 정보는 모의면접 질문 구성과 피드백에 활용됩니다.
        <ProfileImage src="/img/user.svg" alt="프로필 이미지" />
        </Description>
        <CreateButton onClick={handleCreate}>프로필 생성하기</CreateButton>
      </ContentBox>
    </Wrapper>
  );
};

export default CreateProfile;
