import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSidebar from './components/UserSidebar';
import Login from './components/Login';
import SignUpUser from './components/SignUpUser';
import SignUpCmp from './components/SignUpCmp';
import CreateAiInterview from './components/CreateAiInterview';
import AiChat from './components/AiChat';
import DiscordPage from './components/DiscordPage';
import ScrapPage from './components/ScrapPage';
import NoticeProgress from './components/NoticeProgress';
import ScheduleManager from './components/ScheduleManager';
import CompanySidebar from './components/CompanySidebar';
import ChatLayout from './components/ChatLayout;';
import GraphPage from './components/GraphPage';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import AiInterview from './components/AiInterview';
import LineChartSection from './components/LineChartSection';
import CompanyInfo from './components/CompanyInfo';
import ApplyNotice from './components/ApplyNotice';
import CompanyMain from './components/CompanyMain';
import ProfileSidebar from './components/ProfileSidebar';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로 - 회원가입 선택 */}
        <Route
          path="/signUp"
          element={
              <SignUp/>
          }
        />

        {/* 로그인 화면 */}
        <Route
          path="/"
          element={
              <Login />
          }
        />

        {/* 개인 회원가입 */}
        <Route
          path="/signUpUser"
          element={
              <SignUpUser />
          }
        />
        

        {/* 기업 회원가입 */}
        <Route path="/signUpCmp" element={
              <SignUpCmp />
          }
        />

        {/*백그라운드만 띄우기 */ }
          <Route path="/UserSidebar" element={
              <UserSidebar />
          }
        />
        {/* 프로필 선택(AI or 화상채팅)  */}
        <Route
          path="/profile"
          element={
            
               <UserSidebar>
                  <Profile/>
               </UserSidebar>
          }
        />
        
        {/* AI 모의 면접  */}
        <Route
          path="/aiInterview"
          element={
            
                <UserSidebar>
                  <AiInterview />
               </UserSidebar>
          }
        />
        {/* 화상 모의 면접  */}
        <Route
          path="/scheduleManager"
          element={
            
                <ProfileSidebar>
                  <ScheduleManager/>
               </ProfileSidebar>
          }
        />
       {/* AI 인터뷰 생성 페이지  */}
        <Route
          path="/createAiInterview"
          element={
            <UserSidebar>
              <CreateAiInterview/>
            </UserSidebar>
          }
        />
       {/* AI 인터뷰 생성 페이지  */}
        <Route
          path="/AiChat"
          element={
            <UserSidebar>
              <AiChat/>
            </UserSidebar>
          }
        />
        {/* 데이터 시각화 페이지  */}
        <Route
          path="/graphPage"
          element={
            <UserSidebar>
              <GraphPage/>
              <LineChartSection/>
            </UserSidebar>
          }
        />
        {/* 디스코드 페이지  */}
        <Route
          path="/discordPage"
          element={
            
                <ProfileSidebar>
                  <DiscordPage/>
               </ProfileSidebar>
          }
        />
         {/* 기업 공고 정보  */}
        <Route
          path="/companyInfo"
          element={
            <UserSidebar>
              <CompanyInfo/>
            </UserSidebar>
          }
        />
        {/* 공고 지원 페이지  */}
        <Route
          path="/applyNotice"
          element={
            <UserSidebar>
              <ApplyNotice/>
            </UserSidebar>
          }
        />
        {/* 스크립 & 지원  */}
        <Route
          path="/scrapPage"
          element={
            <UserSidebar>
              <ScrapPage/>
            </UserSidebar>
          }
        />
        
        {/*  기업 메인(공고 진행중)   */}
        <Route
          path="/companyMain"
          element={
            <CompanySidebar>
              <CompanyMain/>
            </CompanySidebar>
          }
        />
        {/* 공고 등록 */}
        <Route
          path="/noticeProgress"
          element={
            <CompanySidebar>
              <NoticeProgress/>
            </CompanySidebar>
          }
        />

        {/* 기업 채팅 */}
        <Route
          path="/companyChat"
          element={
            <CompanySidebar>
              <ChatLayout/>
            </CompanySidebar>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
