import React from 'react';
import styled from 'styled-components';
import RadarSection from './RadarSection';
import LineChartSection from './LineChartSection';

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Test12 = () => (
  <Container>
    <RadarSection />
    <LineChartSection />
  </Container>
);

export default Test12;
