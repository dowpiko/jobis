import React, { useContext, useEffect, useState, } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import categories from '../../data/categories';
import logo from '../../img/SIMPLELOGO.png';
import toggleIcon from '../../img/ChangeIcon.png';
import cogwheel from '../../img/cogwheel.png';
import { AuthContext } from '../../contexts/AuthContext';

// 유저사이드바과 동일한 스타일 컴포넌트 정의
const ModalImgWrap = styled.div`
  position: relative;
  display: inline-block;
`;

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F8F9FA;
  color: #1E1E1E;
  font-family: 'Pretendard', 'Inter', sans-serif;
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

const ModeToggle = styled.button`
  width: 40px;
  height: 40px;
  background: url(${toggleIcon}) center center no-repeat;
  background-size: 30px 30px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const Profile = styled.div`
  position: relative;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #E2E8F0;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s ease;
  object-fit: cover;

  &:hover {
    border-color: #2563EB;
  }
`;

const ProfileName = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
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
  color: #1E1E1E;
  text-align: center;

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

const ScrollContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
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

const ModalBody = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const PickerSection = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const PickerTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1E1E37;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid #E2E8F0;
`;

const ImagePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 60px);
  gap: 12px;
  max-height: 240px;
  padding: 8px 0;
`;

const PickerImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  object-fit: cover;
  &:hover {
    border-color: #2563EB;
  }
`;

const NickInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #e11d48;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 40px;
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
    background: ${({ $hoverBg = '#1E40AF' }) => $hoverBg};
  }
`;

const CategoryList = styled.div`
  overflow-y: auto;
  max-height: ${({ isOpen }) => (isOpen ? '450px' : '0')};
  transition: max-height 0.3s ease;
