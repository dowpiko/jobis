import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BackGround from './components/BackGround';
import Login from './components/Login';
import SignUpUser from './components/SignUpUser';
import SignUpCmp from './components/SignUpCmp';
import SignupChoice from './components/SignupChoice';
import Test05 from './components/Test05';
import Test08 from './components/Test08';
import Test06 from './components/Test06';
import ChatUI from './components/ChatUI';
import Test09 from './components/Test09';
import Test10 from './components/Test10';
import Test13 from './components/Test13';
import Test14 from './components/Test14';
import Test17 from './components/Test17';

import ProfileSelection from './components/ProfileSelection';
import ScheduleManager from './components/ScheduleManager';
import CompanySidebar from './components/CompanySidebar';
import ChatLayout from './components/ChatLayout;';
import RadarSection from './components/RadarSection';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로 - 회원가입 선택 */}
        <Route
          path="/signUpChoice"
          element={
              <SignupChoice/>
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
          <Route path="/backGround" element={
              <BackGround />
          }
        />
        {/* 프로필 선택(AI or 화상채팅)  */}
        <Route
          path="/profileselection"
          element={
            
               <BackGround>
                  <ProfileSelection/>
               </BackGround>
          }
        />
        
        {/* AI 모의 면접  */}
        <Route
          path="/aiInterview"
          element={
            
                <BackGround>
                  <Test05 />
               </BackGround>
          }
        />
        {/* 화상 모의 면접  */}
        <Route
          path="/mockInterview"
          element={
            
                <BackGround>
                  <ScheduleManager/>
               </BackGround>
          }
        />
       {/* AI 인터뷰 생성 페이지  */}
        <Route
          path="/toAiInterviewPage"
          element={
            <BackGround>
              <Test06/>
            </BackGround>
          }
        />
       {/* AI 인터뷰 생성 페이지  */}
        <Route
          path="/AiChat"
          element={
            <BackGround>
              <ChatUI/>
            </BackGround>
          }
        />
        {/* 데이터 시각화 페이지  */}
        <Route
          path="/dataVisualization"
          element={
            <BackGround>
              <RadarSection/>
            </BackGround>
          }
        />
        {/* 디스코드 페이지  */}
        <Route
          path="/discordPage"
          element={
            
                <BackGround>
                  <Test10/>
               </BackGround>
          }
        />
         {/* 기업 공고 정보  */}
        <Route
          path="/cmpInfo"
          element={
            <BackGround>
              <Test08/>
            </BackGround>
          }
        />
        {/* 공고지원 페이지  */}
        <Route
          path="/toApply"
          element={
            <BackGround>
              <Test09/>
            </BackGround>
          }
        />
        {/* 스크립 & 지원  */}
        <Route
          path="/toScrap"
          element={
            <BackGround>
              <Test13/>
            </BackGround>
          }
        />
        {/* 기업 메인(공고 진행중)  */}
        <Route
          path="/companyNotice"
          element={
            <CompanySidebar>
              <Test14/>
            </CompanySidebar>
          }
        />
        {/* 공고 등록  */}
        <Route
          path="/registAnnounce"
          element={
            <CompanySidebar>
              <Test17/>
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
