import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
  isLoggedIn:           false,
  uno:                  null,
  hasManuallyLoggedIn:  false,    // ← 추가
  login:                () => {},
  logout:               () => {}
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uno,        setUno]        = useState(null);
  const [hasManuallyLoggedIn, setHasManuallyLoggedIn] = useState(false)

  // (선택) 마운트 시 세션 체크
  useEffect(() => {
    axios.get('/jsh/getUser')
      .then(res => {
        console.log(res);
        if (res.data?.uno) {
          setIsLoggedIn(true);
          setUno(res.data.uno);
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
    <AuthContext.Provider value={{isLoggedIn, uno, hasManuallyLoggedIn, login, logout}}>
        {children}
    </AuthContext.Provider>
  );
}
