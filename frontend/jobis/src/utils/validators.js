export const regexRules = {
  id: /^[a-zA-Z0-9]{5,15}$/,
  pw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  name: /^[가-힣a-zA-Z]{2,20}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const validateField = (name, value, compareValue = '') => {
  if (!value.trim()) return '';

  switch (name) {
    case 'id':
      return regexRules.id.test(value) ? '' : '아이디는 영문/숫자 5~15자';
    case 'pw':
      return regexRules.pw.test(value) ? '' : '비밀번호는 영문+숫자+특수문자 포함 8자 이상';
    case 'confirmPassword':
      return value === compareValue ? '' : '비밀번호가 일치하지 않습니다';
    case 'name':
      return regexRules.name.test(value) ? '' : '이름은 한글/영문 2~20자';
    case 'email':
      return regexRules.email.test(value) ? '' : '유효한 이메일 형식 아님';
    default:
      return '';
  }
};
