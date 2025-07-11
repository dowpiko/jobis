import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
	height: 100%;
	padding: 60px 40px 40px;
	font-family: 'Inter', sans-serif;
	color: #1F2A37;
	background-color: #F9FAFB;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
`;

const Title = styled.h1`
	font-size: 32px;
	font-weight: 700;
	margin-bottom: 20px;
	color: #1F2A37;
`;

const Description = styled.div`
	font-size: 17px;
	line-height: 1.8;
	color: #4B5563;
`;

const Highlight = styled.span`
	color: #2563EB;
	font-weight: 600;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 60px;
`;

const StartButton = styled.button`
	padding: 16px 36px;
	background-color: #2563EB;
	color: white;
	font-size: 18px;
	font-weight: 600;
	border: none;
	border-radius: 12px;
	cursor: pointer;
	transition: background-color 0.3s ease, transform 0.2s ease;

	&:hover {
		background-color: #1E40AF;
		transform: scale(1.03);
	}
`;

const AiInterview = () => {
	const navigate = useNavigate();

	const handleStartClick = () => {
		navigate('/createAiInterview');
	};

	return (
		<Container>
			<ContentWrapper>
				<Title>AI 모의 면접이란?</Title>
				<Description>
					AI 면접은 사용자의 <Highlight>경력</Highlight>, <Highlight>직무 목표</Highlight>, <Highlight>기술 스택</Highlight>을 바탕으로
					개인화된 질문을 생성하여, <Highlight>리더십</Highlight>, <Highlight>소통력</Highlight>, <Highlight>창의력</Highlight>, <Highlight>분석력</Highlight>, <Highlight>실행력</Highlight> 등
					핵심 역량을 종합적으로 평가합니다. <br /><br />
					실제 면접 상황을 가정하여 질문과 피드백이 주어지며, 그에 대한 답변은 AI에 의해 평가되어 역량별 점수와 함께
					개선 코멘트를 받을 수 있습니다.
				</Description>
			</ContentWrapper>

			<ButtonWrapper>
				<StartButton onClick={handleStartClick}>
					AI 면접 시작하기
				</StartButton>
			</ButtonWrapper>
		</Container>
	);
};

export default AiInterview;
