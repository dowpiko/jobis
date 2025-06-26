import React from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Box = styled.div`
  background-color: #ddd;
  padding: 20px;
  border-radius: 8px;
`;

const lineData = [
  { date: '6/1', score: 78 },
  { date: '6/2', score: 66 },
  { date: '6/3', score: 90 },
  { date: '6/4', score: 64 },
  { date: '6/5', score: 80 },
  { date: '6/6', score: 75 },
  { date: '6/7', score: 88 },
  { date: '6/8', score: 79 },
  { date: '6/9', score: 78 },
];

const LineChartSection = () => (
  <Box>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={lineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" label={{ value: '날짜', position: 'insideBottomRight', offset: -5 }} />
        <YAxis label={{ value: '점수', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#333" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </Box>
);

export default LineChartSection;
