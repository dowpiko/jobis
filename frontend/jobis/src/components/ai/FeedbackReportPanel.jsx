import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: visible;
`;


const Wrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #f9fafb;
	padding: 24px 32px 24px 32px;  // ✅ 오른쪽 여백 확보
	box-sizing: border-box;       // ✅ 패딩 포함 계산
	overflow-y: auto;
	overflow-x: hidden;
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

const categoryLabels = {
	coreCompetency: '핵심 역량 전달력',
	jobRelevance: '직무 연관성',
	expressionClarity: '표현력 및 커뮤니케이션',
	languagePolish: '문장 구성 및 문체 적합성',
	attitudeMessage: '태도 및 메타 메시지'
};

const FeedbackReportPanel = ({ feedback }) => {
	if (!feedback || typeof feedback !== 'object') return null;

	const entries = Object.entries(feedback);
	return (
		<PanelContainer>
			<Wrapper>
				<Title>AI 평가 결과</Title>
				{entries.map(([key, value]) => (
					<FeedbackCard key={key}>
						<CategoryTitle>{categoryLabels[key] || key}</CategoryTitle>
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
		</PanelContainer>
	);
};

export default FeedbackReportPanel;
