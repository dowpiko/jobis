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
  background-color: ${(props) => (props.$active ? '#4376B6' : 'transparent')};
  color: ${(props) => (props.$active ? 'white' : '#1F2A37')};
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    background-color: ${(props) => (props.$active ? '#5C8BC4' : '#DDE5F1')};
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
const CancelButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background-color: #4376B6;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const AppliedItem = styled(ListItem)`
  position: relative;
`;
  // 탭 분리
  const ScrapItem = ({ item, onApply, onRemove }) => {
    return (
      <ListItem style={{ position: 'relative', cursor: 'pointer' }}>
        <div onClick={() => onApply(item.ono)}>
          <div>기업명: {item.corpName || '없음'}</div>
          <div>제목: {item.title || '없음'}</div>
          <div>태그: {item.category || '없음'}</div>
        </div>
        <CancelButton
          onClick={(e) => {
            e.stopPropagation();  // 카드 클릭해서 지원하겠냐고 confirm 방지
            onRemove(item.ono);
          }}
        >
          스크랩 취소
        </CancelButton>
      </ListItem>
    );
  };


const ScrapPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scrap');
  const [uno, setUno] = useState(null);
  const [scrapData, setScrapData] = useState([]);
  const [appliedData, setAppliedData] = useState([]);
  const host = process.env.REACT_APP_HOST;

  const fetchScrapData = async (uno) => {
    if (!uno) return;
    try {
      const res = await axios.post(
        `http://${host}:9090/offers/getFavorites`,
        { uno },
        { withCredentials: true }
      );
      setScrapData(res.data);
    } catch (err) {
      console.error('스크랩 목록 조회 실패', err);
    }
  };

  const fetchAppliedData = async (uno) => {
    if (!uno) return;
    try {
      const res = await axios.post(
        `http://${host}:9090/user/getApplied`,
        { uno },
        { withCredentials: true }
      );
      setAppliedData(res.data);
    } catch (err) {
      console.error('지원 목록 조회 실패', err);
    }
  };

  // uno 가져오기
  useEffect(() => {
    axios.get(`http://${host}:9090/user/getMyUno`, {
      withCredentials: true
    })
    .then((res) => {
      setUno(res.data);
    })
    .catch((err) => {
      console.error('❌ getMyUno 요청 실패:', err);
    });
  }, []);
  
  // 스크랩 목록 가져오기
  useEffect(() => {
    fetchScrapData(uno);
    fetchAppliedData(uno);
  }, [uno]);

  const data = activeTab === 'scrap' ? scrapData : appliedData;

   const handleItemClick = (ono) => {
    if (window.confirm('스크랩한 공고를 지원하시겠습니까?')) {
      navigate('/applyNotice', { state: { ono } });
    } else {
      return;
    }
  };

  // 스크랩 취소하기
  const handleUnScrap = (ono) => {
    axios.delete(`http://${host}:9090/user/removeFavorite`, {
      data: { uno, ono },
      withCredentials: true
    })
      .then(() => {
        setScrapData(prev => prev.filter(item => item.ono !== ono));
        alert('스크랩이 취소되었습니다.');
      })
      .catch(err => console.error('스크랩 취소 실패', err));
  };

  // 지원한 공고 목록 가져오기
  useEffect(() => {
    if (!uno) return;
    axios.post(`http://${host}:9090/user/getApplied`, { uno }, { withCredentials: true })
      .then((res) => {
        setAppliedData(res.data);
      })
      .catch((err) => console.error('지원 목록 조회 실패', err));
  }, [uno]);

  // 공고 지원 취소하기
  const handleCancel = (uno, ono) => {
    axios.post(`http://${host}:9090/user/deleteSubmission`, { uno, ono }, { withCredentials: true })
      .then(() => {
        fetchScrapData(uno);
        fetchAppliedData(uno);
        alert('지원이 취소되었습니다.');
      })
      .catch((err) => console.error('지원 취소 실패', err));
    };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <Page>
      <Title>스크랩 / 지원</Title>

      <TabMenu>
        <Tab
          $active={activeTab === 'scrap'}
          onClick={() => setActiveTab('scrap')}
        >
          스크랩 ({scrapData.length})
        </Tab>
        <Tab
          $active={activeTab === 'applied'}
          onClick={() => setActiveTab('applied')}
        >
          지원 ({appliedData.length})
        </Tab>
      </TabMenu>

      {activeTab === 'scrap' ? (
        scrapData.length > 0 ? (
          <List>
            {scrapData.map((item, idx) => (
              <ScrapItem key={idx} item={item} onApply={handleItemClick} onRemove={handleUnScrap}/>
            ))}
          </List>
        ) : (
          <EmptyMessage>스크랩한 공고가 없습니다.</EmptyMessage>
        )
      ) : (
        appliedData.length > 0 ? (
          <List>
            {appliedData.map((item, idx) => (
              <AppliedItem  key={idx}>
                <div>기업명: {item.corpName || '없음'}</div>
                <div>제목: {item.o_title || '없음'}</div>
                <div>태그: {item.o_tag || '없음'}</div>
                <CancelButton 
                  onClick={() => handleCancel(item.uno, item.ono)}
                  style={{ marginTop: '10px' }}
                >
                  지원 취소
                </CancelButton>
              </AppliedItem>
            ))}
          </List>
        ) : (
          <EmptyMessage>지원한 기업이 없습니다.</EmptyMessage>
        )
      )}
    </Page>
  );
};

export default ScrapPage;
