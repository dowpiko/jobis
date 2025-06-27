import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Page = styled.div`
  display: flex;
  height: 100%;
  background-color: #F8F9FA;
  color: #1F2A37;
  font-family: sans-serif;
  overflow: hidden;
  box-sizing: border-box;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #B0BCCB;
  border-radius: 6px;
  background-color: #F0F2F5;
`;

const FilterItem = styled.div`
  padding: 6px 10px;
  background-color: #E0E7EF;
  border-radius: 6px;
  font-size: 14px;
`;

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);  // 고정된 5열
  gap: 16px;
  overflow-y: auto;
  padding-bottom: 16px;
`;

const CompanyCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #B0BCCB;
  border-radius: 8px;
  padding: 12px;
  aspect-ratio: 4 / 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const LoadMoreWrapper = styled.div`
  text-align: center;
  margin-top: 8px;
`;

const LoadMoreButton = styled.button`
  padding: 8px 20px;
  font-size: 14px;
  background-color: #4376B6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const CompanyInfo = () => {
  const navigate = useNavigate();
  const applyNotice = () => navigate('/applyNotice');

  const allCompanies = Array.from({ length: 30 }, (_, idx) => ({
    id: idx + 1,
    name: `기업 이미지`,
    desc: `기업 설명`,
  }));

  const [visibleCount, setVisibleCount] = useState(6);
  const handleLoadMore = () => setVisibleCount(prev => prev + 3);

  return (
    <Page>
      <Content>
        <FilterSection>
          <SearchInput placeholder="기업 검색..." />
          <FilterItem>필터 1</FilterItem>
          <FilterItem>필터 2</FilterItem>
          <FilterItem>필터 3</FilterItem>
          <FilterItem>필터 4</FilterItem>
        </FilterSection>

        <Grid>
          {allCompanies.slice(0, visibleCount).map(company => (
            <CompanyCard key={company.id} onClick={applyNotice}>
              <div>{company.name}</div>
              <div>{company.desc}</div>
            </CompanyCard>
          ))}
        </Grid>

        {visibleCount < allCompanies.length && (
          <LoadMoreWrapper>
            <LoadMoreButton onClick={handleLoadMore}>더보기</LoadMoreButton>
          </LoadMoreWrapper>
        )}
      </Content>
    </Page>
  );
};

export default CompanyInfo;
