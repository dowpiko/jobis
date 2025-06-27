import React from 'react';

const ChatLayout = () => {
  return (
    <div style={styles.wrapper}>
      {/* 왼쪽: 채팅 목록 */}
      <div style={styles.chatListPanel}>
        <h3 style={styles.panelTitle}>채팅</h3>
        <div style={styles.chatCardSelected}>
          <img src="https://via.placeholder.com/32" alt="avatar" style={styles.avatar} />
          <div>
            <div>이름 : 홍길동</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </div>
        <div style={styles.chatCard}>
          <img src="https://via.placeholder.com/32" alt="avatar" style={styles.avatar} />
          <div>
            <div>이름 : 안산시</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </div>
        <div style={styles.chatCard}>
          <img src="https://via.placeholder.com/32" alt="avatar" style={styles.avatar} />
          <div>
            <div>이름 : 아우치</div>
            <div>생년월일 : 2000.00.00</div>
          </div>
        </div>
      </div>

      {/* 가운데: 채팅 내용 & 입력 */}
      <div style={styles.chatPanel}>
        <div style={styles.chatContent}>
          {/* 대화내용 생략 */}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="채팅을 입력하세요."
            style={styles.input}
          />
          <button style={styles.sendButton}>▶️</button>
          <button style={styles.iconButton}>🎤</button>
          <button style={styles.iconButton}>🔄</button>
        </div>
      </div>

      {/* 오른쪽: 해당 공고 */}
      <div style={styles.announcementPanel}>
        <div style={styles.announcementText}>고<br />공<br />당<br />해</div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    border: '2px solid black',
    fontFamily: 'sans-serif',
  },
  chatListPanel: {
    width: '20%',
    borderRight: '1px solid black',
    padding: '10px',
    boxSizing: 'border-box',
  },
  panelTitle: {
    marginBottom: '10px',
  },
  chatCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8cccc',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #000',
  },
  chatCardSelected: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8cccc',
    padding: '8px',
    marginBottom: '10px',
    border: '2px solid blue',
  },
  avatar: {
    marginRight: '8px',
  },
  chatPanel: {
    flex: 1,
    borderRight: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatContent: {
    flex: 1,
    padding: '10px',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendButton: {
    padding: '8px',
    marginLeft: '5px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    cursor: 'pointer',
  },
  iconButton: {
    padding: '8px',
    marginLeft: '5px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    cursor: 'pointer',
  },
  announcementPanel: {
    width: '15%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    writingMode: 'vertical-rl',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  announcementText: {
    textAlign: 'center',
  },
};

export default ChatLayout;
