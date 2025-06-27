import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatUI = () => {

  const navigate = useNavigate();
  const dataVisualization =()=>{
    navigate('/dataVisualization')
  }

  return (
    <div style={styles.container}>
      <span style={styles.title}>제목</span>

      {/* 메시지 입력 영역 */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="채팅을 입력하세요."
          style={styles.input}
        />
        <button style={styles.sendButton}>▶️</button>
        <button style={styles.iconButton}>🎤</button>
        <button style={styles.iconButton}>🔄</button>
        <button style={styles.iconButton} onClick={dataVisualization}>면접 종료</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '400px',
    height: '500px',
    border: '1px solid #ccc',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'sans-serif',
    padding: '10px',
    boxSizing: 'border-box',
  },
  title: {
    border: '2px solid #007BFF',
    display: 'block',
    textAlign: 'center',
    padding: '5px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #ccc',
    paddingTop: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    border: 'none',
    outline: 'none',
  },
  sendButton: {
    padding: '8px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    marginLeft: '5px',
  },
  iconButton: {
    padding: '8px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default ChatUI;
