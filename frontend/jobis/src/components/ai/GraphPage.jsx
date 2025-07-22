import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis,
  BarChart, Bar, Cell,
  AreaChart, Area,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import axios from 'axios';
import AiHistoryForGraphPage from './AiHistoryForGraphPage';
import { leader, analytical, creative, executive, communicative } from '../../data/evaluation';
import LoadingModal from '../modal/LoadingModal';
import FeedbackReportPanel from './FeedbackReportPanel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubscribeModal from '../subscribe/SubscribeModal';


const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color:rgb(225, 226, 235);  // 기존보다 진한 회색톤으로 조정
	color: #1E1E1E;
	box-sizing: border-box;
	overflow: hidden;
`;


const Wrapper = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 20px;
	overflow: hidden;
`;

const KpiWrapper = styled.div`
	display: flex;
	gap: 20px;
	margin-bottom: 20px;
`;

const KpiCard = styled.div`
	flex: 1;
	background: #FFFFFF;
	padding: 16px;
	border-radius: 8px;
	border: 1px solid #E2E8F0;
	text-align: center;
`;

const KpiValue = styled.div`
	font-size: 28px;
	font-weight: bold;
	color: #2563EB;
`;

const KpiLabel = styled.div`
	font-size: 14px;
	margin-top: 4px;
	color: #6B7280;
`;

const ContentBox = styled.div`
	display: flex;
	gap: 20px;
	flex: 1;
	overflow: hidden;
	height: 100%;
`;

const Sidebar = styled.div`
	width: 260px;
	background: #E9F1F9;  // 메인과 어울리는 밝은 푸른 회색 계열
	padding: 20px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
	border: 1px solid #D5DFEA;  // 기존보다 약간 어둡게
`;



const ToggleContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })`
	position: relative;
	width: 44px;
	height: 24px;
	-webkit-appearance: none;
	background: #cbd5e1;
	border-radius: 12px;
	outline: none;
	transition: background 0.3s;
	cursor: pointer;

  &:checked {
    background: #60a5fa; /* 파란 계열 (blue-400) */
  }

	&::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		transition: 0.3s;
	}

	&:checked::after {
		left: 22px;
	}
`;

const InterviewList = styled.div`
	flex: 1;
	overflow-y: auto;
`;

const InterviewCard = styled.div`
	padding: 10px;
	background: ${({ $selected }) => ($selected ? '#D6E4FF' : '#FFFFFF')}; // 밝은 배경 톤
	border: 1px solid ${({ $selected }) => ($selected ? '#2563EB' : '#E2E8F0')};
	border-radius: 6px;
	margin-bottom: 8px;
	cursor: pointer;
	color: #1E1E1E; // 어두운 텍스트
	display: flex;
	justify-content: space-between;
	overflow: hidden;
	transition: background 0.2s ease;

	&:hover {
		background: #E8F0FF;
	}
`;



const Paging = styled.div`
	margin-top: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;

	input {
		width: 40px;
		padding: 4px;
		border-radius: 4px;
		border: 1px solid #cbd5e1;
    background: #ffffff;
	  color: #1e293b;
		text-align: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	}

	button {
		padding: 4px 8px;
		background: #2c3e50;
		color: #e1e8f0;
		border: none;
		border-radius: 4px;
		cursor: pointer;

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}
`;

const MainArea = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20px;
	overflow: hidden;
	height: 100%;
`;

const Panel = styled.div`
	background-color: #E9F1F9;  // 기존보다 톤 다운
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	flex: 1;
	min-height: 0;
`;

const DualPanel = styled.div`
	display: flex;
	gap: 20px;
	flex: 1;
	height: 100%;
  min-height: 0;
`;

const PanelSection = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const PanelContent = styled.div`
	flex: 1;
	min-height: 0;
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const InfoTitle = styled.h4`
	margin-bottom: 12px;
	font-size: 22px;
	font-weight: bold;
	color: #1E1E1E; // 기존 #ffffff → 어두운 텍스트로 변경
`;

const ChartToggle = styled.select`
	background: #EFF4FF; /* 밝은 배경 */
	color: #1E1E1E;      /* 어두운 글씨 */
	border: 1px solid #CBD5E1; /* 연한 테두리 */
	border-radius: 6px;
	padding: 6px 10px;
	font-size: 14px;
	cursor: pointer;
	box-shadow: 0 1px 2px rgba(0,0,0,0.05);

	&:focus {
		outline: none;
		border-color: #60A5FA;
		box-shadow: 0 0 0 2px rgba(96,165,250,0.3);
	}
`;

