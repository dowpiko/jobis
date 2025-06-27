import React, { useState } from 'react';
import styled from 'styled-components';

const Page = styled.div`
  flex-grow: 1;
  padding: 40px;
  background-color: #F8F9FA;
  font-family: sans-serif;
  color: #1F2A37;
  height: 100%;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 24px;
  color: #4376B6;
`;

const TabMenu = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 24px;
  background-color: #E0E7EF;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  background-color: ${(props) => (props.active ? '#4376B6' : 'transparent')};
  color: ${(props) => (props.active ? 'white' : '#1F2A37')};
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: ${(props) => (props.active ? '#5C8BC4' : '#DDE5F1')};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.div`
  background-color: #ffffff;
  border: 1px solid #B0BCCB;
  border-radius: 6px;
  padding: 16px;
  font-size: 15px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 15px;
  color: #6B7280;
`;

const Test13 = () => {
  const [activeTab, setActiveTab] = useState('scrap');

  const scrapData = []; // 예시
  const appliedData = []; // 예시

  const data = activeTab === 'scrap' ? scrapData : appliedData;

  return (
    <Page>
      <Title>스크랩 / 지원</Title>

      <TabMenu>
        <Tab
          active={activeTab === 'scrap'}
          onClick={() => setActiveTab('scrap')}
        >
          스크랩(n)
        </Tab>
        <Tab
          active={activeTab === 'applied'}
          onClick={() => setActiveTab('applied')}
        >
          지원
        </Tab>
      </TabMenu>

      {data.length > 0 ? (
        <List>
          {data.map((_, idx) => (
            <ListItem key={idx}>리스트 아이템 {idx + 1}</ListItem>
          ))}
        </List>
      ) : (
        <EmptyMessage>
          {activeTab === 'scrap'
            ? '스크랩한 공고가 없습니다.'
            : '지원한 기업이 없습니다.'}
        </EmptyMessage>
      )}
    </Page>
  );
};

export default Test13;
