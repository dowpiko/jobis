import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 40px 0;
  font-family: sans-serif;
  color: #1F2A37;
  background-color: #F8F9FA;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SelectWrapper = styled.div`
  margin-bottom: 40px;
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #1F2A37;
`;

const Select = styled.select`
  padding: 10px 14px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid #B0BCCB;
  background-color: #ffffff;
  color: #1F2A37;
  width: 260px;

  &:focus {
    outline: none;
    border-color: #4376B6;
    box-shadow: 0 0 0 2px rgba(67, 118, 182, 0.2);
  }
`;

const CenterBoxWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CreateBox = styled.button`
  width: 300px;
  height: 300px;
  background-color: #4376B6;
  border: none;
  border-radius: 12px;
  font-size: 26px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #5C8BC4;
    transform: scale(1.03);
  }
`;

const AiInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedAno, setSelectedAno] = useState('');
  const navigate = useNavigate();

  const createAiInterview = () => {
    navigate('/createAiInterview');
  };
  useEffect(()=> {
    const fetchData = async () =>{
      try {
        const response = await axios.get("http://localhost:9090/ymj/getAllResults", {
          withCredentials: true
        });
        const res = response.data;
        setInterviews(res);
      } catch (error) {
        console.error("데이터 불러오기 실패 : ",error);
      }
    }
    fetchData();
  },[]);
  const handleSelectChange = (e) => {
    const selectedAno = e.target.value;
    setSelectedAno(selectedAno);
    const selectedInterview = interviews.find(item => item.ano.toString() === selectedAno);                               
    if (selectedInterview) {
      navigate("/chatHistory", {
        state: {
          content: selectedInterview.acontent,
          title: selectedInterview.atitle, // 👈 요거 추가
        }
      });
    }
  };
  return (
    <Container>
      <SelectWrapper>
        <Label>기록</Label>
        <Select value={selectedAno} onChange={handleSelectChange}>
          <option value="" disabled>--면접을 선택하세요--</option>
          {interviews.map((item) => (
            <option key={item.ano} value={item.ano}>
              {item.atitle}
            </option>
          ))}
        </Select>
      </SelectWrapper>

      <CenterBoxWrapper>
        <CreateBox onClick={createAiInterview}>생성</CreateBox>
      </CenterBoxWrapper>
    </Container>
  );
};

export default AiInterview;
