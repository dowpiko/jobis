import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const GlobalStyles = createGlobalStyle`
  .fc-event-hover {
    background-color: #90C4EB !important;
    cursor: pointer !important;
  }
  .fc-event-past {
    background-color: #E0E0E0 !important;
    color: #666 !important;
  }
  .fc-event-hover .fc-event-title {
    color: #000000 !important;
  }
`;

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
`;

const ScheduleList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 800px;
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

const ScheduleItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusText = styled.span`
  font-size: 12px;
  color: ${(props) => (props.isLeader ? '#4376B6' : 'green')};
  white-space: nowrap;
`;

const CancelButton = styled.button`
  background-color: #ec5757;
  color: white;
  border: none;
  padding: 4px 8px;
  width: 60px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #d04040;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const CloseButton = styled.button`
  background-color: #ccc;
  border: none;
  padding: 8px 12px;
  margin-top: 16px;
  border-radius: 6px;
  cursor: pointer;
`;

function ScheduleManager() {
  const [events, setEvents] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [myUno, setMyUno] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetch('/getMyUno', { credentials: 'include' })
      .then(res => res.json())
      .then(setMyUno)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!myUno) return;
    fetch('/getUserChat', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const parsed = data.map(chat => ({
          ...chat,
          sch_date: new Date(chat.sch_date),
        }));
        setChatList(parsed);
      });
  }, [myUno]);

  useEffect(() => {
    if (!myUno || chatList.length === 0) return;

    const mySchedule = chatList.filter(
      chat => chat.leader === myUno || chat.member === myUno
    );
    mySchedule.sort((a, b) => new Date(a.sch_date) - new Date(b.sch_date));

    const calendarFormatted = mySchedule.map(chat => ({
      title: chat.r_title,
      date: chat.sch_date.toISOString().split('T')[0],
      extendedProps: {
        leaderUno: chat.leader,
        leaderName: chat.leader_name,
        memberUno: chat.member,
        memberName: chat.member_name,
        fullDate: chat.sch_date,
        cno: chat.cno,
      },
    }));

    setEvents(calendarFormatted);
    setScheduleData(calendarFormatted);
  }, [myUno, chatList]);

  const handleEventClick = (clickInfo) => {
    const { title, startStr, extendedProps } = clickInfo.event;
    setModalData({
      date: startStr,
      title,
      leaderName: extendedProps.leaderName,
      memberName: extendedProps.memberName,
    });
  };

  const handleMouseEnter = (info) => {
    info.el.classList.add('fc-event-hover');
  };

  const handleMouseLeave = (info) => {
    info.el.classList.remove('fc-event-hover');
  };

  const handleDelete = (event) => {
    if (!window.confirm('모의 채팅 일정을 삭제하시겠습니까?')) return;

    const cno = event.extendedProps?.cno;

    if (!cno) {
      alert('❌ 면접방 번호(cno)를 찾을 수 없습니다.');
      return;
    }

    fetch(`/deleteUserChat?cno=${cno}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 200) return res.text();
        throw new Error('삭제 실패');
      })
      .then(() => {
        alert('✅ 일정이 삭제되었습니다.');
        fetch('/getUserChat', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            const parsed = data.map(chat => ({
              ...chat,
              sch_date: new Date(chat.sch_date),
            }));
            setChatList(parsed);
          });
      })
      .catch(err => {
        console.error(err);
        alert('⚠ 삭제 중 오류가 발생했습니다.');
      });
  };

  return (
    <>
      <GlobalStyles />
      <Page>
        <Container>
          <Section>
            <SectionTitle>날짜 관리</SectionTitle>
            <CalendarContainer>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                events={events}
                dateClick={(info) => console.log('선택한 날짜:', info.dateStr)}
                eventClick={handleEventClick}
                eventMouseEnter={handleMouseEnter}
                eventMouseLeave={handleMouseLeave}
                datesSet={(info) => {
                  const centerDate = info.view.currentStart;
                  setCurrentMonth(centerDate.getMonth());
                }}
                eventDidMount={(info) => {
                  const eventDate = info.event.start;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  if (eventDate < today) {
                    info.el.classList.add('fc-event-past');
                  }
                }}
                height="auto"
              />
            </CalendarContainer>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>일정 관리</SectionTitle>
            <ScheduleList>
              {scheduleData
                .filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getMonth() === currentMonth;
                  // const today = new Date();
                  // today.setHours(0, 0, 0, 0);
                  // return eventDate >= today;
                })
                .map((event, idx) => {
                  const dateStr = new Date(event.date).toISOString().split('T')[0];
                  const isLeader = event.extendedProps.leaderUno === myUno;

                  return (
                    <ScheduleItem
                      key={idx}
                      onClick={() =>
                        setModalData({
                          date: dateStr,
                          title: event.title,
                          leaderName: event.extendedProps.leaderName,
                          memberName: event.extendedProps.memberName,
                        })
                      }
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                        <div>
                          <div>
                            {new Date(event.date).getFullYear()}년{' '}
                            {new Date(event.date).getMonth() + 1}월{' '}
                            {new Date(event.date).getDate()}일 | {event.title}
                          </div>
                        </div>
                        <ScheduleItemContent>
                          <StatusText isLeader={isLeader}>
                            {isLeader ? '👑 내가 만든 일정' : '🤝 참여한 일정'}
                          </StatusText>
                          <CancelButton onClick={(e) => { e.stopPropagation(); handleDelete(event); }}>
                            취소
                          </CancelButton>
                        </ScheduleItemContent>
                      </div>
                    </ScheduleItem>
                  );
                })}
            </ScheduleList>
          </Section>
        </Container>

        {modalData && (
          <ModalOverlay onClick={() => setModalData(null)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>{modalData.title}</h3>
              <p>📅 날짜: {modalData.date}</p>
              <p>👤 리더: {modalData.leaderName}</p>
              <p>🤝 멤버: {modalData.memberName || '없음'}</p>
              <CloseButton onClick={() => setModalData(null)}>닫기</CloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </Page>
    </>
  );
}

export default ScheduleManager;
