import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import categories from '../../data/categories';  // 카테고리 데이터 임포트
import axios from 'axios';


const ListSection = styled.div`
  flex: 1;               /* 필터 & 카테고리 아래 남은 공간 전부 차지 */
  display: flex;
  flex-direction: column;
  overflow-y: auto;      /* 이 영역만 세로 스크롤 발생 */
  padding-bottom: 16px;  /* 버튼 안 가리게 여유 */
`;
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
`;

/* 검색창 섹션 */
const FilterSection = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #D1DAE4;
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

/* 카테고리 메뉴 섹션: 줄바꿈 허용 및 버튼 크기 축소 */
const CategorySection = styled.div`
  display: flex;  
  flex-wrap: wrap;         /* 줄이 부족하면 다음 줄로 자동 배치 */
  gap: 6px;                /* 버튼 간격 소폭 축소 */
  margin-bottom: 16px;
`;

/* 개별 카테고리 버튼: 글자 및 패딩 축소, 모서리 둥글게 */
const MenuItem = styled.button`
  background-color: #E0E7EF;
  color: #4376B6;
  font-size: 12px;         /* 글자 크기 축소 */
  padding: 4px 8px;        /* 패딩 축소 */
  border-radius: 16px;     /* 모서리 둥글게 소폭 축소 */
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: #D0D6DE;
  }
`;

/* ── 기존 카드 레이아웃 ── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 330px;
  gap: 16px;
`;

const CompanyCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #D1DAE4;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const CardImageWrapper = styled.div`
  width: 100%;
  height: 100px;
  overflow: hidden;
  background-color: #E0E0E0;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: space-between;
`;

const CorpName = styled.h3`
  font-size: 14px;
  margin: 8px 0 4px;
  color: #1F2A37;
`;

const CategoryBadge = styled.span`
  background-color: #E0E7EF;
  color: #4376B6;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-bottom: 8px;
`;

const PostingName = styled.p`
  font-size: 13px;
  color: #576674;
  margin: 0;
  text-align: center;
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
  // const applyNotice = () => navigate('/applyNotice');
  const [offers, setOffers]             = useState([]);        
  const [searchTerm, setSearchTerm]     = useState('');        
  const [selectedCategory, setCategory] = useState('');        
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    axios.get('/getCompanyOffer')
      .then(res => setOffers(res.data))
      .catch(err => console.error('공고 조회 실패', err));
  }, []);

  const filtered = useMemo(() => {
    return offers.filter(o =>
      // 카테고리 필터
      (!selectedCategory || o.category === selectedCategory)
      &&
      // 검색어 필터 (법인명 or 공고명)
      (!searchTerm
        || o.corpName.toLowerCase().includes(searchTerm.toLowerCase())
        || o.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [offers, selectedCategory, searchTerm]);

  const visible = filtered.slice(0, visibleCount);
  const onSearchChange = e => {
    setSearchTerm(e.target.value);
    setVisibleCount(10);   // 검색어 바뀌면 다시 첫 페이지
  };
  const onCategoryClick = cat => {
    setCategory(prev => prev === cat ? '' : cat);
    setVisibleCount(10);   // 카테고리 바뀌면 다시 첫 페이지
  };
  const handleLoadMore = () => {
    setVisibleCount(v => v + 5);
  };
  



  return (
    <Page>
      <Content>
        {/* 검색창 */}
        <FilterSection>
          <SearchInput placeholder="기업 검색..." value={searchTerm} onChange={onSearchChange} />
        </FilterSection>

        {/* 카테고리 필터 메뉴 */}
        <CategorySection>
          {categories.map(cat => (
            <MenuItem key={cat.category} active={selectedCategory === cat.category} onClick={() => onCategoryClick(cat.category)}>
              🛠️ {cat.category}
            </MenuItem>
          ))}
        </CategorySection>

        {/* 기업 카드 그리드 */}
        <ListSection>
          <Grid>
            {visible.map(o => (
              <CompanyCard key={o.ono} onClick={() => navigate(`/applyNotice`)}>   {/* /${o.ono} */}
                <CardImageWrapper>
                  <CardImage src={o.profileImage} />
                </CardImageWrapper>
                <CardContent>
                  <CorpName>{o.corpName}</CorpName>
                  <CategoryBadge>{o.category}</CategoryBadge>
                  <PostingName>{o.title}</PostingName>
                </CardContent>
              </CompanyCard>
            ))}
          </Grid>
        
          {/* 더보기 버튼 */}
          {visible.length < filtered.length && (
            <LoadMoreWrapper>
              <LoadMoreButton onClick={handleLoadMore}>
                더보기
              </LoadMoreButton>
            </LoadMoreWrapper>
          )}
        </ListSection>
      </Content>
    </Page>
  );
};

export default CompanyInfo;
