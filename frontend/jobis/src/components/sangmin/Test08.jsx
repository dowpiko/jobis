import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  gap: 30px;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background-color: #ddd;
  padding: 20px;
  border-radius: 6px;
  height: fit-content;
  position: sticky;
  top: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 14px;
  font-size: 14px;
`;

const FilterItem = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
`;

const Content = styled.main`
  flex: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 정확히 3개씩
  gap: 20px;
`;

const CompanyCard = styled.div`
  background-color: #d9d9d9;
  aspect-ratio: 1 / 1.2; // 가로:세로 비율 유지 (예: 5:6 비율)
  padding: 20px;
  text-align: center;
  font-size: 14px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoadMoreWrapper = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const LoadMoreButton = styled.button`
  padding: 10px 30px;
  font-size: 14px;
  background-color: #d9d9d9;
  border: none;
  cursor: pointer;
`;

const Test08 = () => {
  const allCompanies = Array.from({ length: 30 }, (_, idx) => ({
    id: idx + 1,
    name: `기업 이미지`,
    desc: `기업 설명`,
  }));

  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <Wrapper>
      <Sidebar>
        <SearchInput placeholder="Hinted search text" />
        <FilterItem>필터 1</FilterItem>
        <FilterItem>필터 2</FilterItem>
        <FilterItem>필터 3</FilterItem>
        <FilterItem>필터 4</FilterItem>
      </Sidebar>

      <Content>
        <Grid>
          {allCompanies.slice(0, visibleCount).map((company) => (
            <CompanyCard key={company.id}>
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
    </Wrapper>
  );
};

export default Test08;
