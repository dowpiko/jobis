import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Page = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: #F8F9FA;
  box-sizing: border-box;
  font-family: sans-serif;
  color: #1F2A37;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Divider = styled.div`
  width: 1px;
  background-color: #B0BCCB;
  margin: 0 10px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 20px;
  color: #4376B6;
`;

const CalendarContainer = styled.div`
  flex: 1;
  background-color: #fff;
  border: 1px solid #B0BCCB;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;

  .react-calendar {
    width: 100%;
    border: none;
  }
`;

const ScheduleList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ScheduleItem = styled.div`
  background-color: #ffffff;
  border: 1px solid #B0BCCB;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #F0F2F5;
  }
`;

const CancelButton = styled.button`
  background-color: #ec5757;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #d04040;
  }
`;

function ScheduleManager() {
  const navigate = useNavigate();
  const gotoDiscord = () => navigate('/discordPage');
  const [date, setDate] = useState(new Date());

  return (
    <Page>
      <Container>
        <Section>
          <SectionTitle>날짜 관리</SectionTitle>
          <CalendarContainer>
            <Calendar onChange={setDate} value={date} />
          </CalendarContainer>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>일정 관리</SectionTitle>
          <ScheduleList>
            {[1, 2, 3, 4].map(item => (
              <ScheduleItem key={item} onClick={gotoDiscord}>
                <span>2025년 7월 {item}일 {10 + item}시 모의 면접</span>
                <CancelButton>취소</CancelButton>
              </ScheduleItem>
            ))}
          </ScheduleList>
        </Section>
      </Container>
    </Page>
  );
}

export default ScheduleManager;