const LeftPanelBox = styled(PanelSection)`
	flex: ${({ $expanded }) => ($expanded ? 0 : 7)};
	height: 100%;
	transition: flex 0.4s ease;
`;


const RightPanelBox = styled(PanelSection)`
	flex: ${({ $expanded }) => ($expanded ? 10 : 3)};
	height: 100%;
	overflow: visible;
	position: relative;
	transition: flex 0.4s ease;
`;


const LeftPanel = styled(Panel)`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const RightPanel = styled(Panel)`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const AnimatedPanelWrapper = styled.div`
	flex: 1;
	height: 100%;
	position: relative;
`;

const AnimatedPanel = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	gap: 20px;
	transition: opacity 0.5s ease, transform 0.5s ease;
	opacity: ${({ $show }) => ($show ? 1 : 0)};
	transform: ${({ $show }) => ($show ? 'translateY(0)' : 'translateY(20px)')};
	pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
`;

const CustomTooltip = styled.div`
	position: fixed;
	background: #F9FAFB; /* 밝은 회색 배경 */
	color: #1E293B;       /* 짙은 남색 텍스트 */
	font-size: 15px;
	padding: 10px 14px;
	border-radius: 10px;
	white-space: nowrap;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	transform: translateY(-100%);
	pointer-events: none;
	z-index: 1000;
	border: 1px solid #CBD5E1;  /* 테두리도 밝게 */
	transition: opacity 0.2s ease-in-out;
	opacity: ${({ $show }) => ($show ? 1 : 0)};
	visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
	backdrop-filter: blur(4px);
`;


const RadarSectionLeft = styled(PanelSection)`
	flex: 7;
	padding-right: 10px;
	padding-bottom: 10px;
	height: 100%;
	min-height: 0;
`;

const RadarSectionRight = styled(PanelSection)`
	flex: 3;
	padding-bottom: 10px;
	height: 100%;
	min-height: 0;
`;

const DescriptionBox = styled.div`
	background-color: #F0F6FF;
	padding: 18px;
	border-radius: 8px;
	border: 1px solid #D0E3FF;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	color: #1E1E1E;
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
`;


const TraitTitleStyled = styled.div`
	font-size: 20px;
	font-weight: bold;
	color: #2563EB;
	margin-bottom: 12px;
`;


const TraitDescription = styled.div`
	color: #4B5563;
	font-size: 15px;
	margin-bottom: 16px;
`;


const TraitComment = styled.div`
	color: #1E293B;
	font-size: 15px;
	line-height: 1.6;
	overflow-y: auto;
	flex: 1;
`;
const AIContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 24px;
	background-color: #EFF6FF;
	border-radius: 12px;
	border: 1px solid #DBEAFE;
	box-sizing: border-box;
`;

const AIUnifiedTitle = styled.h3`
	font-size: 24px;
	font-weight: bold;
	color: #1E293B;
	margin-bottom: 24px;  // 제목 아래 여백 증가
`;

const AIUnifiedDescription = styled.p`
	font-size: 18px;
	color: #334155;
	line-height: 1.7;
	margin-bottom: 24px;
`;


const FlexibleBottomSpacer = styled.div`
	flex-grow: 1;
`;

const UnifiedButton = styled.button`
	background: linear-gradient(to right, #3B82F6, #60A5FA);
	color: white;
	border: none;
	border-radius: 9999px;
	padding: 10px 24px;
	font-size: 15px;
	font-weight: 600;
	cursor: pointer;
	align-self: center;
	margin-bottom: 8px;
	transition: background 0.3s ease;
	opacity: ${({ $dimmed }) => ($dimmed ? 0.75 : 1)};

	&:hover {
		background: linear-gradient(to right, #2563EB, #3B82F6);
	}
`;


const RightPanelToggleButton = styled.button`
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;

	width: 30px;
	height: 75px;

	background: rgba(80, 80, 80, 0.5);  // 🔵 기존보다 진한 배경
	backdrop-filter: blur(4px);
	border: 1px solid rgba(200, 200, 200, 0.3);
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	transition: background-color 0.3s ease, transform 0.2s ease;

	svg {
		color: white;  // ✅ 항상 흰색으로
		transition: color 0.3s ease;
	}

	&:hover {
		background: rgba(60, 60, 60, 0.6);  // 🔵 더 진한 배경으로 hover 효과
		transform: translateY(-50%) scale(1.05);
	}
`;

