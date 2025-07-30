import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const host = process.env.REACT_APP_HOST;
const NaverCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (code) {
      axios.post(`http://${host}:9090/user/naver`, { code, state })
        .then((res) => {
          navigate('/profile');
        })
        .catch((err) => {
          console.error('로그인 실패:', err);
          alert('네이버 로그인 실패');
          navigate('/');
        });
    }
  }, []);

  return <div>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;