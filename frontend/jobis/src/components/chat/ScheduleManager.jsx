import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

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
const host = process.env.REACT_APP_HOST;
function ScheduleManager() {
  const [events, setEvents] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [myUno, setMyUno] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    axios.get(`http://${host}:9090/user/getMyUno`, {
      withCredentials: true
    })
    .then(res => {
      setMyUno(res.data);
    })
    .catch(err => {
      console.error('getMyUno 요청 실패:', err);
    });
  }, []);

  
  useEffect(() => {
    if (!myUno) return;

    axios.get(`http://${host}:9090/chat/getUserChat`, { withCredentials: true })
      .then(res => {
        const parsed = res.data.map(chat => ({
          ...chat,
          sch_date: new Date(chat.sch_date),
        }));
        setChatList(parsed);
      })
      .catch(err => {
        console.error('채팅 목록 불러오기 실패:', err);
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
      date: chat.sch_date.toISOString(), 
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
    const { title, start, extendedProps } = clickInfo.event;

    const dateObj = new Date(start); // startStr 대신 Date 객체 사용
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[dateObj.getDay()];
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

    const formattedDate = `${dateStr} (${day}) ${timeStr}`;

    setModalData({
      date: formattedDate,
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
  // 일정 삭제
const handleDelete = async (event) => {
  // 1) 진입 로그
  console.log('▶ handleDelete 시작', {
    cno: event.extendedProps?.cno,
    date: event.date,
  });

  // 2) 24시간 이내여부 & 참여자 유무 계산
  const dateObj = new Date(event.date);
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const isWithin24 = diffMs > 0 && diffMs < 24 * 60 * 60 * 1000;
  const hasMember  = Boolean(event.extendedProps?.memberName);

  // 3) confirm 메시지
  const message = (isWithin24 && hasMember)
    ? '⚠️  참여자가 있는 24시간 이내의 일정입니다.\n패널티가 부여됩니다.\n정말 취소하시겠습니까?'
    : '모의 채팅 일정을 삭제하시겠습니까?';
  console.log('▶ confirm 메시지:', message);

  // 4) 확인/취소
  if (!window.confirm(message)) {
    console.log('▶ confirm: 취소 눌림, 처리 중단');
    return;
  }
  console.log('▶ confirm: 확인 눌림, 삭제 요청 시작');

  // 5) cno 체크
  const cno = event.extendedProps?.cno;
  if (!cno) {
    console.error('▶ 삭제 대상 cno가 없습니다!');
    alert('❌ 면접방 번호를 찾을 수 없습니다.');
    return;
  }
  console.log('▶ 삭제 대상 cno=', cno);

  // 6) 절대경로로 fetch (proxy 없이 바로 9090으로)
  try {
      const response = await axios.delete(
            `http://${host}:9090/chat/deleteUserChat`,
            {
              // DELETE 바디에 JSON 으로 보내기
              data: { cno},
              withCredentials: true,  
            }
          );
        console.log('▶ DELETE status=', response.status);
        console.log('▶ DELETE data=', response.data);
        alert(`✅ ${response.data}`);

          // 7) 삭제 후 목록 갱신
        const chatRes = await axios.get(
          `http://${host}:9090/chat/getUserChat`,
          { withCredentials: true }
        );
        const chatData = chatRes.data;
        console.log('▶ 갱신된 chat 목록:', chatData);
        setChatList(
          chatData.map(chat => ({
            ...chat,
            sch_date: new Date(chat.sch_date),
          }))
        );
    } catch (err) {
      console.error('▶ DELETE 중 에러:', err);
      alert('⚠ 삭제 중 오류가 발생했습니다.');
    }
};
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <>
      <GlobalStyles />
      <Page>
        <Container>
          <Section>
            <SectionTitle> 날짜 관리</SectionTitle>
            <CalendarContainer>
              <FullCalendar
                dayMaxEvents={1}
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
            <SectionTitle> {currentMonth + 1}월 일정 관리</SectionTitle>
            <ScheduleList>
              {scheduleData
                .filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getMonth() === currentMonth;
                })
                .map((event, idx) => {
                  const dateObj = new Date(event.date);
                  const dayOfWeek = days[dateObj.getDay()];
                  const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')} (${dayOfWeek})`;
                  const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
                  const isLeader = event.extendedProps.leaderUno === myUno;

                  return (
                    <ScheduleItem
                      key={idx}
                      onClick={() =>
                        setModalData({
                          date: `${dateStr} ${timeStr}`,
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
                            <span style={{ fontWeight: '500', color: '#4376B6' }}>
                              [{dateStr} {timeStr}]
                            </span>
                            <span style={{ margin: '0 10px', color: '#999' }}>|</span>
                            <span>[{event.title}]</span>
                          </div>
                        </div>
                        <ScheduleItemContent>
                          <StatusText isLeader={isLeader}>
                            {isLeader ? '👑 내가 만든 일정' : '🤝 참여한 일정'}
                          </StatusText>
                          <CancelButton onClick={(e) => {e.preventDefault(); e.stopPropagation(); handleDelete(event); }}>
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
