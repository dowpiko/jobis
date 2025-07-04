import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApplicantDetailView from './ApplicantDetailView';  // ✅ 반드시 import

const Container = styled.div`
  flex-grow: 1;
  padding: 40px 20px;
  background-color: #f8f9fa;
  box-sizing: border-box;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TabMenu = styled.div`
  display: flex;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${(props) => (props.active ? '#e0e7ef' : '#f0f2f5')};
  color: #1f2a37;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  border: 1px solid #b0bccb;
  border-bottom: none;
  border-radius: ${(props) =>
    props.first ? '8px 0 0 0' : props.last ? '0 8px 0 0' : '0'};

  &:hover {
    background-color: #dbe5ef;
  }
`;

const RegisterButton = styled.button`
  padding: 8px 16px;
  background-color: #5c8bc4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #4376b6;
  }
`;

const PostContainer = styled.div`
  background-color: #f0f2f5;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #b0bccb;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #1f2a37;

  input {
    margin-right: 10px;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #4376b6;
  }
`;

const ApplicantList = styled.div`
  margin-top: 12px;
  border: 1px solid #b0bccb;
  border-radius: 4px;
  overflow: hidden;
`;

const ApplicantItem = styled.div`
  background-color: #e0e7ef;
  color: #1f2a37;
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #b0bccb;
  cursor: pointer;

  &:hover {
    background-color: #d4eaf4;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InfoText = styled.span`
  font-size: 13px;
  color: #555;
`;

const CompanyMain = () => {
  const [check, setCheck] = useState(1);
  const [expanded, setExpanded] = useState([]);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const navigate = useNavigate();

  const getRemainingDays = (timestamp) => {
    const today = new Date();
    const targetDate = new Date(timestamp);
    const timeDiff = targetDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return dayDiff > 0 ? `${dayDiff}일 남음` : '마감';
  };

  const noticeProgress = () => {
    navigate('/noticeProgress');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9090/sm/progress?check=${check}`);
      const sortedData = res.data.slice().sort((a, b) => a.o_activedays - b.o_activedays);
      setPost(sortedData);
      setExpanded(new Array(sortedData.length).fill(false));
      setApplicants(new Array(sortedData.length).fill([]));
    } catch (err) {
      console.error(err);
      setPost([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [check]);

  const toggleExpand = async (index, ono) => {
    setExpanded(prev => prev.map((val, i) => (i === index ? !val : val)));
    if (!expanded[index]) {
      try {
        const res = await axios.get(`http://localhost:9090/sm/selectByOno?ono=${ono}`);
        const newApplicants = [...applicants];
        newApplicants[index] = res.data;
        setApplicants(newApplicants);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleBack = () => {
    setSelectedApplicant(null);
  };

  return (
    <Container>
      {selectedApplicant ? (
        <ApplicantDetailView applicant={selectedApplicant} onBack={handleBack} />
      ) : (
        <>
          <HeaderRow>
            <TabMenu>
              <Tab first active={check === 1} onClick={() => setCheck(1)}>진행중</Tab>
              <Tab last active={check === 0} onClick={() => setCheck(0)}>마감</Tab>
            </TabMenu>
            <RegisterButton onClick={noticeProgress}>공고등록</RegisterButton>
          </HeaderRow>

          {loading ? (
            <div>로딩 중...</div>
          ) : post.length === 0 ? (
            <div>데이터가 없습니다.</div>
          ) : (
            post.map((item, idx) => (
              <PostContainer key={idx}>
                <PostHeader>
                  <PostTitle>
                    <input type="checkbox" />
                    {item.o_title || '제목 없음'}
                  </PostTitle>
                  <PostInfo>
                    <InfoText>
                      만료일: {formatDate(item.o_activedays)} ({getRemainingDays(item.o_activedays)})
                    </InfoText>
                    <ToggleButton onClick={() => toggleExpand(idx, item.ono)}>
                      {expanded[idx] ? '▲' : '▼'}
                    </ToggleButton>
                  </PostInfo>
                </PostHeader>

                {expanded[idx] && (
                  <ApplicantList>
                    {applicants[idx] && applicants[idx].length > 0 ? (
                      applicants[idx].map((applicant, i) => (
                        <ApplicantItem key={i} onClick={() => handleApplicantClick(applicant)}>
                          이름: {applicant.name} &nbsp;&nbsp;|&nbsp;&nbsp; 
                          생년월일: {formatDate(applicant.birthdate)} &nbsp;&nbsp;|&nbsp;&nbsp; 
                          이메일: {applicant.email} &nbsp;&nbsp;|&nbsp;&nbsp; 
                          지원 날짜: {formatDate(applicant.o_regdate)}
                        </ApplicantItem>
                      ))
                    ) : (
                      <ApplicantItem>지원자 없음</ApplicantItem>
                    )}
                  </ApplicantList>
                )}
              </PostContainer>
            ))
          )}
        </>
      )}
    </Container>
  );
};

export default CompanyMain;
