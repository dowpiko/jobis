import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const ScrapPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scrap');
  const [uno, setUno] = useState(null);
  const [scrapData, setScrapData] = useState([]);
  const [appliedData, setAppliedData] = useState([]); // 지원 목록 필요시 나중에

  // uno 가져오기
  useEffect(() => {
    fetch('/getMyUno', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setUno(data);
      });
  }, []);

  // 스크랩 목록 가져오기
  useEffect(() => {
    if (!uno) return;
    axios.post('/getFavorites', { uno }, { withCredentials: true })
      .then((res) => {
        console.log('스크랩 응답:', res.data);
        setScrapData(res.data);
      })
      .catch((err) => console.error('스크랩 목록 조회 실패', err));
  }, [uno]);

  const data = activeTab === 'scrap' ? scrapData : appliedData;


   const handleItemClick = (ono) => {
    if (window.confirm('스크랩한 공고를 지원하시겠습니까?')) {
      navigate('/applyNotice', { state: { ono } });
    } else {
      return;
    }
  };

  return (
    <Page>
      <Title>스크랩 / 지원</Title>

      <TabMenu>
        <Tab
          active={activeTab === 'scrap'}
          onClick={() => setActiveTab('scrap')}
        >
          스크랩 ({scrapData.length})
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
          {data.map((item, idx) => (
            <ListItem key={idx}  onClick={() => handleItemClick(item.ono)} style={{ cursor: 'pointer' }}>
              <div>기업명: {item.corpName || '없음'}</div>
              <div>제목: {item.title || '없음'}</div>
              <div>태그: {item.category || '없음'}</div>
            </ListItem>
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

export default ScrapPage;
