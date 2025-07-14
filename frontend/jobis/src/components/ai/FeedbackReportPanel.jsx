import React from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f9fafb;
	padding: 24px;
	overflow-y: auto;
`;

const ToggleButton = styled.button`
	position: absolute;
	left: -16px;
	top: 50%;
	transform: translateY(-50%);
	width: 32px;
	height: 64px;
	border: none;
	background-color: #e2e8f0;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: #cbd5e1;
	}
`;

const Title = styled.h2`
	font-size: 24px;
	font-weight: 700;
	color: #1e293b;
	margin-bottom: 20px;
`;

const FeedbackCard = styled.div`
	background: white;
	padding: 20px;
	margin-bottom: 24px;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CategoryTitle = styled.h3`
	font-size: 18px;
	font-weight: 600;
	margin-bottom: 10px;
	color: #334155;
`;

const Section = styled.div`
	margin-bottom: 16px;
`;

const Label = styled.div`
	font-size: 14px;
	font-weight: 600;
	margin-bottom: 6px;
	color: #64748b;
`;

const Text = styled.p`
	font-size: 15px;
	line-height: 1.6;
	color: #1e293b;
	white-space: pre-wrap;
`;

const FeedbackReportPanel = ({ feedback, isExpanded, onToggle }) => {
	if (!feedback || typeof feedback !== 'object') return null;

	const entries = Object.entries(feedback);
  console.log(feedback);
	return (
		<Wrapper>
			<ToggleButton onClick={onToggle}>
				{isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
			</ToggleButton>

			<Title>AI 평가 결과</Title>
			{entries.map(([key, value]) => (
				<FeedbackCard key={key}>
					<CategoryTitle>{key}</CategoryTitle>
					<Section>
						<Label>현재 수준</Label>
						<Text>{value.currentState}</Text>
					</Section>
					<Section>
						<Label>개선 방안</Label>
						<Text>{value.suggestion}</Text>
					</Section>
				</FeedbackCard>
			))}
		</Wrapper>
	);
};

export default FeedbackReportPanel;
