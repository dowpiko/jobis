import React from 'react';

const ProfileSelection = () => {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>프로필 선택</h2>
      <div style={styles.cardContainer}>
        {/* AI 모의 면접 */}
        <div style={styles.card}>
          <img
            src="https://via.placeholder.com/100" // 나중에 이미지 교체
            alt="AI 면접"
            style={styles.image}
          />
          <h3 style={styles.cardTitle}>AI 모의 면접</h3>
          <p style={styles.description}>
            이곳에는 무언가 멋진 문장이 들어갈 예정입니다. 아직은 비어있지만 곧 문장으로 가득 찰 공간이에요.
            여기는 아주 중요한 말을 써야 하는 자리라고 합니다.
          </p>
        </div>

        {/* 화상 모의 면접 */}
        <div style={styles.card}>
          <img
            src="https://via.placeholder.com/100" // 나중에 이미지 교체
            alt="화상 면접"
            style={styles.image}
          />
          <h3 style={styles.cardTitle}>화상 모의 면접</h3>
          <p style={styles.description}>
            이곳에는 무언가 멋진 문장이 들어갈 예정입니다. 아직은 비어있지만 곧 문장으로 가득 찰 공간이에요.
            여기는 아주 중요한 말을 써야 하는 자리라고 합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: 'center',
    padding: '40px 20px',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '40px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
  },
  card: {
    width: '220px',
    backgroundColor: '#e0e0e0',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
};

export default ProfileSelection;
