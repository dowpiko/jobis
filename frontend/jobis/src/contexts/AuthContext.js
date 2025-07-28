import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
  isLoggedIn:           false,
  uno:                  null,
  hasManuallyLoggedIn:  false,    // ← 추가
  nickname: null,
  profileUrl: null,
  login:                () => {},
  logout:               () => {},
  setNickname: () => {},
  setProfileUrl: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uno,        setUno]        = useState(null);
  const [hasManuallyLoggedIn, setHasManuallyLoggedIn] = useState(false);
  const [nickname, setNickname] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);

  // (선택) 마운트 시 세션 체크
  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        if (res.data?.uno) {
          setIsLoggedIn(true);
          setUno(res.data.uno);
          setNickname(res.data.nickname); // 여기에 nickname 포함되면
          setProfileUrl(res.data.profileImageUrl);
        }
      })
      .catch(() => {});
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUno(userData.uno);
    setHasManuallyLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUno(null);
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, uno, nickname,profileUrl ,hasManuallyLoggedIn, login, logout, setNickname,setProfileUrl}}>
        {children}
    </AuthContext.Provider>
  );
}
