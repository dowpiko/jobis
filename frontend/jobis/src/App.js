  import React, { useContext, useEffect, useState } from 'react';
  import { SocketContext } from './contexts/SocketContext';
  import { AuthContext } from './contexts/AuthContext';
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  import UserSidebar from './components/sidebar/UserSidebar';
  import Login from './components/Login';
  import SignUpUser from './components/SignUpUser';
  import SignUpCmp from './components/SignUpCmp';
  import CreateAiInterview from './components/ai/CreateAiInterview';
  import AiChat from './components/ai/AiChat';
  import DiscordPage from './components/chat/DiscordPage';
  import ScrapPage from './components/ai/ScrapPage';
  import NoticeProgress from './components/company/NoticeProgress';
  import ScheduleManager from './components/chat/ScheduleManager';
  import GraphPage from './components/ai/GraphPage';
  import SignUp from './components/SignUp';
  import Profile from './components/chat/Profile';
  import AiInterview from './components/ai/AiInterview';
  import CompanyInfo from './components/company/CompanyInfo';
  import ApplyNotice from './components/ai/ApplyNotice';
  import CompanyMain from './components/company/CompanyMain';
  import CreateProfile from './components/chat/CreateProfile';
  import CreateProfileForm from './components/chat/CreateProfileForm';
  import NaverCallback from './components/NaverCallback';
  import KakaoCallback from './components/KakaoCallback';
  import GoogleCallback from './components/GoolgleCallback';
  import CompanyChatLayout from './components/company/CompanyChatLayout';
  import UserChatLayout from './components/UserChatLayout';
  import UserSidebarLayout from './components/layout/UserSidebarLayout';
  import ProfileSidebarLayout from './components/layout/ProfileSidebarLayout';
  import CompanySidebarLayout from './components/layout/CompanySidebarLayout';

  function App() {
    const [socket, setSocket] = useState(null);
    const { isLoggedIn, uno } = useContext(AuthContext);

    useEffect(() => {
      if (!isLoggedIn || !uno) return;
      const host = process.env.REACT_APP_HOST;
      const ws = new WebSocket(`ws://${host}:9090/ws/userChat?uno=${uno}`);
      ws.onopen  = () => console.log('✅ Global WS connected');
      ws.onerror = err => console.error('⚠️ Global WS error', err);
      ws.onclose = () => console.log('🔴 Global WS disconnected');
      setSocket(ws);

      return () => {
        ws.close();
        console.log('🔴 Global WS cleanup');
      };
    }, [isLoggedIn, uno]);

    return (
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            {/* 기본 경로 - 회원가입 선택 */}
            <Route path="/signUp" element={<SignUp/>}/>

            {/* 로그인 화면 */}
            <Route path="/" element={<Login />}/>

            {/* 네이버 로그인 콜백 경로 */}
            <Route path="/naver/callback" element={<NaverCallback />}/>

            {/* 카카오 로그인 콜백 경로 */}
            <Route path="/kakao/callback" element={<KakaoCallback/>}/>

            {/* 구글 로그인 콜백 경로 */}
            <Route path="/google/callback" element={<GoogleCallback />}/> 

            {/* 개인 회원가입 */}
            <Route path="/signUpUser" element={<SignUpUser />}/>

            {/* 기업 회원가입 */}
            <Route path="/signUpCmp" element={<SignUpCmp />}/>

            {/*백그라운드만 띄우기 */ }
            <Route path="/UserSidebar" element={<UserSidebar />}/>

            {/* 프로필 선택(AI or 화상채팅)  */}
            <Route path="/profile" element={<Profile/>}/>

            {/* 화상 채팅 */}
            <Route element={<UserSidebarLayout />}>
              <Route path="/userChatLayout" element={<UserChatLayout />} />           {/* 유저 채팅 */}
              <Route path="/scrapPage" element={<ScrapPage />} />                     {/* 스크랩 & 지원 */}
              <Route path="/applyNotice" element={<ApplyNotice />} />                 {/* 공고 지원 페이지 */}
              <Route path="/companyInfo" element={<CompanyInfo />} />                 {/* 기업 공고 정보 */}
              <Route path="/graphPage" element={<GraphPage />} />                     {/* 데이터 시각화 페이지 */}
              <Route path="/AiChat" element={<AiChat />} />                           {/* AI 인터뷰 진행 페이지 */}
              <Route path="/createAiInterview" element={<CreateAiInterview />} />     {/* AI 인터뷰 생성 페이지 */}
              <Route path="/aiInterview" element={<AiInterview />} />                 {/* AI 모의 면접 */}
            </Route>

            <Route element={<ProfileSidebarLayout />}>
              <Route path="/createProfile" element={<CreateProfile />} />             {/* 프로필 생성 */}
              <Route path="/createProfileForm" element={<CreateProfileForm />} />     {/* 프로필 폼 작성 */}
              <Route path="/scheduleManager" element={<ScheduleManager />} />         {/* 화상 모의 면접 */}
              <Route path="/discordPage" element={<DiscordPage />} />                 {/* 디스코드 페이지 */}
            </Route>
            
            <Route element={<CompanySidebarLayout />}>
              <Route path="/companyMain" element={<CompanyMain />} />                 {/* 기업 메인(공고 진행중) */}
              <Route path="/noticeProgress" element={<NoticeProgress />} />           {/* 공고 등록 */}
              <Route path="/companyChatLayout" element={<CompanyChatLayout />} />     {/* 기업 채팅 */}
            </Route>
          </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
    );
  }
  
  export default App;
