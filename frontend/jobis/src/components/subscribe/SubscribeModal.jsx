import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(4px);
	background-color: rgba(0, 0, 0, 0.4);
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ModalContent = styled.div`
	background: linear-gradient(to bottom right, #ffffff, #f1f5f9);
	padding: 40px;
	border-radius: 20px;
	width: 90%;
	max-width: 700px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
	border: 1px solid #dbeafe; /* 연한 파란색 테두리 */
	position: relative;
	backdrop-filter: blur(6px);
	transition: box-shadow 0.3s ease;
`;


const CloseButton = styled.button`
	position: absolute;
	top: 16px;
	right: 16px;
	width: 36px;
	height: 36px;
	border: none;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.05);
	color: #374151;
	font-size: 20px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	transition: background 0.3s ease, transform 0.2s ease;

	&:hover {
		background: rgba(0, 0, 0, 0.1);
	}
`;


const PlanBox = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20px;
	margin-top: 20px;
`;

const Plan = styled.div`
	background: ${({ selected }) => (selected ? '#e0f2fe' : '#f3f4f6')};
	padding: 20px;
	border-radius: 12px;
	border: 2px solid ${({ selected }) => (selected ? '#0ea5e9' : '#d1d5db')};
	cursor: pointer;
	text-align: center;
`;

const ModalButton = styled.button`
	width: 100%;
	margin-top: 24px;
	padding: 14px;
	border: none;
	border-radius: 10px;
	font-size: 1rem;
	background-color: ${({ type }) => (type === 'kakao' ? '#fee500' : '#4f46e5')};
	color: ${({ type }) => (type === 'kakao' ? '#000' : '#fff')};
	cursor: pointer;
	font-weight: 600;

	&:hover {
		opacity: 0.9;
	}
`;

const BenefitBox = styled.div`
	margin-top: 12px;
	background-color: #f9fafb;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	padding: 20px;
`;

const BenefitList = styled.ul`
	list-style-type: disc;
	padding-left: 20px;
	color: #374151;
	font-size: 15px;
	line-height: 1.8;
`;

const PriceText = styled.div`
	margin-top: 8px;
	font-size: 16px;
`;

const OriginalPrice = styled.span`
	text-decoration: line-through;
	color: #9ca3af;
	margin-right: 6px;
	font-size: 14px;
`;

const DiscountedPrice = styled.span`
	color: #1d4ed8;
	font-weight: 700;
`;

const DiscountTag = styled.div`
	margin-top: 4px;
	font-size: 14px;
	color: #0ea5e9;
	font-weight: 600;
`;

const plans = [
	{ months: 1, discount: 0 },
	{ months: 3, discount: 5 },
	{ months: 6, discount: 12 },
	{ months: 12, discount: 20 },
];

const storeId = process.env.REACT_APP_STORE_ID;
const tossChannelKey = process.env.REACT_APP_TOSS_CHANNEL_KEY;
const kakaoChannelKey = process.env.REACT_APP_KAKAO_CHANNEL_KEY;
const host = process.env.REACT_APP_HOST;

const SubscribeModal = ({ onClose, uno, onSubscribed}) => {
	const [selectedPlan, setSelectedPlan] = useState(plans[0]);
	const basePrice = 17000;
	const handlePayment = async (type) => {
		const paymentId = `payment-${crypto.randomUUID()}`;
		const totalBefore = basePrice * selectedPlan.months;
		const discount = (totalBefore * selectedPlan.discount) / 100;
		const totalAmount = totalBefore - discount;

		const channelKey = type === 'kakao' ? kakaoChannelKey : tossChannelKey;
		const payMethod = type === 'kakao' ? 'EASY_PAY' : 'CARD';

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
			if(response.code == 'FAILURE_TYPE_PG')
				return
			alert(`결제 실패: ${response.message}`);
			return;
		}

		try {
			const res = await axios.post(`http://${host}:9090/payment/complete`, {
				paymentId: response.paymentId,
				totalAmount,
				months: selectedPlan.months,
				uno,
			}, {
				withCredentials: true  // 🔥 필수!!!
			});

			if (res.data === 'PAID') {
				alert('✅ 결제 완료!');
				onSubscribed();  // ✅ 구독 상태 갱신 트리거
			}	else {
				alert(`⚠️ 상태: ${res.data}`);
			}
			onClose();
		} catch (e) {
			alert('서버 오류');
		}
	};

	return (
		<Overlay onClick={onClose}>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				<CloseButton onClick={onClose}>×</CloseButton>
				<h2>프리미엄 구독</h2>

				<BenefitBox>
					<BenefitList>
						<li><strong>AI 모의 면접</strong>을 무제한으로 진행할 수 있어요.</li>
						<li><strong>AI 면접 피드백</strong>을 횟수 제한 없이 받을 수 있어요.</li>
						<li><strong>구독 기간 동안</strong> 반복 연습이 가능해요.</li>
						<li>앞으로 추가될 <strong>신기능을 가장 먼저 사용</strong>할 수 있어요.</li>
					</BenefitList>
				</BenefitBox>

				<PlanBox>
					{plans.map((plan) => {
						const origin = basePrice * plan.months;
						const discounted = origin - (origin * plan.discount) / 100;

						return (
							<Plan
								key={plan.months}
								selected={selectedPlan.months === plan.months}
								onClick={() => setSelectedPlan(plan)}
							>
								<h4>{plan.months}개월</h4>
								<PriceText>
									{!isNaN(origin) && plan.discount > 0 && (
										<OriginalPrice>{origin.toLocaleString()}원</OriginalPrice>
									)}
									{!isNaN(discounted) && (
										<DiscountedPrice>{discounted.toLocaleString()}원</DiscountedPrice>
									)}
								</PriceText>
								{plan.discount > 0 && <DiscountTag>{plan.discount}% 할인</DiscountTag>}
							</Plan>
						);
					})}
				</PlanBox>

				<ModalButton type="toss" onClick={() => handlePayment('toss')}>카드결제 (토스)</ModalButton>
				<ModalButton type="kakao" onClick={() => handlePayment('kakao')}>카카오페이 간편결제</ModalButton>
			</ModalContent>
		</Overlay>
	);
};

export default SubscribeModal;
