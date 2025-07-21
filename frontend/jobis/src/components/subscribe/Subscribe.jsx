import PortOne from '@portone/browser-sdk/v2';
import axios from 'axios';
import React, { useEffect } from 'react';
import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 50px;
`;

const Title = styled.h1`
	font-size: 2rem;
	margin-bottom: 30px;
`;

const SubscribeButton = styled.button`
	background-color: ${(props) =>
		props.type === 'kakao' ? '#fee500' : '#4f46e5'};
	color: ${(props) =>
		props.type === 'kakao' ? '#000000' : '#ffffff'};
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.3s;
	margin: 10px;

	&:hover {
		opacity: 0.9;
	}

	&:disabled {
		background-color: #a5b4fc;
		cursor: not-allowed;
	}
`;

const storeId = process.env.REACT_APP_STORE_ID;
const tossChannelKey = process.env.REACT_APP_TOSS_CHANNEL_KEY;
const kakaoChannelKey = process.env.REACT_APP_KAKAO_CHANNEL_KEY;
const host = process.env.REACT_APP_HOST;

const Subscribe = () => {
	const handlePayment = async (type) => {
		const paymentId = `payment-${crypto.randomUUID()}`;
		const orderName = '나이키 와플 트레이너 2 SD';
		const totalAmount = 10000;

		const channelKey =
			type === 'kakao' ? kakaoChannelKey :
			type === 'toss' ? tossChannelKey :
			null;
    const payMethod = type === 'kakao' ? 'EASY_PAY' : 'CARD';

		if (!channelKey) {
			console.error('지원되지 않는 결제 방식입니다.');
			return;
		}

		const response = await PortOne.requestPayment({
			storeId,
			channelKey,
			paymentId,
			orderName,
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
				totalAmount: totalAmount,
			});

			const result = res.data;

			if (result === 'PAID') {
				alert('✅ 결제 완료되었습니다!');
			} else if (result === 'VIRTUAL_ACCOUNT_ISSUED') {
				alert('📥 가상계좌가 발급되었습니다. 입금 시 결제가 완료됩니다.');
			} else {
				alert(`⚠️ 기타 상태 응답: ${result}`);
			}
		} catch (e) {
			console.error('❌ 서버 통신 오류:', e);
			alert('서버와 통신 중 문제가 발생했습니다.');
		}
	};

	return (
		<Container>
			<Title>구독 페이지</Title>
			<SubscribeButton type="toss" onClick={() => handlePayment('toss')}>
				토스페이 결제
			</SubscribeButton>
			<SubscribeButton type="kakao" onClick={() => handlePayment('kakao')}>
				카카오페이 결제
			</SubscribeButton>
		</Container>
	);
};

export default Subscribe;