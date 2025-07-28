import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;
  background-color: #F8F9FA;
  color: #1F2A37;
  box-sizing: border-box;
  font-family: sans-serif;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const CorpInfo = styled.div`
  margin-bottom: 16px;
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

const QuestionBlock = styled.div`
  margin-bottom: 30px;
`;

const QuestionLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #4376B6;
`;

const AnswerBox = styled.textarea`
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4376B6;
    box-shadow: 0 0 0 2px rgba(67, 118, 182, 0.2);
  }
`;

const SubmitButton = styled.button`
  margin-top: 30px;
  padding: 12px 32px;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5C8BC4;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const ActionButton = styled(SubmitButton)`
  background-color: #888;
  &:hover {
    background-color: #666;
  }
`;

const ApplyNotice = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ono = state?.ono;
  const [uno, setUno] = useState(null);  // 로그인된 uno

  const [corpInfo, setCorpInfo] = useState(null);
  const [offer, setOffer] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const handleResumeUpload = () => {
    alert('이력서 업로드 기능은 추후 구현될 예정입니다!');
  };

  const handleVideoUpload = () => {
    alert('동영상 업로드 기능은 추후 구현될 예정입니다!');
  };

   // 1) 세션에서 uno 가져오기
  useEffect(() => {
    axios.get('/getMyUno', { withCredentials: true })
      .then(res => {
        setUno(res.data);
      })
      .catch(err => {
        console.error('세션 uno 가져오기 실패:', err);
        alert('로그인 상태가 아닙니다. 다시 로그인해주세요.');
        navigate('/');  
      });
  }, [navigate]);

  // 2) uno, ono 둘 다 준비되면 기업 정보 + 질문 데이터 fetch
   useEffect(() => {
    if (!ono || uno == null) return;
    const fetchData = async () => {
      try {
        // — 면접/공고 정보
        const { data: interview } = await axios.get(
          `/offers/oneInterViewByOno?ono=${ono}`,
          { withCredentials: true }
        );
        setOffer(interview);

        // — 회사 ID: interview.uno
        const companyUno = interview.uno;

        // — 회사 정보
        const { data: corp } = await axios.get(
          `/user/selectCinofoByUno?uno=${companyUno}`,
          { withCredentials: true }
        );
        setCorpInfo(corp);

        // — 질문 분리
        const qlist = interview.o_content?.split('\n') || [];
        setQuestions(qlist);
        setAnswers(new Array(qlist.length).fill(''));

      } catch (err) {
        console.error('정보 로딩 실패:', err);
        alert('정보 로딩 중 오류가 발생했습니다.');
      }
    };
    fetchData();
  }, [ono, uno, navigate]);



  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // const answerText = answers.join('\n');
    const payload = {
      uno,
      ono,
      o_title: offer.o_title,
      o_tag: offer.o_tag,
      answers
      // o_content: answerText
    };

    try {
      const res = await axios.post('/insertSubmission', {
        ono,
        o_title: offer.o_title,
        o_tag : offer.o_tag,
        answers
        // o_content: answerText
      }, { withCredentials: true });

      if (res.data === 1) {
        alert('제출 완료!');
        navigate('/scrapPage');
      } else {
        alert('제출 실패');
      }
    } catch (err) {
      console.error('제출 중 오류 발생:', err);
      if (err.response) {
        console.error('❗ err.response.status:', err.response.status);
        console.error('❗ err.response.data:', err.response.data);  // ← 이 부분!
      }
      alert('제출 중 오류 발생');
    }
  };

  const goToCompanyInfo =()=>{
    navigate('/companyInfo')
  }
  return (
    <MainContent>
      {corpInfo && (
        <Header>
          <CorpInfo>
            <InfoRow><strong>기업명:</strong> {corpInfo.corpNm}</InfoRow>
            <InfoRow><strong>분야:</strong> {offer.o_tag}</InfoRow>
            <InfoRow><strong>공고명:</strong> {offer.o_title}</InfoRow>
          </CorpInfo>
        </Header>
      )}

      {questions.map((q, idx) => (
        <QuestionBlock key={idx}>
          <QuestionLabel>Q{idx + 1}. {q}</QuestionLabel>
          <AnswerBox
            value={answers[idx]}
            onChange={(e) => handleAnswerChange(idx, e.target.value)}
            placeholder="답변을 입력하세요…"
          />
        </QuestionBlock>
      ))}
      <ButtonGroup>
        <SubmitButton onClick={handleSubmit}>제출</SubmitButton>
        <ActionButton onClick={handleResumeUpload}>이력서 제출</ActionButton>
        <ActionButton onClick={handleVideoUpload}>동영상 제출</ActionButton>
        <ActionButton onClick={goToCompanyInfo}>목록으로</ActionButton>
      </ButtonGroup>
    </MainContent>
  );
};

export default ApplyNotice;
