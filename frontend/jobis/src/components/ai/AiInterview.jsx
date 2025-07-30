import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import SubscribeModal from '../subscribe/SubscribeModal';


const Container = styled.div`
	width: 100%;
	max-width: 800px; /* ✅ 전체 회색 영역 제한 */
	margin: 0 auto;     /* ✅ 가운데 정렬 */
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 32px 24px;
	box-sizing: border-box;
	background-color: #F9FAFB;
	font-family: 'Inter', sans-serif;
	overflow: hidden;
	border-radius: 16px; /* 선택사항: 살짝 둥글게 */
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.03); /* 선택사항: 살짝 입체감 */
`;


const ContentWrapper = styled.div`
	width: 100%;
	margin: 0 auto; /* ✅ 화면 내에서 중앙 정렬 (left align 유지하면서) */
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	align-items: flex-start; 
	overflow: hidden;
`;


const Title = styled.h1`
	font-size: 32px;
	font-weight: 700;
	color: #1F2A37;
	margin-bottom: 16px;
	text-align: left; /* ✅ 명시적 왼쪽 정렬 */
`;

const Description = styled.p`
	font-size: 16px;
	color: #4B5563;
	line-height: 1.6;
	text-align: left; /* ✅ */
`;

const Highlight = styled.span`
	color: #2563EB;
	font-weight: 600;
`;

const ImageBox = styled.div`
	width: 100%;
	max-width: 800px;
	background-color: #E5E7EB;
	border-radius: 12px;
	overflow: hidden;
	margin: 40px 0 20px;
	display: flex;
	justify-content: center;
	align-items: center;

	img {
		width: 100%;
		height: auto;         /* ✅ 이미지 비율 유지하면서 잘리지 않게 */
		object-fit: contain;  /* ✅ 이미지 전체 보이게 */
	}
`;


const ImageDescription = styled.p`
	font-size: 14px;
	color: #6B7280;
	text-align: left; /* ✅ */
	width: 100%; /* 텍스트 너비를 부모에 맞추기 위해 */
	max-width: 800px;
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 20px;
`;

const StartButton = styled.button`
	padding: 14px 28px;
	background-color: ${({ $dimmed }) => ($dimmed ? '#3B82F6' : '#2563EB')}; /* 🔹 어두운 파랑 */
	color: white;
	font-size: 16px;
	font-weight: 600;
	border: none;
	border-radius: 12px;
	cursor: pointer;
	transition: 0.3s;
	opacity: ${({ $dimmed }) => ($dimmed ? 0.75 : 1)};  /* 🔹 살짝 흐리게 */

	&:hover {
		background-color: ${({ $dimmed }) => ($dimmed ? '#1E3A8A' : '#1E40AF')};
		transform: scale(1.03);
	}
`;


const NextTryInfo = styled.p`
	margin-top: 8px;
	color: #6B7280;
	font-size: 14px;
	text-align: center;
`;

const host = process.env.REACT_APP_HOST;

const AiInterview = () => {
	const navigate = useNavigate();
	const [subscribe, setSubscribe] = useState(0);
	const [canStartToday, setCanStartToday] = useState(false);
	const [showSubscribeModal, setShowSubscribeModal] = useState(false);
	const [uno, setUno] = useState(null);
	const [subscribeUpdated, setSubscribeUpdated] = useState(false);
	const handleStartClick = () => {
		if (subscribe !== 1 && !canStartToday) {
			setShowSubscribeModal(true);
		} else {
			navigate('/createAiInterview');
		}
	};


	useEffect(() => {
		const getUserInfo = async () => {
			try {
				const res = await axios.get(`http://${host}:9090/user/getUser`, {withCredentials:true});
				const user = res.data;
				if (!user) return;
				
				setUno(user.uno);
				setSubscribe(user.subscribe);

				if (user.subscribe === 1) {
					setCanStartToday(true); // 구독자는 무제한
				} else {
					if (!user.lastTryDate) {
						setCanStartToday(true); // 처음 이용자
					} else {
						// ✅ 날짜를 'yyyy. M. d.' 형식 문자열로 비교 (KST 기준)
						const todayStr = new Date().toLocaleDateString('ko-KR');
						const lastDateStr = new Date(user.lastTryDate).toLocaleDateString('ko-KR');

						setCanStartToday(todayStr !== lastDateStr);
					}
				}
			} catch (err) {
				console.error('유저 정보 가져오기 실패:', err);
			}
		};

		getUserInfo();
	}, []);
	
	useEffect(() => {
		if (subscribeUpdated) {
			navigate(0);  // 🔁 새로고침 → 최신 user 반영됨
		}
	}, [subscribeUpdated]);




	return (
		<Container>
			<ContentWrapper>
				<Title>AI 모의 면접이란?</Title>
				<Description>
					AI 면접은 <Highlight>경력</Highlight>, <Highlight>직무 목표</Highlight>, <Highlight>기술 스택</Highlight>을 바탕으로 질문을 생성하고,
					<Highlight>리더십</Highlight>, <Highlight>소통력</Highlight>, <Highlight>창의력</Highlight> 등의 역량을 종합 평가합니다. <br /><br />
					면접은 실제 상황처럼 구성되며, AI가 질문하고 응답을 분석하여 각 역량별 <Highlight>점수</Highlight>와 <Highlight>개선 피드백</Highlight>을 제공합니다.
					이를 통해 본인의 면접 역량을 구체적으로 점검하고, 반복 훈련을 통해 성장할 수 있습니다.
				</Description>


				<ImageBox>
					<img src="/img/resEx.png" alt="예시 이미지 1" />
				</ImageBox>

				<ImageDescription>
					면접 결과를 <Highlight>레이다 차트</Highlight> 및 <Highlight>막대그래프</Highlight>로 시각화하여
					자신의 <Highlight>성장 추이</Highlight>를 쉽게 확인할 수 있습니다.
				</ImageDescription>
			</ContentWrapper>
			
			<ButtonWrapper>
				<StartButton
					onClick={handleStartClick}
					$dimmed={subscribe !== 1 && !canStartToday}
				>
						AI 면접 시작하기
						{subscribe !== 1 && (
							<> ({canStartToday ? '1' : '0'})</>
						)}
				</StartButton>
			</ButtonWrapper>

			{!canStartToday && (
				<NextTryInfo>
					다음 면접 가능: {format(addDays(new Date(), 1), 'M월 d일 (E)', { locale: ko })} 자정 이후
				</NextTryInfo>
			)}
			{showSubscribeModal && (
				<SubscribeModal
					onClose={() => setShowSubscribeModal(false)}
					onSubscribed={() => setSubscribeUpdated(prev => !prev)}  // 상태 토글로 useEffect 트리거
					uno={uno}
				/>
			)}
		</Container>
	);
};

export default AiInterview;
