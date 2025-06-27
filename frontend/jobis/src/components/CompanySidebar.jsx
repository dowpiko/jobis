import '../App.css';
import styles from '../css/BackGround.module.css';
import { useNavigate } from 'react-router-dom';

function CompanySidebar({ children }) {
  const navigate = useNavigate();

  const companyMain = () => navigate('/companyMain');
  const goToLogin = () => navigate('/');
  const goToNotice = () => navigate('/noticeProgress');
  const goToChat = () => navigate('/companyChat');

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        {/* 상단 로고 및 모드 변경 */}
        <div className={styles.topBar}>
          <div className={styles.logo} onClick={companyMain}>Logo</div>
        </div>

        {/* 회사 정보 */}
        <div className={styles.companyProfile}>
          <img
            src="https://via.placeholder.com/64"
            alt="Company Profile"
            className={styles.companyAvatar}
          />
          <div className={styles.companyInfo}>
            <div>기업명 : 메이픔</div>
            <div>대표자명 : 신창섭</div>
          </div>
          <div className={styles.profileActions}>
            <button className={styles.profileButton} onClick={goToLogin}>LogOut</button>
          </div>
        </div>

        {/* 메뉴 영역 */}
        <nav className={styles.menu}>
          <div className={styles.menuItem} onClick={goToNotice}>📢 공고</div>
          <div className={`${styles.menuItem} ${styles.active}`} onClick={goToChat}>
            💬 <strong>채팅</strong>
          </div>
        </nav>

        {/* 하단 링크 */}
        <div className={styles.footer}>
          <a href="#" className={styles.footerLink}>개인정보 처리방침</a>
          <span className={styles.footerDivider}>|</span>
          <a href="#" className={styles.footerLink}>이용 약관</a>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

export default CompanySidebar;
