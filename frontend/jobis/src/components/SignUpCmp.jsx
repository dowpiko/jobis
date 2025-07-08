import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { regexRules, validateField } from '../utils/validators';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  height: 100dvh; /* ✅ 모바일 호환 안정적인 전체 높이 */
  background-color: #f8f9fa;
  font-family: sans-serif;
  box-sizing: border-box;
`;

const FormWrapper = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
  width: 480px;
  max-height: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: #1f2a37;
  margin-bottom: 24px;
  font-size: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #1f2a37;
  font-size: 13px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #b0bccb;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #6b7280;
  }
`;

const CheckButton = styled.button`
  margin-top: 6px;
  font-size: 11px;
  background-color: #e0e7ef;
  padding: 4px 8px;
  border: none;
  border-radius: 6px;
  float: right;
  cursor: pointer;
  color: #1f2a37;

  &:hover {
    background-color: #d4eaf4;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #5c8bc4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4376b6;
  }
`;

const Message = styled.p`
  text-align: center;
  font-size: 11px;
  margin-top: 14px;
  color: #6b7280;

  strong {
    color: #4376b6;
    cursor: pointer;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const StatusIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  pointer-events: none;
  color: ${props => (props.valid ? 'green' : 'red')};
`;

const PwStatusWrapper = styled.div`
  position: relative;
`;

const PwStatusIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  pointer-events: none;
  color: ${props => (props.valid ? 'green' : 'red')};