const BlurredPanelWrapper = styled.div`
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	overflow-y: hidden; 
	overflow-x: hidden;
	transition: filter 0.3s ease, opacity 0.3s ease;
`;

const radarTemplate = ['리더십','분석력','창의력','실행력','소통력'];
const radarDataTemplate = radarTemplate.map(s => ({ subject: s, A: 0 }));
const descriptions = {
  '리더십': '팀을 이끌고 문제 해결을 주도하는 능력입니다.',
  '분석력': '상황을 논리적으로 파악하고 문제를 구조화하는 능력입니다.',
  '창의력': '새로운 아이디어를 제시하고 유연하게 사고하는 능력입니다.',
  '실행력': '계획을 실천으로 옮기고 결과를 만들어내는 능력입니다.',
  '소통력': '상대와 원활히 소통하고 협업하는 능력입니다.',
};

function formatTimestamp(ms) {
	if (!ms || typeof ms !== 'number') return '';
	const date = new Date(ms);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `생성일: ${yyyy}-${mm}-${dd}`;
}

const getComment = (subject, score) => {
  const map = {
    '리더십': leader,
    '분석력': analytical,
    '창의력': creative,
    '실행력': executive,
    '소통력': communicative
  };
  const list = map[subject];
  if (!list || score == null) return '';

  const item = list.find(({ range }) => score >= range[0] && score <= range[1]);
  return item?.comment || '';
};
const host = process.env.REACT_APP_HOST;
export default function RadarSection() {
  const [selSubject, setSelSubject] = useState(null);
  const [selInterviewId, setSelInterviewId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [expandedAll, setExpandedAll] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [interviews, setInterviews] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subscribe, setSubscribe] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const uno = useRef(null);
  const perPage = 10;
  const totalPage = Math.ceil(interviews.length / perPage);
  
  const selInterview = useMemo(
    () => interviews.find(i => i.id === selInterviewId),
    [interviews, selInterviewId]
  );
  useEffect(() => {
    const getDatas = async () => {
      try {
        const userRes = await axios.get('/jsh/getUser');
        const user = userRes.data;
        uno.current = user.uno;
        setSubscribe(user.subscribe); // ✅ 구독 상태 반영

        const response = await axios.get(`http://${host}:9090/ymj/getAllResults`, {
          params: { uno: uno.current },
          withCredentials: true
        });
        const raw = response.data;
        const parsed = raw.map((item, idx) => {
          let parsedFeedback = null;
          try {
            if (typeof item.feedback === 'string') {
              parsedFeedback = JSON.parse(item.feedback);
            } else if (typeof item.feedback === 'object') {
              parsedFeedback = item.feedback;
            }
          } catch (e) {
            console.error('🚨 JSON parse 에러 발생한 feedback:', item.feedback);
            console.error('👉 에러:', e.message);
          }

          // 3. 원래 로직
          const scores = item.ascore.split(',').map(s => Number(s));
          const result = {};
          radarTemplate.forEach((key, i) => {
            result[key] = scores[i];
          });

          return {
            id: item.ano,
            title: item.atitle,
            result,
            content: item.acontent,
            regdate: item.aregdate,
            feedback: parsedFeedback
          };
        });

        setInterviews(parsed);
        if (!selInterviewId && parsed.length > 0) {
          setSelInterviewId(parsed[0].id);
        }
      } catch (e) {
        console.error('면접 데이터 불러오기 실패:', e);
      }
    };

    getDatas();
  }, []);
  const filtered = useMemo(
    () => interviews.slice((page - 1) * perPage, page * perPage),
    [page, interviews] // ✅ interviews 추가!
  );


  const radarData = useMemo(() => {
    const base = radarDataTemplate.map(d => ({ ...d }));
    const pick = interviews.find(i => i.id === selInterviewId);
    if (pick) base.forEach(d => d.A = pick.result[d.subject]);
    return base;
  }, [selInterviewId]);
const barData = useMemo(() => {
	const sliced = filtered.map(i => ({
		id: i.id,
		title: i.title,
		value: selSubject ? i.result[selSubject] : null,
		avg: Math.round(Object.values(i.result).reduce((a, b) => a + b, 0) / 5),
	})).reverse();

	// 📌 항상 10개 고정. 없는 항목은 빈 객체로 채움
	const padded = Array.from({ length: 10 }, (_, idx) => sliced[idx] || {
		id: `empty-${idx}`,
		title: '',
		value: null,
		avg: null,
	});
	return padded;
}, [selSubject, filtered]);



  const areaData = useMemo(() => interviews.map(i => {
    const obj = {
      title: i.title,
      avg: Math.round(Object.values(i.result).reduce((a, b) => a + b, 0) / 5)
    };
    if (selSubject) {
      obj.value = i.result[selSubject];
    }
    return obj;
  }).reverse(), [selSubject, interviews]);


  const totalInterviews = interviews.length;
  const avgScores = interviews.map(i =>
    Object.values(i.result).reduce((a, b) => a + b, 0) / 5
  );
  const avgScoreAll = Math.round(
    avgScores.reduce((a, b) => a + b, 0) / totalInterviews
  );
  const maxScore = Math.round(Math.max(...avgScores));
  const minScore = Math.round(Math.min(...avgScores));

  const selInterviewTitle = interviews.find(i => i.id === selInterviewId)?.title;
  const selectedBarIndex = barData.findIndex(e => e.id === selInterviewId);
  const handlePageInput = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만
    setPageInput(value); // 입력상태 유지
  };

  const handlePageSubmit = () => {
    const numeric = parseInt(pageInput, 10);
    if (!isNaN(numeric) && numeric >= 1 && numeric <= totalPage) {
      setPage(numeric);
    } else {
      setPageInput(String(page)); // 유효하지 않으면 원래 값으로 되돌림
    }
  };

  const handlePageBlur = () => handlePageSubmit();
  const handleKeyDown = (e) => {
      if (e.key === 'Enter') handlePageSubmit();
    };
  const handleSubmitInterview = async () => {
    if (subscribe === 2) {
      setShowSubscribeModal(true);  // ✅ 모달 열기!
      return; // 서버 요청 막기
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`http://${host}:9090/ymj/getFeedback`, {
        ano: selInterviewId
      }, { withCredentials: true });

      setInterviews(prev => prev.map(i =>
        i.id === selInterviewId
          ? {
              ...i,
              feedback: typeof res.data === 'string' ? JSON.parse(res.data) : res.data
            }
          : i
      ));

      const userRes = await axios.get('/jsh/getUser');
      setSubscribe(userRes.data.subscribe); // ✅ 갱신된 구독 상태 반영
    } catch (err) {
      console.error(err);
      alert('에러 발생');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsExpanded(false);
  }, [selInterviewId]);

  return (
    <Container>
      {isLoading && <LoadingModal />}
      <Wrapper>
        <KpiWrapper>
          <KpiCard><KpiValue>{totalInterviews}</KpiValue><KpiLabel>총 면접</KpiLabel></KpiCard>
          <KpiCard>
            <KpiValue>
             {Number.isFinite(avgScoreAll) ? Math.round(avgScoreAll) : ''}
            </KpiValue>
            <KpiLabel>전체 평균 점수</KpiLabel>
          </KpiCard>
          <KpiCard><KpiValue>{maxScore}</KpiValue><KpiLabel>최고 점수</KpiLabel></KpiCard>
          <KpiCard><KpiValue>{minScore}</KpiValue><KpiLabel>최저 점수</KpiLabel></KpiCard>
        </KpiWrapper>

        <ContentBox>
          <Sidebar>
            <ToggleContainer>
              <InfoTitle style={{ margin: 0 }}>면접 목록</InfoTitle>
              <ToggleSwitch
                checked={expandedAll}
                onChange={e => setExpandedAll(e.target.checked)}
              />
            </ToggleContainer>
            <InterviewList>
              {filtered.map(iv => (
                <InterviewCard
                  key={iv.id}
                  $selected={iv.id === selInterviewId}
                  onClick={() => {
                    setSelInterviewId(iv.id);
                    setSelSubject(null);
                  }}
                  onMouseEnter={(e) => {
                    setHoveredId(iv.id);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseMove={(e) => {
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div>{iv.title}</div>
                </InterviewCard>
              ))}
            </InterviewList>
            <CustomTooltip
              $show={hoveredId !== null}
              style={{ top: tooltipPos.y + 10, left: tooltipPos.x + 20 }}
            >
              {hoveredId && formatTimestamp(Number(interviews.find(i => i.id === hoveredId)?.regdate))}
            </CustomTooltip>

            <Paging>
              <button disabled={page === 1} onClick={() => {
                const newPage = Math.max(page - 1, 1);
                setPage(newPage);
                setPageInput(String(newPage));
              }}>&lt;</button>

              <input
                type="text"
                value={pageInput}
                onChange={handlePageInput}
                onBlur={handlePageBlur}
                onKeyDown={handleKeyDown}
              />
              /{totalPage}

              <button disabled={page === totalPage} onClick={() => {
                const newPage = Math.min(page + 1, totalPage);
                setPage(newPage);
                setPageInput(String(newPage));
              }}>&gt;</button>
            </Paging>
          </Sidebar>

          <MainArea>
            <AnimatedPanelWrapper>
              {/* 전체 보기 ON */}
              <AnimatedPanel $show={expandedAll}>
                <DualPanel>
                  <LeftPanelBox $expanded={isExpanded}>
                    <LeftPanel>
                      <AiHistoryForGraphPage
                        title={selInterviewTitle}
                        records={(() => {
                          try {
                            const sel = interviews.find(i => i.id === selInterviewId);
                            return sel?.content ? JSON.parse(sel.content) : [];
                          } catch {
                            return [];
                          }
                        })()}
                      />
                    </LeftPanel>
                  </LeftPanelBox>

                  <RightPanelBox $expanded={isExpanded}>
                    {selInterview?.feedback ? (
                      <>
                        <RightPanelToggleButton onClick={() => setIsExpanded(prev => !prev)}>
                          {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        </RightPanelToggleButton>
                        <RightPanel>
                          <BlurredPanelWrapper>
                            <FeedbackReportPanel
                              title="AI 기반 맞춤 피드백"
                              feedback={selInterview.feedback}
                              isExpanded={isExpanded}
                            />
                          </BlurredPanelWrapper>
                        </RightPanel>
                      </>
                    ) : (
                      <RightPanel>
                        <AIContentWrapper>
                          <AIUnifiedTitle>AI 기반 맞춤 피드백</AIUnifiedTitle>
                          <AIUnifiedDescription>
                            사용자의 전체 면접 응답을 바탕으로 AI가 컨텍스트 기반 피드백을 제공합니다.
                          </AIUnifiedDescription>
                          <FlexibleBottomSpacer />
                          <UnifiedButton
                            onClick={handleSubmitInterview}
                            $dimmed={subscribe === 2}
                          >
                            전체 결과 보기 ({subscribe === 1 ? '∞' : subscribe === 0 ? '1' : '0'})
                          </UnifiedButton>
                        </AIContentWrapper>
                      </RightPanel>
                    )}
                  </RightPanelBox>
                </DualPanel>
              </AnimatedPanel>

              {/* 전체 보기 OFF */}
              <AnimatedPanel $show={!expandedAll}>
                <Panel style={{ height: '45%' }}>
                  <InfoTitle>Radar & 설명</InfoTitle>
                  <DualPanel>
                    <RadarSectionLeft>
                      <PanelContent>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} onClick={e => setSelSubject(e?.activeLabel)}>
                            <PolarGrid stroke="#CBD5E1" strokeWidth={1} />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={({ payload, x, y, textAnchor }) => {
                                const sel = payload.value === selSubject;
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    textAnchor={textAnchor}
                                    fill={sel ? '#e76f51' : '#374151'}
                                    fontWeight={sel ? 'bold' : 'normal'}
                                    fontSize={14}
                                  >
                                    {payload.value}
                                  </text>
                                );
                              }}
                            />
                            <PolarRadiusAxis
                              stroke="#E5E7EB"
                              tick={{ fill: '#9CA3AF', fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                              domain={[0, 100]}
                            />
                            <Radar
                              dataKey="A"
                              stroke="#3b82f6" // blue-500
                              fill="#3b82f6"
                              fillOpacity={0.25}
                            />

                            <Tooltip
                              activeIndex={selectedBarIndex}
                              contentStyle={{
                                backgroundColor: '#F9FAFB',  // ✅ 밝은 배경
                                borderColor: '#CBD5E1',
                                borderRadius: 10
                              }}
                              itemStyle={{
                                color: '#1E293B',           // ✅ 진한 글자색
                                fontSize: 14
                              }}
                              formatter={(value) => [`${value}점`, '점수']}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </PanelContent>
                    </RadarSectionLeft>
                    <RadarSectionRight>
                      <DescriptionBox>
                        {selSubject ? (
                          <>
                            <TraitTitleStyled>{selSubject}</TraitTitleStyled>
                            <TraitDescription>{descriptions[selSubject]}</TraitDescription>
                            <TraitComment>
                              {getComment(selSubject, radarData.find(d => d.subject === selSubject)?.A)}
                            </TraitComment>
                          </>
                        ) : (
                          <>
                            <InfoTitle style={{ fontSize: '16px', marginBottom: '8px' }}>설명 영역</InfoTitle>
                            <TraitDescription>유형을 클릭해 주세요.</TraitDescription>
                          </>
                        )}
                      </DescriptionBox>
                    </RadarSectionRight>
                  </DualPanel>
                </Panel>

                <Panel style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <InfoTitle>{selSubject ? `${selSubject} vs 평균` : '평균 점수'}</InfoTitle>
                    <ChartToggle value={chartType} onChange={e => setChartType(e.target.value)}>
                      <option value="bar">막대차트</option>
                      <option value="area">영역 차트</option>
                    </ChartToggle>
                  </div>
                  <PanelContent>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={barData} activeIndex={selectedBarIndex}>
                          <CartesianGrid stroke="#CBD5E1" strokeWidth={1} />
                          <XAxis dataKey="title" tick={false} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#374151', fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              borderColor: '#CBD5E1',
                              borderRadius: 10
                            }}
                            itemStyle={{
                              color: '#1E293B',
                              fontSize: 14
                            }}
                          />
                          {selSubject && barData.some(d => d.value !== null) && (
                            <Bar dataKey="value" name="선택점수" isAnimationActive animationDuration={600}>
                              {barData.map((e, idx) => (
                                e.value !== null ? (
                                  <Cell
                                    key={`value-${idx}`}
                                    fill={e.id === selInterviewId ? '#f4a261' : '#fdd6b3'}
                                    fillOpacity={1}
                                    stroke={e.id === selInterviewId ? '#ffffff' : 'none'}
                                    strokeWidth={e.id === selInterviewId ? 2 : 0}
                                    style={{
                                      filter: e.id === selInterviewId
                                        ? 'drop-shadow(0 0 6px rgba(0,0,0,0.5))'
                                        : 'none',
                                      transition: 'all 0.3s ease'
                                    }}
                                  />
                                ) : <Cell key={`empty-${idx}`} fill="transparent" />
                              ))}
                            </Bar>
                          )}
                            <Bar dataKey="avg" name="평균점수" isAnimationActive animationDuration={600}>
                              {barData.map((e, idx) => (
                                e.avg !== null ? (
                                  <Cell
                                    key={`avg-${idx}`}
                                    fill={e.id === selInterviewId ? '#7f99b2' : '#b3c1d1'}
                                    fillOpacity={e.id === selInterviewId ? 1 : 0.65}
                                    stroke={e.id === selInterviewId ? '#ffffff' : 'none'}
                                    strokeWidth={e.id === selInterviewId ? 2 : 0}
                                    style={{
                                      filter: e.id === selInterviewId
                                        ? 'drop-shadow(0 0 6px rgba(0,0,0,0.5))'
                                        : 'none',
                                      transition: 'all 0.3s ease'
                                    }}
                                  />
                                ) : <Cell key={`empty-${idx}`} fill="transparent" />
                              ))}
                            </Bar>

                        </BarChart>
                      ) : (
                        <AreaChart data={areaData}>
                          <CartesianGrid stroke="#CBD5E1" strokeWidth={1} />
                          <XAxis dataKey="title" tick={false} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#374151', fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#F9FAFB',
                              borderColor: '#CBD5E1',
                              borderRadius: 10
                            }}
                            itemStyle={{
                              color: '#1E293B',
                              fontSize: 14
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#82ca9d"
                            fill="rgba(130,202,157,0.3)"
                            name="선택점수"
                          />
                          <Area
                            type="monotone"
                            dataKey="avg"
                            stroke="#ffb74d"
                            fill="rgba(255,183,77,0.3)"
                            name="평균점수"
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </PanelContent>
                </Panel>
              </AnimatedPanel>
            </AnimatedPanelWrapper>
          </MainArea>
        </ContentBox>
      </Wrapper>
      {showSubscribeModal && <SubscribeModal onClose={() => setShowSubscribeModal(false)} uno={uno.current}/>}

    </Container>
  );





}
