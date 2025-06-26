import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;

const TabMenu = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${(props) => (props.active ? '#d9d9d9' : '#eaeaea')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;
  border-radius: ${(props) =>
    props.first ? '6px 0 0 0' : props.last ? '0 6px 0 0' : '0'};
`;

const PostContainer = styled.div`
  background-color: #ddd;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 6px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Checkbox = styled.input`
  margin-right: 12px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ApplicantList = styled.div`
  margin-top: 12px;
  border: 1px solid #c1dbe6;
  border-radius: 4px;
  overflow: hidden;
`;

const ApplicantItem = styled.div`
  background-color: #e6f0f5;
  color: #333;
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #c1dbe6;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #d4eaf4;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
`;

const RegisterButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  background-color: #ccc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Test14 = () => {
  const [activeTab, setActiveTab] = useState('progress');
  const [expanded, setExpanded] = useState([]);

  const progressPosts = [
    {
      id: 1,
      title: '진행중 공고 A',
      applicants: Array.from({ length: 10 }, () => '지원자 미리보기'),
    },
    {
      id: 2,
      title: '진행중 공고 B',
      applicants: Array.from({ length: 6 }, () => '지원자 미리보기'),
    },
  ];

  const closedPosts = [
    {
      id: 3,
      title: '마감 공고 X',
      applicants: Array.from({ length: 4 }, () => '지원자 미리보기'),
    },
    {
      id: 4,
      title: '마감 공고 Y',
      applicants: Array.from({ length: 4 }, () => '지원자 미리보기'),
    },
  ];

  // 현재 탭에 따라 보여줄 포스트 리스트 결정
  const posts = activeTab === 'progress' ? progressPosts : closedPosts;

  // 탭이 변경될 때 expanded 상태 초기화
  useEffect(() => {
    setExpanded(new Array(posts.length).fill(false));
  }, [activeTab]);

  const toggleExpand = (index) => {
    setExpanded((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <Container>
      <HeaderRow>
        <TabMenu>
          <Tab
            first
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          >
            진행중
          </Tab>
          <Tab
            last
            active={activeTab === 'closed'}
            onClick={() => setActiveTab('closed')}
          >
            마감
          </Tab>
        </TabMenu>
        <RegisterButton>공고등록</RegisterButton>
      </HeaderRow>

      {posts.map((post, idx) => (
        <PostContainer key={post.id}>
          <PostHeader>
            <PostTitle>
              <Checkbox type="checkbox" />
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

export default Test14;
