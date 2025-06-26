import '../App.css';
// import Display from './display/Display';
import styles from '../css/BackGround.module.css';
import Login from './Login';
function BackGround({children}) {
  return (
    <div>
      <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.topBar}>
          <div className={styles.logo}>🌐Jobis</div>
          <button className={styles.modeToggle}>↔️</button>
        </div>

        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <img src="https://via.placeholder.com/48" alt="profile" />
            <span>HamanJo</span>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.profileButton}>마이페이지</button>
            <button className={styles.profileButton}>로그아웃</button>
          </div>
        </div>


        <nav className={styles.menu}>
          <div className={styles.menuItem}>🏠 대시보드</div>
          <div className={styles.menuItem}>💬 채팅</div>
          <div className={styles.menuItem}>⚙️ 설정</div>
        </nav>

        <div className={styles.footer}>
          <a href="#" className={styles.footerLink}>개인정보처리방침</a>
          <span className={styles.footerDivider}>|</span>
          <a href="#" className={styles.footerLink}>이용약관</a>
        </div>
      </aside>

      <main className={styles.main}>
        {/* <h1>메인 콘텐츠</h1>
        <p>여기에 채팅이나 페이지 내용이 들어갑니다.</p> */}
        <Login/>
      </main>
    </div>
      {/* <Display/> */}
    </div>
  );
}

export default BackGround;
