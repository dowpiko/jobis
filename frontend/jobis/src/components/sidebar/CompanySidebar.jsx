import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../img/SIMPLELOGO.png';
import { SocketContext } from '../../contexts/SocketContext';
import cogwheel from '../../img/cogwheel.png';

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F7F9FC;
  color: #1E1E1E;
  font-family: 'Pretendard', sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: #EFF4FF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  img {
    width: 120px;
    height: auto;
    cursor: pointer;
  }
`;

const Profile = styled.div`
  position: relative;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #E2E8F0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;  // 각 라인 간격
  font-size: 14px;
  color: #1F2A37;
`;

const ProfileLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1E1E1E;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ProfileButton = styled.button`
  background-color: #2563EB;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  color: #FFFFFF;
  font-size: 13px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1E40AF;
  }
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E2E8F0;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 14px;
  border-radius: 10px;
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: #2563EB;
    color: #FFFFFF;
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6B7280;
`;

const FooterLink = styled.a`
  color: #6B7280;
  text-decoration: none;

  &:hover {
    color: #2563EB;
  }
`;

const FooterDivider = styled.span`
  color: #E2E8F0;
`;

const Main = styled.main`
  flex: 1;
  background-color: #FFFFFF;
  overflow-y: auto;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -6px;
  right: ${(props) => 
    props.countLength === 1 ? '-5px' : 
    props.countLength === 2 ? '-10px' : 
    '-15px'
  }; 
  background-color: #e53935;
  color: white;
  padding: 1px 5px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
  line-height: 1.4;
  white-space: nowrap;
`;

const NotificationWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const NotificationModal = styled.div`
  position: absolute;
  top: -10px;
  left: 40px;
  width: 240px;
  background-color: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
  padding: 12px;
  font-size: 13px;
  color: #333;
  animation: fadeIn 0.2s ease-in-out;

  max-height: 240px;  // ⭐ 최대 높이 설정 (5개 정도 기준)
  overflow-y: auto;   // ⭐ 스크롤 생기게

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NotificationItem = styled.div`
  padding: 8px 6px;
  border-bottom: 1px solid #F1F5F9;
  &:last-child {
    border-bottom: none;
  }
  cursor: pointer;
  &:hover {
    background-color: #F7F9FC;
  }
`;

const ProfileImg = styled.img`
  margin-left: px;
  width: 180px;
  height: 100px;
  cursor: pointer;
  border: 2px solid transparent;      /* 기본은 투명 테두리 */
  transition: border-color 0.2s ease; /* 부드러운 전환 */

  &:hover {
    border-color: #2563EB;            /* 호버 시에만 파란 테두리 */
  }
`;

const ImgModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ImgModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  max-width: 40vw;
  max-height: 40vh;
`;

const ModalImgWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const ModalImg = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
`;

const GearIcon = styled.img`
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  padding: 3px;
  box-shadow: 0 0 3px rgba(22, 20, 20, 0.25);
  border: 2px solid rgba(22, 20, 20, 0.25);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 40px;
  justify-content: center;
  margin-top: 8px;
`;

const SmallBtn = styled.button`
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;

  background: ${({ $bg = '#2563EB' }) => $bg};
  color: ${({ $color = '#fff' }) => $color};

  &:hover {
    background: ${({ $hoverBg = '#1E4DB7' }) => $hoverBg};
  }
`;

