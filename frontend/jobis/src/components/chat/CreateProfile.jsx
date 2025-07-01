import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F8F9FA;
  padding: 40px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #1F2A37;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #4B5563;
  max-width: 480px;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ProfileImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid #4376B6;
  margin-bottom: 24px;
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
    navigate('/createProfileForm'); // 예: 프로필 작성 페이지
  };

  return (
    <Wrapper>
      <Title>화상 모의면접을 시작해볼까요?</Title>
      <Description>
        AI 기반 화상 모의면접을 진행하려면 먼저 프로필을 생성해주세요.<br />
        프로필 정보는 모의면접 질문 구성과 피드백에 활용됩니다.
      </Description>
      <ProfileImage src="https://via.placeholder.com/160" alt="프로필 이미지" />
      <CreateButton onClick={handleCreate}>프로필 생성하기</CreateButton>
    </Wrapper>
  );
};

export default CreateProfile;
