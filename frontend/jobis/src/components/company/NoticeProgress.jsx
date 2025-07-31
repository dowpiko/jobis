import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import categories from '../../data/categories'; // 🔹 직무 데이터
import axios from 'axios';

const Container = styled.div`
  flex-grow: 1;
  max-width: 600px;
  padding: 30px 20px 60px;
  margin: 0 auto;
  background-color: #f8f9fa;
  position: relative;
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #1f2a37;
  margin-bottom: 24px;
  text-align: center;
`;

const QuestionListWrapper = styled.div`
  height: 307px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b0bccb;
    border-radius: 3px;
  }
`;

const QuestionGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 16px;
  display: block;
  margin-bottom: 6px;
  color: #1f2a37;
`;

const Input = styled.input`
  width: 100%;
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #b0bccb;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;

  &:hover {
    border-color: #5c8bc4;
    background-color: #f0f4f8;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 36px;
  margin-bottom: 16px;
  padding: 6px 10px;
  border: 1px solid #b0bccb;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;

  &:hover {
    border-color: #5c8bc4;
    background-color: #f0f4f8;
  }
`;

const AddButton = styled.button`
  background-color: #5c8bc4;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4376b6;
  }
`;

const SubmitButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  padding: 10px 28px;
  font-size: 16px;
  background-color: #4376b6;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5c8bc4;
  }
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;
const host = process.env.REACT_APP_HOST;
const NoticeProgress = () => {
  const navigate = useNavigate();
  const [o_title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [o_content, setContent] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [myUno, setMyUno] = useState('');

  // 시작 날짜
  const [startDate] = useState(() => {
    const today = new Date();
      return today.toISOString().split('T')[0];
    });

  // 종료 날짜
  const [o_activedays, setO_activedays] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString().split('T')[0];
  });

  // date max 값 계산용
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  // date min 값 계산용
  const minEndDate = new Date();
  minEndDate.setDate(minEndDate.getDate() + 5);
  const minEndDateStr = minEndDate.toISOString().split('T')[0];

  const subCategories = category ? categories.find((cat) => cat.category === category)?.subCategories || [] : [];

  useEffect(() => {
    if (o_title.trim() === '' && category && subCategory) {
      setTitle(`${category}(${subCategory})`);
    }
  }, [category, subCategory]);
  
  useEffect(() => {
    axios.get(`http://${host}:9090/user/getUser`, {withCredentials:true})
      .then(res => {
        if (res.data){
          setMyUno(res.data.uno);
          }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });    
  }, []);


  // 질문 추가
  const handleChange = (i, v) => {
    const arr = [...o_content];
    arr[i] = v;
    setContent(arr);
  };

  const handleAdd = () => {
    if (o_content.length < 15) setContent([...o_content, '']);
  };

  // 질문 등록
  const handleSubmit = async () => {
    if (isLoading) return;

    if (!o_title.trim()) return alert('제목을 입력하세요.');
    if (!category) return alert('대분류를 선택하세요.');
    if (!subCategory) return alert('세부분류를 선택하세요.');
    const o_tag = `${category} (${subCategory})`;

    const cleanedContent = o_content.filter(item => item && item.trim() !== '').join('\n');
    
    const payload = {
      o_title,
      o_tag,
      o_content: cleanedContent,
      o_activedays,
      uno : myUno
    };

    setIsLoading(true);

    try {
      const res = await axios.post(`http://${host}:9090/offers/insertInterView`, payload);

      if (res.status === 200) {
        alert("면접 등록 성공");
        navigate('/companyMain');
      } else {
        alert("면접 등록 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 접속 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>면접 질문 등록</Title>

      <Label>제목</Label>
      <Input
        type="text"
        placeholder="면접 제목 입력"
        value={o_title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '16px' }}
        onBlur={() => {
          if (o_title.trim() === '' && category && subCategory) {
            setTitle(`${category}(${subCategory})`);
          }
        }}
      />

      <Label>대분류</Label>
      <Select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubCategory('');
        }}
      >
        <option value="">-- 직군 선택 --</option>
        {categories.map((cat) => (
          <option key={cat.category} value={cat.category}>
            {cat.category}
          </option>
        ))}
      </Select>

      {category && (
        <>
          <Label>세부분류</Label>
          <Select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">-- 세부분류 선택 --</option>
            {subCategories.map((sub) => (
              <option key={sub.name} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </Select>
        </>
      )}

      <Label>진행 기간 (5일 ~ 14일)</Label>
      <FlexRow>
        <Input type="date" value={startDate} disabled />
        <span>~</span>
        <Input
          type="date"
          value={o_activedays}
          min={minEndDateStr}
          max={maxDateStr}
          onChange={(e) => setO_activedays(e.target.value)}
        />
      </FlexRow>

      <QuestionListWrapper>
        {o_content.map((q, idx) => (
          <QuestionGroup key={idx}>
            <Label>Q. {idx + 1}</Label>
            <Input
              type="text"
              value={q}
              onChange={(e) => handleChange(idx, e.target.value)}
            />
          </QuestionGroup>
        ))}
      </QuestionListWrapper>

      {o_content.length < 15 && (
        <AddButton onClick={handleAdd}>+ 질문 추가 (최대 15개)</AddButton>
      )}

      <SubmitButton onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '등록 중...' : '등록'}
      </SubmitButton>
    </Container>
  );
};

export default NoticeProgress;
