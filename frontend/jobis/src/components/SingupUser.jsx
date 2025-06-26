import React from 'react';

function SingupUser() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f8f8',
    fontFamily: 'sans-serif',
  };

  const formWrapperStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '400px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const inputWrapper = {
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const checkButtonStyle = {
    marginTop: '5px',
    fontSize: '12px',
    backgroundColor: '#eee',
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    float: 'right',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={formWrapperStyle}>
        <h2 style={{ textAlign: 'center' }}>개인 회원 회원가입</h2>
        <div style={inputWrapper}>
          <label style={labelStyle}>아이디</label>
          <input type="text" style={inputStyle} />
          <button style={checkButtonStyle}>✔️ 중복확인</button>
        </div>
        <div style={inputWrapper}>
          <label style={labelStyle}>비밀번호</label>
          <input type="password" style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <label style={labelStyle}>비밀번호 확인</label>
          <input type="password" style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <label style={labelStyle}>이름</label>
          <input type="text" style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <label style={labelStyle}>생년월일</label>
          <input type="date" style={inputStyle} />
        </div>
        <div style={inputWrapper}>
          <label style={labelStyle}>이메일</label>
          <input type="email" style={inputStyle} />
          <button style={checkButtonStyle}>✔️ 이메일 인증</button>
        </div>
        <button style={buttonStyle}>회원 가입</button>
        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '10px' }}>
          이미 가입된 회원이신가요? <strong>로그인</strong>
        </p>
      </div>
    </div>
  );
}

export default SingupUser;
