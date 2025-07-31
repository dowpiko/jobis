import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 150px auto;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-size: 24px;
  color: #1F2A37;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 60%;
  margin-bottom: 24px;
  border: 1px solid #B0BCCB;
  border-radius: 6px;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 80px);
  justify-content: center;
  gap: 20px 20px;
`;

const ImageOption = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: ${({ selected }) => (selected ? '3px solid #4376B6' : '2px solid #B0BCCB')};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #4376B6;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 24px;
  background-color: #4376B6;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5C8BC4;
  }
`;

const host = process.env.REACT_APP_HOST;

const CreateProfileForm = () => {
  const [nickname, setNickname] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!nickname.trim()) return alert('닉네임을 입력해주세요.');

    try {
      const payload = {
        nickname,
        profileimage: selectedImageIndex,
      };
      const res = await axios.post(`http://${host}:9090/user/createProfile`, payload, {withCredentials:true});

      if (res.data.success) {
        alert('프로필이 생성되었습니다!');
        navigate('/scheduleManager');
      } else {
        alert(res.data.message || '프로필 생성 실패');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류 발생');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/files/profile-list');
        setImages(res.data.files);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <Container>
      <Title>프로필 생성</Title>
      <Input
        placeholder="닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <ImageGrid>
        {images.map((img, idx) => (
          <ImageOption
            key={idx}
            src={img.url}
            alt={img.filename}
            onClick={() => setSelectedImageIndex(idx)}
            selected={selectedImageIndex === idx}
          />
        ))}
      </ImageGrid>
      <SubmitButton onClick={handleSubmit}>프로필 생성하기</SubmitButton>
    </Container>
  );
};

export default CreateProfileForm;
