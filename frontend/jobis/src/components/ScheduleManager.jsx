import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 CSS 적용
import { useNavigate } from 'react-router-dom';

function ScheduleManager() {

  const navigate = useNavigate();
  const gotoDiscord =()=>{
    navigate('/discordPage')
  }

  const [date, setDate] = useState(new Date());

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '40px',
    fontFamily: 'sans-serif',
  };

  const sectionStyle = {
    width: '45%',
  };

  const calendarContainerStyle = {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  };

  const scheduleItemStyle = {
    backgroundColor: '#ddd',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '4px',
  };

  const cancelButtonStyle = {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    fontWeight: 'bold',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      {/* 날짜 관리 */}
      <div style={sectionStyle}>
        <h3>날짜 관리</h3>
        <div style={calendarContainerStyle}>
          <Calendar onChange={setDate} value={date} />
        </div>
      </div>

      {/* 일정 관리 */}
      <div style={sectionStyle}>
        <h3>일정 관리</h3>
        <div>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={scheduleItemStyle} onClick={gotoDiscord}>
              <span>?월?일 ?시 모의 면접</span>
              <button style={cancelButtonStyle}>취소</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScheduleManager;
