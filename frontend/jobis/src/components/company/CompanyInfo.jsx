import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import categories from '../../data/categories';  // 카테고리 데이터 import
import CompanyModal from '../modal/CompanyModal';
import axios from 'axios';

const ScrapButton = styled.button`
  position: absolute;
  top: 8px;
  left: 10px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 25px;
  line-height: 1;
  color: ${({ active }) => active ? '#FFD700' : '#B0BCCB'};
  cursor: pointer;
  opacity: ${({ active }) => active ? 1 : 0};    /* 스크랩 된 카드만 상시 표시 */
  transition: opacity 0.2s;
  z-index: 1;
`;

const ListSection = styled.div`
  flex: 1;               /* 필터 & 카테고리 아래 남은 공간 전부 차지 */
  display: flex;
  flex-direction: column;
  overflow-y: auto;      /* 이 영역만 세로 스크롤 발생 */
  padding-bottom: 10px;  /* 버튼 안 가리게 여유 */
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
  font-size: 14.1px;         /* 글자 크기 축소 */
  padding: 4px 8.5px;        /* 패딩 축소 */
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
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  &:hover ${ScrapButton} {
    opacity: 1;
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

const DateLabel = styled.div`
  font-size: 15px;
  color: #666;
  align-self: flex-end;   /* 우측 정렬 */
  margin-top: 4px;
`;

const CompanyInfo = () => {
  const navigate = useNavigate();
  const [offers, setOffers]             = useState([]);        
  const [searchTerm, setSearchTerm]     = useState('');        
  const [selectedCategory, setCategory] = useState('');        
  const [visibleCount, setVisibleCount] = useState(10);
  const [uno,setUno] =useState(null);
  const [favorite,setFavorite] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const host = process.env.REACT_APP_HOST;
  const [profileUrl, setProfileUrl] = useState('/img/user.svg');
  

  useEffect(() => {
    axios.get(`http://${host}:9090/user/getMyUno`, {withCredentials: true})
    .then(res => {
      setUno(res.data);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        alert('로그인이 필요합니다.');
        window.location.href = '/';
      } else {
        console.error('getMyUno 요청 실패:', err);
      }
    });
  }, []);

  useEffect(() => {
    axios.get(`http://${host}:9090/offers/getCompanyOffer`)
      .then(res => setOffers(res.data))
      .catch(err => console.error('공고 조회 실패', err));
  }, []);

  useEffect(() => {
    if (uno) {
      axios.post(`http://${host}:9090/offers/getFavorites`, { uno }, { withCredentials: true })  // 🔄 수정됨
        .then(res => setFavorite(res.data.map(f => f.ono)))
        .catch(err => console.error('스크랩 목록 실패', err));
    }
  }, [uno]);

  const toggleFavorite = async (ono) => { // ✅ 추가됨
    if (!uno) return alert('로그인 정보 없음');
    const isFav = favorite.includes(ono);
    try {
      if (isFav) {
        await axios.delete(`http://${host}:9090/user/removeFavorite`, { data: { ono, uno } });
        setFavorite(favorite.filter(id => id !== ono));
      } else {
        await axios.post(`http://${host}:9090/user/addFavorite`, { ono, uno });
        setFavorite([...favorite, ono]);
      }
    } catch (err) {
      console.error('스크랩 처리 실패:', err);
    }
  };

  const filtered = useMemo(() => {
    return offers.filter(o =>
      // 카테고리 필터
      (!selectedCategory || o.category.includes(selectedCategory))
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
  const handleCardClick = (offer) => {
    console.log('선택한 기업정보 : ', offer)
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  // const handleCardClick = (ono) => {
  //   navigate('/applyNotice', { state: { ono } });
  // };

  const getDday = (timestamp) => {
    if (!timestamp) return '-';

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const target = new Date(timestamp);
    const today  = new Date();

    // 00:00 기준으로 맞춰서 순수 일수 차이 계산
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / MS_PER_DAY);

    if (diffDays > 0)  return `D-${diffDays}`;       // 미래
    if (diffDays === 0) return 'D-Day';             // 당일
    return `D+${Math.abs(diffDays)}`;               // 과거
  };

  useEffect(() => {
    if (!uno) return;

    const fileName = `${uno}.png`;
    const checkUrl = `/files/profile-list/UserCustom`;
    
    axios.get(checkUrl)
    .then(res => {
      const files = res.data?.files || [];
      const match = files.find(f => f.filename === fileName);
        if (match) {
          const urlWithCacheBypass = `${match.url}?t=${Date.now()}`;
          setProfileUrl(urlWithCacheBypass);
        } else {
          setProfileUrl('/img/user.svg');
        }
      })
      .catch(() => {
        setProfileUrl('/img/user.svg');
      });
    }, [uno]);
    
  return (
    <Page>
      <Content>
        {/* 검색창 */}
        <FilterSection>
          <SearchInput placeholder="기업 검색..." value={searchTerm} onChange={onSearchChange} />
        </FilterSection>

        <CategorySection>
          <MenuItem
            key="전체"
            active={selectedCategory === ''}
            onClick={() => onCategoryClick('')}
          >
            📋 전체
          </MenuItem>
          {categories.map(cat => (
            <MenuItem
              key={cat.category}
              active={selectedCategory === cat.category}
              onClick={() => onCategoryClick(cat.category)}
            >
              🛠️ {cat.category}
            </MenuItem>
          ))}
        </CategorySection>


        {/* 기업 카드 그리드 */}
        <ListSection>
          <Grid>
            {visible.map(o => (
              // <CompanyCard key={o.ono} onClick={() => handleCardClick(o.ono)}>  
              <CompanyCard key={o.ono} onClick={() => handleCardClick(o)}>  
                <CardImageWrapper>
                    <ScrapButton
                    active={favorite.includes(o.ono)}
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(o.ono);
                    }}
                  >
                    {favorite.includes(o.ono) ? '★' : '☆'}
                  </ScrapButton>
                  <CardImage src={`/profile/${(o.uno)}.png`} />
                </CardImageWrapper>
                <CardContent>
                  <CorpName>{o.corpName}</CorpName>
                  <CategoryBadge>{o.category}</CategoryBadge>
                  <PostingName>{o.title}</PostingName>
                  <DateLabel>{getDday(o.o_activedays)}</DateLabel>
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

          {/* 모달 */}
          {modalOpen && selectedOffer && (
            <CompanyModal
              offer={selectedOffer}
              onClose={() => setModalOpen(false)}
              onGoApply={() => {
                navigate('/applyNotice', { state: { ono: selectedOffer.ono } });
              }}
            />
          )}


        </ListSection>
      </Content>
    </Page>
  );
};

export default CompanyInfo;