`;

const SignUpCmp = () => {
  const navigate = useNavigate();                                 // 페이지 이동용 네비게이션
  const [crno, setCrno] = useState('');                           // 법인번호
  const [corpNm, setCorpNm] = useState('');                       // 법인명
  const [bzno, setBzno] = useState('');                           // 사업자등록번호
  const [enpRprFnm, setEnpRprFnm] = useState('');                 // 법인 대표자명
  const [enpBsadr, setEnpBsadr] = useState('');                   // 법인 주소
  const [sicNm, setSicNm] = useState('');                         // 업종명
  const [enpEmpeCnt, setEnpEmpeCnt] = useState('');               // 종업원 수
  const [id, setId] = useState('');                               // 사용자 ID
  const [isId, setIsId] = useState(false);                        // ID 중복확인 여부
  const [isCrno, setIsCrno] = useState(false);                    // 법인번호 확인 여부
  const [pw, setPw] = useState('');                               // 비밀번호
  const [pwCheck, setPwCheck] = useState('');                     // 비밀번호 확인
  const [pwMatch, setPwMatch] = useState(null);                   // 비밀번호 일치 여부
  const [email, setEmail] = useState('');                         // 이메일
  const [emailCodeSent, setEmailCodeSent] = useState(false);      // 인증 코드 전송 여부
  const [verifyCode, setVerifyCode] = useState('');               // 입력한 인증 코드
  const [emailVerified, setEmailVerified] = useState(false);      // 이메일 인증 완료 여부
  const [loading, setLoading] = useState(false);                  // 로딩 상태 (이메일 전송 중 등)

  // 아이디 중복확인
  const CheckId = async () => {
    const idError = validateField('id', id);

    if (idError) {
      alert(idError);
      return;
    }

    try {
      const res = await axios.get('http://localhost:9090/sm/findUserId', {
        params: { id: id },
      });
      console.log(res.status);
      if (res.data === 0) {
        if (window.confirm("사용 하시겠습니까?"))setIsId(true);
      } else alert("이미 사용 중인 아이디입니다.")         
    } catch (err) {
      console.error("❌ 아이디 확인 실패:", err);
    }
  };

  // 아이디 재설정
  const IdReset = () => {
    alert("변경 후 다시 확인을 눌러주세요.");
    setIsId(false);
    setIsCrno(false);
  };

  // 법인번호 13자리 고정
  const handleCrnoChange = (e) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, '').slice(0, 13);
    setCrno(digitsOnly);
  };
  
  // 법인번호 확인
  const FindCmp = async () => {
    if (!crno || crno.length !== 13) {
      alert("법인 번호를 확인해주세요.");
      return;
    }
    try {
      const res = await axios.get('http://localhost:9090/sm/checkComp', {
        params: { crno: crno },
      });
      
      const data = res.data;
      const item = data.response?.body?.items?.item?.[0];
      
      if (item) {
        setCrno(item.crno);
        setCorpNm(item.corpNm);
        setBzno(item.bzno);
        setEnpRprFnm(item.enpRprFnm);
        setEnpBsadr(item.enpBsadr);
        setSicNm(item.sicNm);
        setEnpEmpeCnt(item.enpEmpeCnt);
        setIsCrno(true);
      } else {
        alert("기업 정보가 없습니다.");
      }
    } catch (err) {
      alert("기업 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  // 법인번호 재설정
  const CrnoReset = () => {
    alert("변경 후 다시 확인을 눌러주세요.");
    setIsCrno(false);
    setCorpNm('');
    setBzno('');
    setEnpRprFnm('');
    setEnpBsadr('');
    setSicNm('');
    setEnpEmpeCnt('');
  };


  // 이메일 인증
  const sendVerification = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/jsh/sendemailcode', { email });
      setEmailCodeSent(res.data.success);
      if (res.data.success) alert('코드 발송됨');
      else alert('실패: ' + res.data.message);
    } catch (e) {
      console.error(e);
      alert('전송 오류');
    } finally {
      setLoading(false);
    }
  };

  // 인증 확인
  const verifyEmailCode = async () => {
    if (!verifyCode.trim()) {
      alert("인증 코드를 입력해주세요.");
      return;
    }
    try {
      const params = new URLSearchParams([
        ['email', email],
        ['code', verifyCode],
      ]);
      const res = await axios.post('/jsh/verifyemailcode', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setEmailVerified(res.data.verified);
      alert(res.data.verified ? '✅ 이메일 인증 완료!' : '❌ 인증 코드가 틀렸습니다.');
    } catch (e) {
      console.error(e);
      alert('⚠️ 인증 중 오류 발생');
    }
  };

  // 회원가입
  const handleSignUp = async () => {
    if (!id.trim() || !isId) {
      alert("아이디 중복 확인을 완료해주세요.");
      return;
    }

    if (!regexRules.pw.test(pw)) {
      alert("비밀번호 형식이 올바르지 않습니다.");
      return;
    }

    if (pw !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (crno.length !== 13 || !isCrno) {
      alert("법인번호 확인을 완료해주세요.");
      return;
    }

    if (!email.trim() || !emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:9090/sm/insertCUser', {
        id: id,
        pw: pw,
        email: email,
        crno: crno,
        corpNm: corpNm,
        bzno: bzno,
        enpRprFnm: enpRprFnm,
        enpBsadr: enpBsadr,
        sicNm: sicNm,
        enpEmpeCnt: enpEmpeCnt
      });
      if (res.status === 200) {
        alert("회원가입 성공");
      } else {
        alert("회원가입 실패");
      }
    } catch (err) {
      alert("서버 접속 실패");
    }
  };

  // 로그인 페이지 이동
  const toLogin = () => {
    navigate('/');
  };

  return (
    <Container>
      <FormWrapper>
        <Title>기업 회원 회원가입</Title>

        <InputGroup>
          <Label>아이디</Label>
          <Input type="text" value={id} onChange={(e) => setId(e.target.value)} readOnly={isId}/>
          {
          isId ?
          <CheckButton onClick={IdReset}>🔁 변경</CheckButton> : 
          <CheckButton onClick={CheckId}>✔️ 확인</CheckButton>
          }
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <PwStatusWrapper>
            <Input
              type="password"
              placeholder="비밀번호는 영문+숫자+특수문자 포함 8자 이상"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{ paddingRight: '80px' }}
            />
            {pw && (
              <PwStatusIcon valid={regexRules.pw.test(pw)}>
                {regexRules.pw.test(pw) ? '✔️ 안전' : '❌ 사용 불가'}
              </PwStatusIcon>
            )}
          </PwStatusWrapper>
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 확인</Label>
          <PasswordWrapper>
            <Input type="password" value={pwCheck} onChange={(e) => setPwCheck(e.target.value)} style={{ paddingRight: '28px' }}/>
            {pwCheck && (
              <PwStatusIcon valid={pw === pwCheck}>
              {pw === pwCheck ? '✔️ 일치' : '❌ 불일치'}
              </PwStatusIcon>
            )}
          </PasswordWrapper>
        </InputGroup>

        <InputGroup>
          <Label>법인번호</Label>
          <Input type="text" value={crno} onChange={handleCrnoChange} readOnly={isCrno}/>
          {
          isCrno ?
          <CheckButton onClick={CrnoReset}>🔁 변경</CheckButton> : 
          <CheckButton onClick={FindCmp}>✔️ 확인</CheckButton>
          }
        </InputGroup>

        <InputGroup>
          <Label>법인명</Label>
          <Input type="text" placeholder='※법인번호 확인 시 자동 등록※' value={corpNm} readOnly/>
        </InputGroup>

        <InputGroup>
          <Label>법인대표자명</Label>
          <Input type="text" placeholder='※법인번호 확인 시 자동 등록※' value={enpRprFnm} readOnly/>
        </InputGroup>

        <InputGroup>
          <Label>법인주소</Label>
          <Input type="text" placeholder='※법인번호 확인 시 자동 등록※' value={enpBsadr} readOnly/>
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailVerified(false);
              setEmailCodeSent(false);
            }}
          />
          <CheckButton
            onClick={sendVerification}
            disabled={emailVerified || loading || !email.trim()}
          >
            {emailVerified ? '인증완료' : emailCodeSent ? (loading ? '전송중...' : '재전송') : '인증요청'}
          </CheckButton>
        </InputGroup>
        {!emailVerified && emailCodeSent && (
          <InputGroup>
            <Label>인증 코드 입력</Label>
            <Input value={verifyCode} onChange={e => setVerifyCode(e.target.value)} />
            <CheckButton onClick={verifyEmailCode}>확인</CheckButton>
          </InputGroup>
        )}
        <SubmitButton onClick={handleSignUp}>회원 가입</SubmitButton>

        <Message>
          이미 가입된 회원이신가요? <strong onClick={toLogin}>로그인</strong>
        </Message>
      </FormWrapper>
    </Container>
  );
};

export default SignUpCmp;
