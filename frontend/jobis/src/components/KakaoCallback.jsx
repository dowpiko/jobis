import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [birth, setBirth] = useState('');
  const [step, setStep] = useState('loading'); // 'loading', 'form', 'done'

  useEffect(() => {
    const codeFromUrl = new URL(window.location.href).searchParams.get('code');
    if (!codeFromUrl) {
      alert('인가 코드가 없습니다.');
      return navigate('/');
    }

    setCode(codeFromUrl);

    // 🔍 1단계: code만 보내서 가입 여부 확인
    axios
      .post('/jsh/kakao/check', { code: codeFromUrl })
      .then((res) => {
        if (res.data.exists) {
          alert('카카오 로그인 성공!');
          navigate('/profile');
        } else {
          setStep('form'); // 가입 안된 경우 -> 생년월일 폼으로 전환
        }
      })
      .catch((err) => {
        console.error(err);
        alert('카카오 로그인 실패');
        navigate('/');
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/jsh/kakao', { code, birth });
      if (res.data.success) {
        alert('카카오 회원가입 및 로그인 성공!');
        navigate('/profile');
      } else {
        alert('카카오 회원가입 실패');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류 발생');
    }
  };

  if (step === 'loading') return <div>카카오 로그인 처리 중입니다...</div>;

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>추가 정보 입력</h2>
      <p>생년월일을 입력해주세요 (예: 1990-06-25)</p>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <br />
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
          확인
        </button>
      </form>
    </div>
  );
};

export default KakaoCallback;
