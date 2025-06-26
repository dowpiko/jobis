import React, { useState } from 'react';
import styled from 'styled-components';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const Box = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartBox = styled.div`
  flex: 1;
  background-color: #ddd;
  padding: 20px;
  border-radius: 8px;

  svg {
    outline: none;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  background-color: #ddd;
  padding: 20px;
  border-radius: 8px;
`;

const InfoTitle = styled.h4`
  margin-bottom: 10px;
`;

const InfoText = styled.div`
  font-size: 14px;
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
    <Box>
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
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar
              name="형 지표"
              dataKey="A"
              stroke="#333"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartBox>

      <InfoBox>
        <InfoTitle>
          {selectedSubject ? selectedSubject : '클릭 시 표현'}
        </InfoTitle>
        <InfoText>
          {selectedSubject
            ? descriptions[selectedSubject]
            : '형을 클릭하면 설명이 표시됩니다.'}
        </InfoText>
      </InfoBox>
    </Box>
  );
};

export default RadarSection;
