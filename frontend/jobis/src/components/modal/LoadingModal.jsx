import React from 'react';
import styled from 'styled-components';

const LoadingOverlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(5px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

const LoadingBox = styled.div`
	background: rgba(255, 255, 255, 0.9);
	padding: 40px;
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`;

const Spinner = styled.div`
	width: 40px;
	height: 40px;
	border: 4px solid #dbeafe;
	border-top: 4px solid #2563eb;
	border-radius: 50%;
	animation: spin 1s linear infinite;

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
`;

const LoadingText = styled.div`
	font-size: 18px;
	color: #1e293b;
	font-weight: 500;
`;

const LoadingModal = () => {
  return (
    <LoadingOverlay>
      <LoadingBox>
        <Spinner />
        <LoadingText>AI 분석 중입니다...</LoadingText>
      </LoadingBox>
    </LoadingOverlay>
  );
};

export default LoadingModal;