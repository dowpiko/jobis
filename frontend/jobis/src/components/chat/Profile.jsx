import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 180px 0px 90px;
  font-family: sans-serif;
  background-color: #F8F9FA;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 60px;
  color: #1F2A37;
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  align-content: start;
`;

const Card = styled.div`
  width: 300px;
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #B0BCCB;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    transform: translateY(-6px);
  }
`;

const CardImage = styled.img`
  padding-left: 20px;
  width: 250px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #4376B6;
  margin: 14px 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
  text-align: center;
`;

const host = process.env.REACT_APP_HOST;

const Profile = () => {
  const navigate = useNavigate();
  const aiInterview = () => navigate('/aiInterview');
  const handleProfile = async () => {
    try {
      const res = await axios.get(`http://${host}:9090/user/checkProfile`, {withCredentials:true});
      if (res.data.exists) {
        navigate('/scheduleManager');
      } else {
        navigate('/createProfile');
      }
    } catch (err) {
      console.error('프로필 확인 실패:', err);
      alert('세션이 만료되었거나 오류가 발생했습니다.');
      navigate('/');
    }
  };

  return (
    <Wrapper>
      <Title>프로필 선택</Title>
      <CardContainer>
        <Card onClick={aiInterview}>
          <CardImage src="/img/aiinterview.png"/>
          <CardTitle>AI 모의 면접</CardTitle>
          <Description>
            AI가 질문하고 실시간 피드백을 <br/>제공하는 지능형 인터뷰 환경을 경험해보세요.
          </Description>
        </Card>
        <Card onClick={handleProfile}>
          <CardImage src="/img/interview.png" alt="화상 면접" />
          <CardTitle>화상 모의 면접</CardTitle>
          <Description>
            실제 면접과 유사한 <br/>화상 환경에서 실전 감각을 키워보세요.
          </Description>
        </Card>
      </CardContainer>
    </Wrapper>
  );
};

export default Profile;
