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
import Test14 from './components/Test14';
import Test17 from './components/Test17';

import ProfileSelection from './components/ProfileSelection';
import ScheduleManager from './components/ScheduleManager';



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
          path="/login"
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
        {/* 기업 메인(공고 진행중)  */}
        <Route
          path="/announcementPage"
          element={
            <BackGround>
              <Test14/>
            </BackGround>
          }
        />
        {/* 기업 채팅  */}
        <Route
          path="/registAnnounce"
          element={
            <BackGround>
              <Test17/>
            </BackGround>
          }
        />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
