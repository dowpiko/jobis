import React from 'react';
import styled from 'styled-components';

const CompanyImage = styled.img`
  width: 300px;
  height: auto;
  margin: 0 auto 16px;
  display: block;
  object-fit: cover;
`;



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background-color: #f0f2f5;
  padding: 40px 50px;
  border-radius: 12px;
  width: 480px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 24px;
  font-weight: normal;
  color: #1f2a37;

  b {
    font-weight: bold;
    color: #4376b6;
  }
`;

const Info = styled.div`
  margin-bottom: 24px;
  font-size: 14px;
  color: #4b5563;
  padding: 16px;
  border: 1px solid #D1DAE4;
  border-radius: 8px;
  background-color: #ffffff;

  p {
    margin: 6px 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 10px 18px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  ${({ primary }) =>
    primary
      ? `
    background-color: #5c8bc4;
    color: white;

    &:hover {
      background-color: #4376b6;
    }
  `
      : `
    background-color: #e5e7eb;
    color: #374151;

    &:hover {
      background-color: #d1d5db;
    }
  `}
`;

const CompanyModal = ({ offer, onClose, onGoApply }) => {
  if (!offer) return null;

  const getDday = (timestamp) => {
    if (!timestamp) return '-';
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const target = new Date(timestamp);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target - today) / MS_PER_DAY);
    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-Day';
    return `D+${Math.abs(diffDays)}`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CompanyImage src={`/profile/${offer.uno}.png`} alt={`${offer.corpName} 프로필`} />
        <Title><b>{offer.corpName}</b></Title>
        <Info>
          <p> <b>분야:</b> {offer.category}</p>
          <p> <b>제목:</b> {offer.title}</p>
          <p> <b>대표자명:</b> {offer.enpRprfnm}</p>
          <p> <b>주소:</b> {offer.enpBsadr}</p>
          {offer.enpEmpeCnt > 0 && (
            <p> <b>사원 수:</b> {offer.enpEmpeCnt}</p>
          )}
          <p> <b>마감일:</b> {getDday(offer.o_activedays)}</p>
        </Info>
        <ButtonWrapper>
          <ActionButton onClick={onClose}>닫기</ActionButton>
          <ActionButton primary onClick={onGoApply}>공고 보러가기</ActionButton>
        </ButtonWrapper>
      </ModalBox>
    </ModalOverlay>
  );
};

export default CompanyModal;
