import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import categories from '../../data/categories';
import axios from 'axios';

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 40px 20px;
  background-color: #F8F9FA;
  font-family: sans-serif;
  color: #1F2A37;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  width: 100%;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  margin-bottom: 20px;
  color: #1F2A37;
  &:focus {
    outline: none;
    border-color: #4376B6;
    box-shadow: 0 0 0 2px rgba(67, 118, 182, 0.2);
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  height: 44px;
  font-size: 16px;
  background-color: #ffffff;
  border: 2px solid #B0BCCB;
  border-radius: 6px;
  padding: 0 12px;
  margin-bottom: 20px;
  color: #1F2A37;
  &:focus {
    outline: none;
    border-color: #4376B6;
  }
`;

const CheckBoxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 6px;
  background-color: #fff;
  border: 2px solid #B0BCCB;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  input {
    accent-color: #4376B6;
  }

  &:hover {
    border-color: #4376B6;
  }
`;

const SubmitWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 30px;
  font-size: 16px;
  background-color: #4376B6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  transition: background-color 0.3s;
  &:hover {
    background-color: #5C8BC4;
  }
`;
const SectionLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0 6px;
  color: #1F2A37;
`;
const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 13px;
  margin-bottom: 14px;
  text-align: center;
`;
const host = process.env.REACT_APP_HOST;
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
}
const CreateAiInterview = () => {
  const navigate = useNavigate();
  const [titlePlaceHolder, setTiltePlaceHolder] = useState('제목');
  const [titleValue, setTitleValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [companyType, setCompanyType] = useState('');
  const [careerLevel, setCareerLevel] = useState('');
  const [titleWarning, setTitleWarning] = useState(false);
  const maxTitleLength = 25;

  const categoryRef = useRef(null);
  const subCategoryRef = useRef(null);
  const skillsRef = useRef(null);
  const companyTypeRef = useRef(null);
  const carrerLevelRef = useRef(null);

  const categoryList = categories.map(cat => cat.category);
  const subCategories = selectedCategory
    ? categories.find(cat => cat.category === selectedCategory)?.subCategories || []
    : [];

  const selectedSubCatObj = subCategories.find(sub => sub.name === selectedSubCategory);
  const skills = selectedSubCatObj?.skills || [];

  const handleTitleChange = (e) => {
    let value = e.target.value;

    if (value.length > maxTitleLength) {
      value = value.slice(0, maxTitleLength); // 25자로 자름
      setTitleWarning(true); // 경고 표시
      setTimeout(() => setTitleWarning(false), 2000); // 2초 후 숨김
    }

    setTitleValue(value);
  };




  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory('');
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedSubCategory(value);
    setTiltePlaceHolder(`${getCurrentDate()} ${value} 면접`);
    setSelectedSkills([]);
    setCompanyType('');
    setCareerLevel('');
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  const handleCompanyTypeChange = (e) => {
    setCompanyType(e.target.value);
  };

  const handleCareerLevelChange = (e) => {
    setCareerLevel(e.target.value);
  };
  const goToAiChat = () => {
    let title = titleValue ? titleValue : titlePlaceHolder;
    if(!selectedCategory){
      alert('대분류를 선택해 주세요!');
      categoryRef.current.focus();
      return;
    }
    if(!selectedSubCategory){
      alert('세부분류를 선택해 주세요!');
      subCategoryRef.current.focus();
      return;
    }
    if(!companyType){
      alert('지원 기업 형태를 선택해 주세요!');
      companyTypeRef.current.focus();
      return;
    }
    if(!careerLevel){
      alert('경력 여부를 선택해 주세요!');
      companyTypeRef.current.focus();
      return;
    }
    const surveyData = {
      title,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      skills: selectedSkills,
      companyType,
      careerLevel,
      date: getCurrentDate()
    };

    async function submitSurvey() {
    try {
        const res = await axios.post(`http://${host}:9090/interview/saveSurveyResult`, surveyData, {
          withCredentials: true,  // 세션 쿠키 전달을 위한 옵션
          headers: {
            "Content-Type": "application/json"
          }
        });
        if(res.data === "ok") {
          sessionStorage.setItem("surveyTitle", title);  // 세션처럼 저장
          navigate('/AiChat');
        }else {
          alert("❌ 처리 실패: " + res.data); // 실패 이유 출력
        }
      } catch (err) {
        console.error("❌ 서버 오류:", err);
        alert("서버 통신 중 문제가 발생했습니다.");
      }
    }
    submitSurvey();
  };

  return (
    <FormWrapper>
      <TitleInput
        type="text"
        placeholder={titlePlaceHolder}
        value={titleValue}
        onChange={handleTitleChange}
        hasError={titleWarning}
        maxLength={maxTitleLength + 1} // 사용자가 빠르게 입력해도 에러 감지 가능
      />
      {titleWarning && <ErrorMessage>25자 이하로 입력해주세요</ErrorMessage>}
      <SectionLabel>대분류</SectionLabel>
      <CategorySelect 
      value={selectedCategory} 
      onChange={handleCategoryChange}
      ref={categoryRef}
      >
        <option value="">--카테고리 선택--</option>
        {categoryList.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </CategorySelect>

      {selectedCategory && (
        <>
          <SectionLabel>세부분류</SectionLabel>
          <CategorySelect 
          value={selectedSubCategory} 
          onChange={handleSubCategoryChange}
          ref={subCategoryRef}
          >
            <option value="">--서브카테고리 선택--</option>
            {subCategories.map(sub => (
              <option key={sub.name} value={sub.name}>{sub.name}</option>
            ))}
          </CategorySelect>
        </>
      )}
      {selectedSubCategory && (
        <>
          {/* 👇 기업 형태 */}
          <SectionLabel>지원 기업 형태</SectionLabel>
          <CategorySelect 
          value={companyType} 
          onChange={handleCompanyTypeChange}
          ref={companyTypeRef}
          >
            <option value="">--지원 기업 형태 선택--</option>
            <option value="대기업">대기업</option>
            <option value="중소기업">중소기업</option>
            <option value="스타트업">스타트업</option>
            <option value="공공기관">공공기관</option>
          </CategorySelect>

          {/* 👇 경력 여부 */}
          <SectionLabel>경력 여부</SectionLabel>
          <CategorySelect 
          value={careerLevel} 
          onChange={handleCareerLevelChange}
          ref={carrerLevelRef}
          >
            <option value="">--경력 선택--</option>
            <option value="신입">신입</option>
            <option value="1~3년">1~3년</option>
            <option value="4~6년">4~6년</option>
            <option value="7년 이상">7년 이상</option>
          </CategorySelect>

          {/* 👇 기술 스택 */}
          <SectionLabel>기술 스택</SectionLabel>
          <CheckBoxGroup ref={skillsRef}>
            {skills.map(skill => (
              <CheckBoxLabel key={skill}>
                <input
                  type="checkbox"
                  checked={selectedSkills.includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                />
                {skill}
              </CheckBoxLabel>
            ))}
          </CheckBoxGroup>
        </>
      )}

      <SubmitWrapper>
        <SubmitButton onClick={goToAiChat}>CREATE</SubmitButton>
      </SubmitWrapper>
    </FormWrapper>
  );
};

export default CreateAiInterview;
