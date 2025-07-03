import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    const getToken = async () => {
      try {
        const res = await axios.post('/jsh/kakao', { code });
        if (res.data.success) {
          alert('카카오 로그인 성공!');
          navigate('/profile');
        } else {
          alert('카카오 로그인 실패');
        }
      } catch (error) {
        console.error(error);
        alert('서버 오류 발생');
      }
    };

    if (code) getToken();
  }, [navigate]);

  return <div>카카오 로그인 처리 중입니다...</div>;
};

export default KakaoCallback;
