import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import categories from '../../data/categories';

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
const CreateAiInterview = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [interviewType, setInterviewType] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [careerLevel, setCareerLevel] = useState('');

  const categoryList = categories.map(cat => cat.category);
  const subCategories = selectedCategory
    ? categories.find(cat => cat.category === selectedCategory)?.subCategories || []
    : [];

  const selectedSubCatObj = subCategories.find(sub => sub.name === selectedSubCategory);
  const skills = selectedSubCatObj?.skills || [];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubCategory('');
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    setSelectedSkills([]);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };
  const handleInterviewTypeChange = (e) => {
    setInterviewType(e.target.value);
  };
  const handleCompanyTypeChange = (e) => {
    setCompanyType(e.target.value);
  };

  const handleCareerLevelChange = (e) => {
    setCareerLevel(e.target.value);
  };
  const goToAiChat = () => {
    console.log("Selected:", selectedCategory, selectedSubCategory, interviewType, selectedSkills);

    navigate('/AiChat');
  };

  return (
    <FormWrapper>
      <TitleInput type="text" placeholder="제목" />

      <SectionLabel>대분류</SectionLabel>
      <CategorySelect value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">--카테고리 선택--</option>
        {categoryList.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </CategorySelect>

      {selectedCategory && (
        <>
          <SectionLabel>세부분류</SectionLabel>
          <CategorySelect value={selectedSubCategory} onChange={handleSubCategoryChange}>
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
          <CategorySelect value={companyType} onChange={handleCompanyTypeChange}>
            <option value="">--지원 기업 형태 선택--</option>
            <option value="대기업">대기업</option>
            <option value="중소기업">중소기업</option>
            <option value="스타트업">스타트업</option>
            <option value="공공기관">공공기관</option>
          </CategorySelect>

          {/* 👇 경력 여부 */}
          <SectionLabel>경력 여부</SectionLabel>
          <CategorySelect value={careerLevel} onChange={handleCareerLevelChange}>
            <option value="">--경력 선택--</option>
            <option value="신입">신입</option>
            <option value="1~3년">1~3년</option>
            <option value="4~6년">4~6년</option>
            <option value="7년 이상">7년 이상</option>
          </CategorySelect>

          {/* 👇 면접 유형 */}
          <SectionLabel>면접 유형</SectionLabel>
          <CategorySelect value={interviewType} onChange={handleInterviewTypeChange}>
            <option value="">--면접 유형 선택--</option>
            <option value="직무 면접">직무 면접</option>
            <option value="인성 면접">인성 면접</option>
            <option value="케이스 면접">케이스 면접</option>
            <option value="기술 면접">기술 면접</option>
          </CategorySelect>

          {/* 👇 기술 스택 */}
          <SectionLabel>기술 스택</SectionLabel>
          <CheckBoxGroup>
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