const host = process.env.REACT_APP_HOST;
function CompanySidebar({ children }) {
  const navigate = useNavigate();
  const [cName, setCName] = useState('');
  const [enpRprFnm, setEnpRprFnm] = useState('');
  const { uno, logout } = useContext(AuthContext);
  const [dbCount, setDbCount] = useState(0);
  const location = useLocation(); 
  const socket = useContext(SocketContext);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState({});
  const [profileUrl, setProfileUrl] = useState('/img/user.svg');
  const [originalUrl, setOriginalUrl] = useState('/img/user.svg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const display  = dbCount > 99 ? '99+' : dbCount.toString();
  const len = display.length; 

  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="#1F2A37" viewBox="0 0 24 24">
      <path d="M12 24c1.104 0 2-.896 2-2h-4a2 2 0 002 2zm6.364-6V11c0-3.308-2.308-6.104-5.364-6.708V3a1 1 0 10-2 0v1.292C8.944 4.896 6.636 7.692 6.636 11v7L4 19v1h16v-1l-1.636-1zM18 20H6v-.382l1.636-1.636V11c0-2.757 2.243-5 5-5s5 2.243 5 5v6.982L18 19.618V20z"/>
    </svg>
  );

  const handleLogout = async () => {
    try {
      await axios.post(`http://${host}:9090/user/logout`, {withCredentials:true});
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }
    logout();
    navigate('/');
  };

  const handleNotification = (msg) => {
    const rno = msg.rno;
    setNotifications((prev) => {
      const updated = { ...prev };
      if (!updated[rno]) updated[rno] = [];
      updated[rno].push(msg.message);
      return updated;
    });
    setDbCount((c) => c + 1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    axios.get(`http://${host}:9090/user/getUser`, {withCredentials:true})
      .then(res => {
        console.log(res);
        if (res.data) {
          axios.get(`http://${host}:9090/user/selectCinofoByUno?uno=${res.data.uno}`)
          .then(data => {
              if (data.data) {
                setCName(data.data.corpNm);
                setEnpRprFnm(data.data.enpRprFnm);
                setDbCount(data.data.count);

                if (socket && socket.readyState === WebSocket.OPEN && uno) {
                  socket.send(JSON.stringify({
                    type: 'ENTER_ROOM',
                    uno: uno,
                    rno: 0,
                  }));
                }
              }else {
                return;
              }
            })
        } else {
          alert('로그인이 필요합니다.');
          navigate('/');
        }
      })
      .catch(err => {
        console.error('프로필 정보 가져오기 실패', err);
        alert('세션 오류');
        navigate('/');
      });
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!socket) return;
      const handler = (evt) => {
      
      let msg;
      try { msg = JSON.parse(evt.data); } catch { return; }
  
      if (msg.type === 'chat_notification' && msg.message.sender === uno || !msg) {
        handleNotification(msg);
        return;
      }
    };
    socket.addEventListener('message', handler);
    return () => socket.removeEventListener('message', handler);
  }, [socket, uno]);

  useEffect(() => {
    const reload = () => {
      if (uno === null) {
        axios.post(`http://${host}:9090/user/logout`, {withCredentials:true})
        alert('로그인이 필요합니다.')
        logout();
        navigate('/');
        return;
      }
      axios.get(`/user/selectCinofoByUno?uno=${uno}`)
        .then(data => {
          if (data.data) {
            if (data.data.count === dbCount) {
              return;
            }else{
              setDbCount(data.data.count);
            }
          }
        })
        .catch(err => {console.error('🔔 알림 카운트 재로딩 실패', err);});
        };

        window.addEventListener('reloadSidebarCount', reload);
        return () => window.removeEventListener('reloadSidebarCount', reload);
  }, []);

  const handleNotificationClick = (rno) => {
    setNotifications((prev) => {
      const updated = { ...prev };
      delete updated[rno];
      return updated;
    });
    navigate(`/companyChatLayout?rno=${rno}`);
  };

  useEffect(() => {
    if (!uno) return;

    const fileName = `${uno}.png`;
    const checkUrl = `/files/profile-list/UserCustom`;
    
    axios.get(checkUrl)
    .then(res => {
      const files = res.data?.files || [];
      const match = files.find(f => f.filename === fileName);
        if (match) {
          const urlWithCacheBypass = `${match.url}?t=${Date.now()}`;
          setProfileUrl(urlWithCacheBypass);
          setOriginalUrl(urlWithCacheBypass);
        } else {
          setProfileUrl('/img/user.svg');
          setOriginalUrl('/img/user.svg');
        }
      })
      .catch(() => {
        setProfileUrl('/img/user.svg');
        setOriginalUrl('/img/user.svg');
      });
    }, [uno]);

  const handleSaveNickname = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file || !uno) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('uno', uno);

    try {
      await axios.post(`http://${host}:9090/files/upload/profileImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUrl = `/profile/usercustom/${uno}.png?t=${Date.now()}`;
      setOriginalUrl(updatedUrl);
      setProfileUrl(updatedUrl);
      setIsModalOpen(false);
      alert('변경되었습니다.');
    } catch (e) {
      console.error('업로드 실패', e);
      alert('이미지 저장 실패');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.png')) {
      alert('PNG 확장자 파일만 등록할 수 있습니다.');
      fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenImg = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClose = () => {
    setProfileUrl(originalUrl);
    setIsModalOpen(false);
    fileInputRef.current.value = ""
  };
  
  const handleClick = () => setIsModalOpen(true);

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/companyMain')}>
            <img src={logo} alt="Jobis 로고" />
          </Logo>
        </TopBar>

        <Profile>
          <NotificationWrapper ref={notificationRef} onClick={() => setIsNotificationOpen(prev => !prev)}>
            <BellIcon />
            {dbCount > 0 && (<NotificationBadge countLength={len}>{display}</NotificationBadge>)}

            {isNotificationOpen && (
              <NotificationModal>
                {Object.entries(notifications).map(([rno, messages]) => {
                  const lastMsg = messages[messages.length - 1];
                  return (
                    <NotificationItem key={rno} onClick={() => handleNotificationClick(rno)}>
                      <div style={{ fontSize: '12px'}}>
                        {lastMsg.leader_name}: {lastMsg.content}
                      </div>
                    </NotificationItem>
                  );
                })}
                {Object.keys(notifications).length === 0 && (
                  <NotificationItem>알림이 없습니다.</NotificationItem>
                )}
              </NotificationModal>
            )}
          </NotificationWrapper>

          <ProfileInfo>
            <ProfileImg src={profileUrl} alt={profileUrl} onClick={() => handleClick(profileUrl)}/>
            <ProfileLine>
              <strong>기업명 :</strong> <span>{cName}</span>
            </ProfileLine>
            <ProfileLine>
              <strong>대표자명 :</strong> <span>{enpRprFnm}</span>
            </ProfileLine>
          </ProfileInfo>

          <ProfileActions>
            <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
          </ProfileActions>
        </Profile>

        <Menu>
          <MenuItem onClick={() => navigate('/companyMain')}>🏠 공고</MenuItem>
          <MenuItem onClick={() => navigate('/companyChatLayout')}>💬 채팅</MenuItem>

        </Menu>

        <Footer>
          <FooterLink>개인정보처리방침</FooterLink>
          <FooterDivider>|</FooterDivider>
          <FooterLink>이용약관</FooterLink>
        </Footer>
      </Sidebar>

      <Main>{children}</Main>
      {isModalOpen && (
              <ImgModalOverlay>
                <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}/>
                  <ImgModalContent onClick={e => e.stopPropagation()}>
                    <ModalImgWrap>
                      <ModalImg src={profileUrl} alt="profile large" />
                      <GearIcon src={cogwheel} alt="settings" onClick={handleOpenImg} />
                    </ModalImgWrap>
                    <ButtonRow>
                      <SmallBtn $bg="#ff8b7eff" $color="#ffffffff" $hoverBg="#ff5050ff" onClick={handleClose}>취소</SmallBtn>
                      <SmallBtn $bg="#2563EB" $hoverBg="#777779ff" onClick={handleSaveNickname}>저장</SmallBtn>
                    </ButtonRow>
                  </ImgModalContent>
                </ImgModalOverlay>
              )}
    </AppLayout>
  );
}

export default CompanySidebar;
