import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
`;

const TabMenu = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${(props) => (props.active ? '#d9d9d9' : '#f1f1f1')};
  color: #333;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
  cursor: pointer;

  &:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ListItem = styled.div`
  background-color: #e3f2f2;
  height: 48px;
  border-radius: 6px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #777;
  font-size: 15px;
`;

const Test13 = () => {
  const [activeTab, setActiveTab] = useState('scrap');

  const scrapData = []; // 빈 배열로 테스트
  const appliedData = []; // 빈 배열로 테스트

  const data = activeTab === 'scrap' ? scrapData : appliedData;

  return (
    <Container>
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
            <ListItem key={idx} />
          ))}
        </List>
      ) : (
        <EmptyMessage>
          {activeTab === 'scrap'
            ? '스크랩한 공고가 없습니다.'
            : '지원한 기업이 없습니다.'}
        </EmptyMessage>
      )}
    </Container>
  );
};

export default Test13;
