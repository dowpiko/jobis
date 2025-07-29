import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import categories from '../../data/categories';
import logo from '../../img/SIMPLELOGO.png';
import toggleIcon from '../../img/ChangeIcon.png';
import { AuthContext } from '../../contexts/AuthContext';
import cogwheel from '../../img/cogwheel.png';

const CategoryList = styled.div`
  overflow-y: auto;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  transition: max-height 0.4s ease;
`;

const AppLayout = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F7F9FC;
  color: #1F2A37;
  font-family: 'Pretendard', sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  height: 100vh;
  background-color: #EFF4FF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 12px;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 6px;
`;

const Logo = styled.img`
  height: 40px;
  cursor: pointer;
`;

const ModeToggle = styled.button`
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Profile = styled.div`
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #E2E8F0;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid transparent;      /* 기본은 투명 테두리 */
  object-fit: cover;
  cursor: pointer;
  transition: border-color 0.2s ease;  /* 부드러운 전환 */

  &:hover {
    border-color: #2563EB;            /* 호버 시에만 파란 테두리 */
  }
`;

const ProfileName = styled.span`
  font-size: 17px;
  font-weight: bold;
  color: #1F2A37;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProfileButton = styled.button`
  background-color: #2563EB;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  color: #FFFFFF;
  font-size: 13px;
  cursor: pointer;
  width: ${({ $full }) => ($full ? '100%' : 'auto')};
  text-align: center;
  margin: ${({ $full }) => ($full ? '8px auto' : '0')};

  &:hover {
    background-color: #1E4DB7;
  }
`;

const Menu = styled.nav`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #E2E8F0;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 18px 14px;
  border-radius: 8px;
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  color: #1F2A37;

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
  padding: 2px 4px;

  &:hover {
    color: #2563EB;
  }
`;

const FooterDivider = styled.span`
  color: #E2E8F0;
`;

const Main = styled.main`
  flex: 1;
  padding: 30px;
  background-color: #FFFFFF;
  overflow-y: auto;
  border-left: 1px solid #E2E8F0;
  position: relative;
`;

// 모달 오버레이 스타일
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

const NickInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
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

const ButtonRow = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 8px;
`;

const ModalBody = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

const ModalImgWrap = styled.div`
  position: relative;
  display: inline-block;
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

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;   /* 가운데 정렬 원치 않으면 제거 */
  gap: 12px;
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

const PickerSection = styled.div`
  margin-top: 16px;
  width: 100%;
`;

const PickerTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1F2A37;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid #E2E8F0;
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #e11d48; /* 빨간색 */
`;

function ProfileSidebar({ children }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { logout, setNickname: setGlobalNickname } = useContext(AuthContext);
  const [nicknameTemp, setNicknameTemp] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [images, setImages] = useState([]);
  const [selectImg, setSelectImg] = useState('');
  const [nickError, setNickError] = useState('');
  // 모달 오픈 상태
  const [showImgPicker, setShowImgPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('/jsh/getUser');
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
      const res = await axios.get('/jsh/checkProfile');
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
      await axios.post('/jsh/logout');
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }
    logout();
    navigate('/');
  };

  const handleImgClick = src => {
    setNickError('');
    setModalImgSrc(src);
    setNicknameTemp(nickname || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImgSrc('');
  };

  const handleSaveNickname = async () => {
    if (nicknameTemp === '') {
      setNickError('닉네임이 비어있습니다.');
      return;
    };
    try {
      const res = await axios.post('/updateNickname', { nickname: nicknameTemp, profileimage: selectImg });
      
      if (res.data.duplicated) {
        setNickError('중복된 닉네임입니다.');
        return;
      }
      if (res.data.success) {
        setNickError('');
        await fetchProfile();
        alert('변경되었습니다.');
        closeModal();
      }
    } catch (e) {
      if (e.response?.status === 409 && e.response.data?.duplicated) {
        setNickError('중복된 닉네임입니다.');
        return;
      }
      if (e.response?.status === 401){
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
      } else {
        console.error(e);
      }
    }
  };

  const handleOpenImgPicker = async () => {
    if (showImgPicker === true) {
      setShowImgPicker(false);
      return;
    }
    try {
      const res = await axios.get('/files/profile-list');
      setImages(res.data.files);
    } catch (e) {
      console.error(e);
    }
    setShowImgPicker(true);
  };

  const handleSelectImg = (url, idx) => {
    setModalImgSrc(url);
    setSelectImg(idx);
    setShowImgPicker(false);
  };

  return (
    <AppLayout>
      <Sidebar>
        <TopBar>
          <Logo src={logo} onClick={() => navigate('/profile')} />
          <ModeToggle onClick={() => navigate('/aiInterview')}>
            <img src={toggleIcon} alt="toggle" />
          </ModeToggle>
        </TopBar>

        <Profile>
          {hasProfile ? (
            <>
              <ProfileInfo>
                <ProfileImg
                  src={profileUrl}
                  alt={profileUrl}
                  onClick={() => handleImgClick(profileUrl)}
                />
                <ProfileName>{nickname || '이름 없음'}</ProfileName>
              </ProfileInfo>
              <ProfileActions>
                <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
              </ProfileActions>
            </>
          ) : (
            <ProfileButton $full onClick={() => navigate('/createProfileForm')}>
              프로필 생성
            </ProfileButton>
          )}
        </Profile>

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
      </Sidebar>

      <Main>
        {children}
        {isModalOpen && (
          <ImgModalOverlay>
            <ImgModalContent onClick={e => e.stopPropagation()}>
              <ModalBody>
                <LeftCol>
                  <ModalImgWrap>
                    <ModalImg src={modalImgSrc} alt="profile large" />
                    <GearIcon src={cogwheel} alt="settings" onClick={handleOpenImgPicker}/>
                  </ModalImgWrap>

                  <NickInput
                    value={nicknameTemp}
                    onChange={e => {
                      setNicknameTemp(e.target.value);
                      if (nickError) setNickError(''); // 수정 시 에러 초기화
                    }}
                    placeholder="닉네임 변경"
                  />
                  {nickError && <ErrorText>{nickError}</ErrorText>}
                  <ButtonRow>
                    <SmallBtn $bg="#ff8b7eff" $color="#ffffffff" $hoverBg="#ff5050ff" onClick={closeModal}>취소</SmallBtn>
                    <SmallBtn $bg="#2563EB" $hoverBg="#1E4DB7" onClick={handleSaveNickname}>저장</SmallBtn>
                  </ButtonRow>
                </LeftCol>
                {showImgPicker && (
                  <PickerSection>
                    <PickerTitle>이미지 선택</PickerTitle>
                    <ImagePickerGrid>
                      {images.map((img, i) => (
                        <PickerImg
                          key={i}
                          src={img.url}
                          alt={img.filename}
                          onClick={() => handleSelectImg(img.url, i)}
                        />
                      ))}
                    </ImagePickerGrid>
                  </PickerSection>
                )}
              </ModalBody>
            </ImgModalContent>
          </ImgModalOverlay>
        )}
      </Main>
    </AppLayout>
  );
}

export default ProfileSidebar;