`;

const host = process.env.REACT_APP_HOST;

function ProfileSidebar({ children }) {
  const navigate = useNavigate();
  const { logout, setNickname: setGlobalNickname } = useContext(AuthContext);
  const [nickname, setNickname] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const [profileUrl, setProfileUrl] = useState('/img/user.svg');
  const [images, setImages] = useState([]);
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');
  const [nicknameTemp, setNicknameTemp] = useState('');
  const [nickError, setNickError] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const location = useLocation();
  const { refreshProfile } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, [location.pathname, refreshProfile]);



  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`http://${host}:9090/user/getUser`, { withCredentials: true });
        if (!res.data?.uno) {
          alert('로그인이 필요합니다.');
          navigate('/');
        }
      } catch {
        alert('세션 오류');
        navigate('/');
      }
    };
    checkLogin();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://${host}:9090/user/checkProfile`, { withCredentials: true });
      if (res.data.exists) {
        setHasProfile(true);
        setNickname(res.data.nickname);
        setProfileUrl(res.data.profileImageUrl);
        setGlobalNickname(res.data.nickname);
        localStorage.setItem('hasProfile', 'true');
      } else {
        setHasProfile(false);
        localStorage.setItem('hasProfile', 'false');
      }
    } catch {
      alert('프로필 정보를 불러오지 못했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`http://${host}:9090/user/logout`, {}, { withCredentials: true });
    } catch {
      console.warn('서버 로그아웃 실패');
    }
    logout();
    navigate('/');
  };

  const handleImgClick = src => {
    setNickError('');
    setModalImgSrc(src);
    setNicknameTemp(nickname);
    setIsModalOpen(true);
  };

  const handleOpenImgPicker = async () => {
    if (showImgPicker) {
      setShowImgPicker(false);
    } else {
      try {
        const res = await axios.get(`/files/profile-list`, { withCredentials: true });
        setImages(res.data.files);
      } catch (e) {
        console.error(e);
      }
      setShowImgPicker(true);
    }
  };

  const handleSelectImg = (url, idx) => {
    setModalImgSrc(url);
    setShowImgPicker(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImgSrc('');
    setNickError('');
  };

  const handleSaveNickname = async () => {
    if (!nicknameTemp) {
      setNickError('닉네임이 비어있습니다.');
      return;
    }
    try {
      const res = await axios.post(
        `http://${host}:9090/user/updateNickname`,
        { nickname: nicknameTemp, profileimage: modalImgSrc },
        { withCredentials: true }
      );
      if (res.data.duplicated) {
        setNickError('중복된 닉네임입니다.');
        return;
      }
      if (res.data.success) {
        await fetchProfile();
        alert('변경되었습니다.');
        closeModal();
      }
    } catch (e) {
      console.error(e);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo onClick={() => navigate('/profile')}>
            <img src={logo} alt="Jobis 로고" />
          </Logo>
          <ModeToggle onClick={() => navigate('/aiInterview')} />
        </TopBar>
        <Profile>
          {hasProfile ? (
            <>
              <ProfileInfo>
                <ProfileImg src={profileUrl} alt="profile" onClick={() => handleImgClick(profileUrl)} />
                <ProfileName>{nickname}</ProfileName>
              </ProfileInfo>
              <ProfileActions>
                <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
              </ProfileActions>
            </>
          ) : (
            <ProfileButton onClick={() => navigate('/createProfileForm')} $full>
              프로필 생성
            </ProfileButton>
          )}
        </Profile>

        <ScrollContainer>
          <Menu>
            <MenuItem onClick={() => navigate('/scheduleManager')}>🏠 일정 관리</MenuItem>
            <MenuItem onClick={() => setIsCategoryOpen(open => !open)}>📂 직종별 면접 모집 방</MenuItem>
            <CategoryList isOpen={isCategoryOpen}>
              {categories.map(cat => (
                <MenuItem
                  key={cat.category}
                  onClick={() => navigate('/discordPage', { state: { category: cat.category } })}
                >
                  🛠️ {cat.category} 방
                </MenuItem>
              ))}
            </CategoryList>
          </Menu>
          <Footer>
            <FooterLink>개인정보처리방침</FooterLink>
            <FooterDivider>|</FooterDivider>
            <FooterLink>이용약관</FooterLink>
          </Footer>
        </ScrollContainer>
      </Sidebar>

      <Main>{children}</Main>

      {isModalOpen && (
        <ImgModalOverlay onClick={closeModal}>
          <ImgModalContent onClick={e => e.stopPropagation()}>
            <ModalBody>
              <LeftCol>
                <ModalImgWrap>
                  <ModalImg src={modalImgSrc} alt="profile large" />
                  <GearIcon src={cogwheel} alt="settings" onClick={handleOpenImgPicker} />
                </ModalImgWrap>
                <NickInput
                  value={nicknameTemp}
                  onChange={e => {
                    setNicknameTemp(e.target.value);
                    if (nickError) setNickError('');
                  }}
                  placeholder="닉네임 변경"
                />
                {nickError && <ErrorText>{nickError}</ErrorText>}
                <ButtonRow>
                  <SmallBtn $bg="#ff8b7eff" $color="#ffffffff" $hoverBg="#ff5050ff" onClick={closeModal}>
                    취소
                  </SmallBtn>
                  <SmallBtn $bg="#2563EB" $hoverBg="#1E40AF" onClick={handleSaveNickname}>
                    저장
                  </SmallBtn>
                </ButtonRow>
              </LeftCol>
              {showImgPicker && (
                <PickerSection>
                  <PickerTitle>이미지 선택</PickerTitle>
                  <ImagePickerGrid>
                    {images.map((img, i) => (
                      <PickerImg key={i} src={img.url} alt={img.filename} onClick={() => handleSelectImg(img.url, i)} />
                    ))}
                  </ImagePickerGrid>
                </PickerSection>
              )}
            </ModalBody>
          </ImgModalContent>
        </ImgModalOverlay>
      )}
    </AppLayout>
  );
}

export default ProfileSidebar;
