import React, { useState } from 'react';
import styled from 'styled-components';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const Container = styled.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  padding: 20px;
  background-color: #f8f9fa;
  box-sizing: border-box;
`;

const ChartBox = styled.div`
  flex: 1;
  background-color: #e0e7ef;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  svg {
    outline: none;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  background-color: #f0f2f5;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #b0bccb;
`;

const InfoTitle = styled.h4`
  margin-bottom: 10px;
  font-size: 18px;
  color: #1f2a37;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const radarData = [
  { subject: '리더형', A: 120 },
  { subject: '분석형', A: 98 },
  { subject: '창의형', A: 86 },
  { subject: '실행형', A: 99 },
  { subject: '소통형', A: 85 },
];

const descriptions = {
  '리더형': '리더십이 뛰어나고 조직을 잘 이끎',
  '분석형': '논리적이고 데이터 분석을 잘함',
  '창의형': '새로운 아이디어를 제시함',
  '실행형': '계획을 실천에 옮기는 능력이 뛰어남',
  '소통형': '사람들과 잘 어울리며 소통 능력이 뛰어남',
};

const RadarSection = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleRadarClick = (e) => {
    if (e?.activeLabel) setSelectedSubject(e.activeLabel);
  };

  return (
    <Container>
      <ChartBox>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="80%"
            data={radarData}
            onClick={handleRadarClick}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
            <PolarRadiusAxis stroke="#b0bccb" />
            <Radar
              name="형 지표"
              dataKey="A"
              stroke="#4376B6"
              fill="#5C8BC4"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartBox>

      <InfoBox>
        <InfoTitle>
          {selectedSubject ?? '클릭 시 표현'}
        </InfoTitle>
        <InfoText>
          {selectedSubject
            ? descriptions[selectedSubject]
            : '형을 클릭하면 설명이 표시됩니다.'}
        </InfoText>
      </InfoBox>
      <div> 나중에 진행한 모든 ai면접의 평균점수를 그래프로</div>
    </Container>
  );
};

export default RadarSection;
