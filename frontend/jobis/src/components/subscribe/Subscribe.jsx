import PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	max-width: 960px;
	margin: 0 auto;
	padding: 60px 24px;
	font-family: 'Pretendard', 'Inter', sans-serif;
	color: #1f2937;
`;

const Title = styled.h1`
	font-size: 2.8rem;
	font-weight: bold;
	text-align: center;
	margin-bottom: 20px;
	color: #111827;
`;

const DescriptionBox = styled.div`
	background-color: #f3f4f6;
	padding: 24px;
	border-radius: 16px;
	margin-bottom: 48px;
	color: #374151;
`;

const DescriptionList = styled.ul`
	font-size: 1.1rem;
	line-height: 1.8;
	list-style-type: disc;
	padding-left: 20px;
`;

const Plans = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 24px;
	margin-bottom: 32px;

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

const PlanCard = styled.div`
	background: ${props => (props.selected ? '#e0f2fe' : '#f9fafb')};
	border: 2px solid ${props => (props.selected ? '#0ea5e9' : '#d1d5db')};
	border-radius: 16px;
	padding: 24px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: ${props => (props.selected ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none')};
	
	&:hover {
		transform: translateY(-5px);
		border-color: #0ea5e9;
	}
`;

const PlanTitle = styled.div`
	font-size: 1.25rem;
	font-weight: 600;
	margin-bottom: 12px;
`;

const Price = styled.div`
	font-size: 1.1rem;
	margin-bottom: 8px;
	span.line {
		text-decoration: line-through;
		color: #9ca3af;
		margin-right: 6px;
	}
	span.discounted {
		font-weight: 700;
		color: #1d4ed8;
	}
`;

const DiscountTag = styled.div`
	font-size: 0.9rem;
	color: #0ea5e9;
	font-weight: 500;
`;

const PaymentTrigger = styled.button`
	display: block;
	margin: 0 auto;
	background-color: #1d4ed8;
	color: #fff;
	border: none;
	padding: 14px 32px;
	font-size: 1.1rem;
	font-weight: 600;
	border-radius: 12px;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: #2563eb;
	}
`;

const PaymentModal = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

const ModalContent = styled.div`
	background: white;
	border-radius: 16px;
	padding: 32px;
	text-align: center;
	min-width: 320px;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const ModalButton = styled.button`
	display: block;
	width: 100%;
	padding: 14px;
	margin-top: 12px;
	border: none;
	border-radius: 10px;
	font-size: 1rem;
	background-color: ${props => (props.type === 'kakao' ? '#fee500' : '#4f46e5')};
	color: ${props => (props.type === 'kakao' ? '#000' : '#fff')};
	cursor: pointer;
	font-weight: 600;
	transition: all 0.2s;

	&:hover {
		opacity: 0.9;
	}
`;

const storeId = process.env.REACT_APP_STORE_ID;
const tossChannelKey = process.env.REACT_APP_TOSS_CHANNEL_KEY;
const kakaoChannelKey = process.env.REACT_APP_KAKAO_CHANNEL_KEY;
const host = process.env.REACT_APP_HOST;

const plans = [
	{ months: 1, discount: 0 },
	{ months: 3, discount: 5 },
	{ months: 6, discount: 12 },
	{ months: 12, discount: 20 },
];

const Subscribe = () => {
	const [selectedPlan, setSelectedPlan] = useState(plans[0]);
	const [showModal, setShowModal] = useState(false);

	const basePrice = 21000;

	const handlePayment = async (type) => {
		const paymentId = `payment-${crypto.randomUUID()}`;
		const totalBefore = basePrice * selectedPlan.months;
		const discount = (totalBefore * selectedPlan.discount) / 100;
		const totalAmount = totalBefore - discount;

		const channelKey =
			type === 'kakao' ? kakaoChannelKey :
			type === 'toss' ? tossChannelKey : null;
		const payMethod = type === 'kakao' ? 'EASY_PAY' : 'CARD';

		if (!channelKey) return;

		const response = await PortOne.requestPayment({
			storeId,
			channelKey,
			paymentId,
			orderName: `${selectedPlan.months}개월 구독`,
			totalAmount,
			currency: 'KRW',
			payMethod,
		});

		if (response.code !== undefined) {
			if (response.code === 'FAILURE_TYPE_PG') return;
			alert(`결제 실패: ${response.message}`);
			return;
		}

		try {
			const res = await axios.post(`http://${host}:9090/payment/complete`, {
				paymentId: response.paymentId,
				totalAmount,
			});

			const result = res.data;

			if (result === 'PAID') alert('✅ 결제 완료되었습니다!');
			else if (result === 'VIRTUAL_ACCOUNT_ISSUED') alert('📥 가상계좌가 발급되었습니다.');
			else alert(`⚠️ 기타 상태 응답: ${result}`);
		} catch (e) {
			console.error('❌ 서버 통신 오류:', e);
			alert('서버와 통신 중 문제가 발생했습니다.');
		}
	};

	return (
		<Container>
			<Title>프리미엄 구독</Title>
			<DescriptionBox>
				<DescriptionList>
					<li>AI 면접관과의 실전 같은 <strong>무제한 모의 면접</strong> 제공</li>
					<li>개선 포인트까지 제시하는 <strong>AI 기반 면접 결과 분석 리포트</strong></li>
					<li>사용자의 직무와 경력에 맞춘 <strong>맞춤형 질문 세트</strong> 구성</li>
					<li><strong>구독 기간 동안</strong> 언제든 반복 연습 가능</li>
					<li>신규 기능 및 업데이트 <strong>우선 적용</strong> 혜택</li>
				</DescriptionList>
			</DescriptionBox>

			<Plans>
				{plans.map((plan) => {
					const origin = basePrice * plan.months;
					const discounted = origin - (origin * plan.discount) / 100;
					return (
						<PlanCard
							key={plan.months}
							selected={selectedPlan.months === plan.months}
							onClick={() => setSelectedPlan(plan)}>
							<PlanTitle>{plan.months}개월</PlanTitle>
							<Price>
								{plan.discount > 0 && <span className="line">{origin.toLocaleString()}원</span>}
								<span className="discounted">{discounted.toLocaleString()}원</span>
							</Price>
							<DiscountTag>{plan.discount > 0 ? `${plan.discount}% 할인` : '정가'}</DiscountTag>
						</PlanCard>
					);
				})}
			</Plans>

			<PaymentTrigger onClick={() => setShowModal(true)}>결제</PaymentTrigger>

			{showModal && (
				<PaymentModal onClick={() => setShowModal(false)}>
					<ModalContent onClick={(e) => e.stopPropagation()}>
						<h3>결제 수단 선택</h3>
						<ModalButton type="toss" onClick={() => handlePayment('toss')}>카드결제 (토스)</ModalButton>
						<ModalButton type="kakao" onClick={() => handlePayment('kakao')}>카카오페이 간편결제</ModalButton>
					</ModalContent>
				</PaymentModal>
			)}
		</Container>
	);
};

export default Subscribe;
