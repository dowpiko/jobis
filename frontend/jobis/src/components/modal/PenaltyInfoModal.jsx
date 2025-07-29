import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 420px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: #1f2a37;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: #5c8bc4;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
  float: right;
`;

const PenaltyInfoModal = ({ penalty, onClose }) => (
  <ModalOverlay onClick={onClose}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <h3>패널티 안내</h3>
      <p style={{ marginBottom: '10px' }}>
        모의면접 일정에 <strong>참여자가 있는 상태</strong>에서
        <br />
        <strong>24시간 이내에 일정을 취소</strong>하면 패널티가 부과됩니다.
      </p>

      <p>패널티는 누적되며, 누적 횟수에 따라 아래와 같이 일정 생성 및 참여가 제한됩니다:</p>

      <ul style={{ paddingLeft: '20px', lineHeight: '1.6', marginBottom: '12px' }}>
        <li><strong>3회 누적</strong>: 3일 제한</li>
        <li><strong>6회 누적</strong>: 7일 제한</li>
        <li><strong>9회 누적</strong>: 2주 제한</li>
        <li><strong>12회 누적</strong>: 1개월 제한</li>
        <li><strong>15회 누적</strong>: 3개월 제한</li>
        <li><strong>18회 이상</strong>: 6개월 제한 (그 이후도 6개월 고정)</li>
      </ul>

     <p style={{ fontSize: '13px', color: '#6b7280' }}>
        ※ 패널티는 자동으로 해제되며, 해제되기 전까지는 일정 생성 및 참여가 제한됩니다.
      </p>
    {penalty?.count !== undefined && (
      <p style={{ marginTop: '12px', fontSize: '13px', color: '#1f2a37' }}>
        현재 누적 패널티: <strong>{penalty.count}회</strong>
      </p>
    )}

      <CloseButton onClick={onClose}>확인</CloseButton>
    </ModalContent>
  </ModalOverlay>
);

export default PenaltyInfoModal;
