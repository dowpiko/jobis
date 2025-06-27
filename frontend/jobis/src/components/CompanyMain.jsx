import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

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
  transition: background-color 0.2s;

  &:hover {
    background-color: #d4eaf4;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CompanyMain = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [expanded, setExpanded] = useState([]);
  const navigate = useNavigate();

  const noticeProgress = () => {
    navigate('/noticeProgress');
  };

  const progressPosts = [
    { id: 1, title: '진행중 공고 A', applicants: Array.from({ length: 10 }, () => '지원자 미리보기') },
    { id: 2, title: '진행중 공고 B', applicants: Array.from({ length: 6 }, () => '지원자 미리보기') },
  ];

  const closedPosts = [
    { id: 3, title: '마감 공고 X', applicants: Array.from({ length: 4 }, () => '지원자 미리보기') },
    { id: 4, title: '마감 공고 Y', applicants: Array.from({ length: 4 }, () => '지원자 미리보기') },
  ];

  const posts = activeTab === 'progress' ? progressPosts : closedPosts;

  useEffect(() => {
    setExpanded(new Array(posts.length).fill(false));
  }, [activeTab]);

  const toggleExpand = (index) => {
    setExpanded((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  return (
    <Container>
      <HeaderRow>
        <TabMenu>
          <Tab first active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
            진행중
          </Tab>
          <Tab last active={activeTab === 'closed'} onClick={() => setActiveTab('closed')}>
            마감
          </Tab>
        </TabMenu>
        <RegisterButton onClick={noticeProgress}>공고등록</RegisterButton>
      </HeaderRow>

      {posts.map((post, idx) => (
        <PostContainer key={post.id}>
          <PostHeader>
            <PostTitle>
              <input type="checkbox" />
              {post.title}
            </PostTitle>
            <ToggleButton onClick={() => toggleExpand(idx)}>▼</ToggleButton>
          </PostHeader>

          {expanded[idx] && post.applicants.length > 0 && (
            <ApplicantList>
              {post.applicants.map((a, i) => (
                <ApplicantItem key={i}>{a}</ApplicantItem>
              ))}
            </ApplicantList>
          )}
        </PostContainer>
      ))}
    </Container>
  );
};

export default CompanyMain;
