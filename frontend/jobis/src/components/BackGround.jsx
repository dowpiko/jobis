import '../App.css';
// import Display from './display/Display';
import styles from '../css/BackGround.module.css';
import SignupChoice from './SignupChoice';
import { useNavigate } from 'react-router-dom';

function BackGround({children}) {

  const navigate = useNavigate();
  const toLogin =()=>{
    navigate('/login');
  };
  const toAiInterview = ()=>{
    navigate('/aiInterview');
  };
  const cmpInfo =()=>{
    navigate('/cmpInfo')
  }
  const gotoMain =()=>{
    navigate('/profileselection')
  }

  return (
    <div>
      <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.topBar}>
          <div className={styles.logo} onClick={gotoMain} >🌐Jobis</div>
          <button className={styles.modeToggle}>↔️</button>
        </div>

        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <img src="https://via.placeholder.com/48" alt="profile" />
            <span>HamanJo</span>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.profileButton}>마이페이지</button>
            <button className={styles.profileButton} onClick={toLogin}>로그아웃</button>
          </div>
        </div>


        <nav className={styles.menu}>
          <div className={styles.menuItem} onClick={toAiInterview}>🏠 AI모의 면접</div>
          <div className={styles.menuItem} onClick={cmpInfo}>💬 기업 공고 정보</div>
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
          {children}
      </main>
    </div>
      {/* <Display/> */}
    </div>
  );
}

export default BackGround;
