// src/components/RadarSection.jsx
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis,
  BarChart, Bar, Cell,
  AreaChart, Area,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import axios from 'axios';
import AiHistoryForGraphPage from './AiHistoryForGraphPage';

const Container = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #1f2a37;
	color: #e1e8f0;
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
	background: #2c3e50;
	padding: 16px;
	border-radius: 8px;
	text-align: center;
`;

const KpiValue = styled.div`
	font-size: 28px;
	font-weight: bold;
`;

const KpiLabel = styled.div`
	font-size: 14px;
	margin-top: 4px;
	color: #b0c4de;
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
	background: #233049;
	padding: 20px;
	border-radius: 12px;
	display: flex;
	flex-direction: column;
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
	background: #3a4a63;
	border-radius: 12px;
	outline: none;
	transition: background 0.3s;
	cursor: pointer;

	&:checked {
		background: #4376b6;
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
	background: ${({ selected }) => (selected ? '#3d5c99' : '#233049')}; // ✅ hover용 색
	border-radius: 6px;
	margin-bottom: 8px;
	cursor: pointer;
	color: #e1e8f0;
	display: flex;
	justify-content: space-between;
	overflow: hidden;
	transition: background 0.2s ease;

	&:hover {
		background: #3d5c99;
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
		border: 1px solid #3a4a63;
		background: #2c3e50;
		color: #e1e8f0;
		text-align: center;
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
	background-color: #2c3e50;
	padding: 20px;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	display: flex;
	flex-direction: column;
	overflow: hidden;
`;

const DualPanel = styled.div`
	display: flex;
	gap: 20px;
	flex: 1;
	height: 100%;
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
`;

const InfoTitle = styled.h4`
	margin-bottom: 12px;
	font-size: 18px;
	color: #ffffff;
`;

const ChartToggle = styled.select`
	background: #2c3e50;
	color: #e1e8f0;
	border: 1px solid #3a4a63;
	border-radius: 4px;
	padding: 4px 8px;
	align-self: flex-end;
`;

const PlaceholderText = styled.div`
	font-size: 16px;
	color: #e1e8f0;
	opacity: 0.8;
`;

const LeftPanelBox = styled(PanelSection)`
	flex: 7;
	height: 100%;
`;

const RightPanelBox = styled(PanelSection)`
	flex: 3;
	height: 100%;
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

const CenteredContent = styled(PanelContent)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	min-height: 0;
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
	opacity: ${({ show }) => (show ? 1 : 0)};
	transform: ${({ show }) => (show ? 'translateY(0)' : 'translateY(20px)')};
	pointer-events: ${({ show }) => (show ? 'auto' : 'none')};
`;



const radarTemplate = ['리더형','분석형','창의형','실행형','소통형'];
const radarDataTemplate = radarTemplate.map(s => ({ subject: s, A: 0 }));
const descriptions = {
  '리더형': '리더십이 뛰어나고 조직을 잘 이끔',
  '분석형': '논리적이고 데이터 분석을 잘함',
  '창의형': '새로운 아이디어를 제시함',
  '실행형': '계획을 실천에 옮기는 능력이 뛰어남',
  '소통형': '사람들과 잘 어울리며 소통 능력이 뛰어남',
};

export default function RadarSection() {
  const [selSubject, setSelSubject] = useState(null);
  const [selInterviewId, setSelInterviewId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [expandedAll, setExpandedAll] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [interviews, setInterviews] = useState([]);

  const perPage = 10;
  const totalPage = Math.ceil(interviews.length / perPage);

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await axios.get("http://localhost:9090/ymj/getAllResults", {
          withCredentials: true
        });
        const raw = response.data;

        const parsed = raw.map((item, idx) => {
          const parsedAnswers = JSON.parse(item.acontent); // 문자열로 온 JSON 파싱
          const scores = item.ascore.split(',').map(s => Number(s));

          // 각 유형에 해당하는 점수 매핑
          const result = {};
          radarTemplate.forEach((key, i) => {
            result[key] = scores[i];
          });

          return {
            id: item.ano,
            title: item.atitle,
            result,
            content: item.acontent // ✅ 여기 추가해야 AiHistoryForGraphPage에 데이터 전달됨
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
  const barData = useMemo(() => (
    filtered.map(i => ({
      id: i.id,
      title: i.title,
      value: selSubject ? i.result[selSubject] : null,  // ✅ 0.001 대신 null!
      avg: Math.round(Object.values(i.result).reduce((a, b) => a + b, 0) / 5),
    })).reverse()
  ), [selSubject, selInterviewId, filtered]);


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

  return (
    <Container>
      <Wrapper>
        <KpiWrapper>
          <KpiCard><KpiValue>{totalInterviews}</KpiValue><KpiLabel>총 면접</KpiLabel></KpiCard>
          <KpiCard><KpiValue>{avgScoreAll}</KpiValue><KpiLabel>전체 평균 점수</KpiLabel></KpiCard>
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
                  selected={iv.id === selInterviewId}
                  onClick={() => {
                    setSelInterviewId(iv.id);
                    setSelSubject(null);
                  }}
                >
                  <div>{iv.title}</div>
                </InterviewCard>
              ))}
            </InterviewList>
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
              {/* 전체 보기 ON (좌우 레이아웃) */}
              <AnimatedPanel show={expandedAll}>
                <DualPanel>
                  <LeftPanelBox>
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

                  <RightPanelBox>
                    <RightPanel>
                      <InfoTitle>오른쪽 콘텐츠 (2)</InfoTitle>
                      <CenteredContent>
                        <PlaceholderText>오른쪽 콘텐츠 영역입니다</PlaceholderText>
                      </CenteredContent>
                    </RightPanel>
                  </RightPanelBox>
                </DualPanel>
              </AnimatedPanel>

              {/* 전체 보기 OFF (위아래 레이아웃) */}
              <AnimatedPanel show={!expandedAll}>
                <Panel style={{ height: '45%' }}>
                  <InfoTitle>Radar & 설명</InfoTitle>
                  <DualPanel>
                    <PanelSection>
                      <PanelContent>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData} onClick={e => setSelSubject(e?.activeLabel)}>
                            <PolarGrid stroke="#3a4a63" />
                            <PolarAngleAxis
                              dataKey="subject"
                              tick={({ payload, x, y, textAnchor }) => {
                                const sel = payload.value === selSubject;
                                return (
                                  <text
                                    x={x}
                                    y={y}
                                    textAnchor={textAnchor}
                                    fill={sel ? '#ff5252' : '#e1e8f0'}
                                    fontWeight="bold"
                                    fontSize={14}
                                  >
                                    {payload.value}
                                  </text>
                                );
                              }}
                            />
                            <PolarRadiusAxis stroke="#3a4a63" domain={[0, 100]} />
                            <Radar
                              dataKey="A"
                              stroke="#82ca9d"
                              fill="#82ca9d"
                              fillOpacity={0.6}
                            />
                            <Tooltip
                              activeIndex={selectedBarIndex}
                              contentStyle={{
                                backgroundColor: '#2c3e50',
                                borderColor: '#3a4a63'
                              }}
                              itemStyle={{ color: '#e1e8f0' }}
                              formatter={(value) => [`${value}점`, '점수']}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </PanelContent>
                    </PanelSection>

                    <PanelSection>
                      <InfoTitle>{selSubject || '설명 영역'}</InfoTitle>
                      <div style={{ color: '#b0c4de' }}>
                        {selSubject ? descriptions[selSubject] : '유형을 클릭해 주세요.'}
                      </div>
                    </PanelSection>
                  </DualPanel>
                </Panel>

                <Panel style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <InfoTitle>{selSubject ? `${selSubject} vs 평균` : '데이터 선택 중'}</InfoTitle>
                    <ChartToggle value={chartType} onChange={e => setChartType(e.target.value)}>
                      <option value="bar">막대차트</option>
                      <option value="area">영역 차트</option>
                    </ChartToggle>
                  </div>
                  <PanelContent>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={barData} activeIndex={selectedBarIndex}>
                          <CartesianGrid stroke="#3a4a63" />
                          <XAxis dataKey="title" tick={false} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#e1e8f0' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#2c3e50', borderColor: '#3a4a63' }} />

                          {selSubject && barData.some(d => d.value !== null) && (
                            <Bar
                              dataKey="value"
                              name="선택점수"
                              isAnimationActive={true}
                              animationDuration={600}
                              animationEasing="ease-out"
                            >
                              {barData.map((e, idx) => (
                                <Cell
                                  key={`value-${idx}`}
                                  fill={e.id === selInterviewId ? '#f44336' : '#82ca9d'}
                                  fillOpacity={e.id === selInterviewId ? 1 : 0.8}
                                  stroke={e.id === selInterviewId ? '#ffffff' : 'none'}
                                  strokeWidth={e.id === selInterviewId ? 2 : 0}
                                />
                              ))}
                            </Bar>
                          )}

                          <Bar
                            dataKey="avg"
                            name="평균점수"
                            isAnimationActive={true}
                            animationDuration={600}
                            animationEasing="ease-out"
                          >
                            {barData.map((e, idx) => (
                              <Cell
                                key={`avg-${idx}`}
                                fill="#ffb74d"
                                fillOpacity={e.id === selInterviewId ? 1 : 0.6}
                                stroke={e.id === selInterviewId ? '#ffffff' : 'none'}
                                strokeWidth={e.id === selInterviewId ? 2 : 0}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <AreaChart data={areaData}>
                          <CartesianGrid stroke="#3a4a63" />
                          <XAxis dataKey="title" tick={false} />
                          <YAxis domain={[0, 100]} tick={{ fill: '#e1e8f0' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#2c3e50', borderColor: '#3a4a63' }} />
                          <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="rgba(130,202,157,0.3)" name="선택점수" />
                          <Area type="monotone" dataKey="avg" stroke="#ffb74d" fill="rgba(255,183,77,0.3)" name="평균점수" />
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
    </Container>
  );




}
