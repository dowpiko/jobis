import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DetailContainer = styled.div`
  flex-grow: 1;
  padding: 40px 30px;
  background-color: #ffffff;
  box-sizing: border-box;
  border-left: 1px solid #e0e0e0;
  min-height: 100%;
  font-family: 'Pretendard', sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2a37;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #5c8bc4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4376b6;
  }
`;

const InfoSection = styled.div`
  margin-bottom: 30px;
`;

const InfoRow = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;

  strong {
    color: #1f2a37;
    margin-right: 6px;
  }
`;

const QAItem = styled.div`
  margin-bottom: 16px;
`;

const Question = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #111827;
`;

const Answer = styled.div`
  color: #374151;
  padding-left: 10px;
`;

const QASectionWrapper = styled.div`
  max-height: 400px; /* 원하는 높이로 조절 (예: 400px) */
  overflow-y: auto;
  padding-right: 10px; /* 스크롤바 공간 확보 */
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* 버튼 사이 간격 */
`;
const host = process.env.REACT_APP_HOST;

const ApplicantDetailView = ({ applicant, onBack }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [myUno, setMyUno] = useState('');
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const res = await axios.get(`http://${host}:9090/offers/oneInterViewByOno?ono=${applicant.ono}`);
        setInterviewData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (applicant?.ono) fetchInterviewData();
  }, [applicant]);

  useEffect(() => {
    axios.get(`http://${host}:9090/user/getUser`, {withCredentials:true})
      .then(res => {
        if (res.data){
          setMyUno(res.data.uno);
          }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });    
  }, []);

  const chatRoomInsert = async () => {
    try {
      const confirmCreate = window.confirm('채팅방을 생성하시겠습니까?');
      if (!confirmCreate) return;

      const res = await axios.get(`http://${host}:9090/chat/insertChatRoom?cno=${myUno}&uno=${applicant.uno}&ono=${interviewData.ono}`);

      if (res.data === 1) {
        alert('채팅방이 생성되었습니다.');
      } else if (res.data === -1) {
        alert('이미 채팅방이 존재합니다.');
      } else {
        alert('채팅방 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  if (!applicant) return null;

  const questions = interviewData?.o_content ? interviewData.o_content.split('\n') : [];
  const answers = applicant?.o_content ? applicant.o_content.split('\n') : [];

  return (
    <DetailContainer>
      <HeaderRow>
        <Title>면접 Q&A</Title>

        <ButtonWrapper>
          <BackButton onClick={chatRoomInsert}>채팅시작</BackButton>
          <BackButton onClick={onBack}>뒤로가기</BackButton>
        </ButtonWrapper>
      </HeaderRow>

      <InfoSection>
        <InfoRow><strong>이름:</strong> {applicant.name}&nbsp;&nbsp;({formatDate(applicant.birthdate)})</InfoRow>
        <InfoRow><strong>이메일:</strong> {applicant.email}</InfoRow>
        <InfoRow><strong>지원일:</strong> {formatDate(applicant.o_regdate)}</InfoRow>
      </InfoSection>

      <InfoSection>
        <QASectionWrapper>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <QAItem key={index}>
                <Question>Q{index + 1}. {q}</Question>
                <Answer>
                  <strong>A{index + 1}.</strong> {answers[index] ? answers[index] : '-'}
                </Answer>
              </QAItem>
            ))
          ) : (
            <InfoRow>면접 질문이 없습니다.</InfoRow>
          )}
        </QASectionWrapper>
      </InfoSection>
    </DetailContainer>
  );
};

export default ApplicantDetailView;
