const categories = 
[
  {
    category: "IT / 소프트웨어 개발",
    subCategories: [
      {
        name: "웹 개발자",
        description: "웹사이트 및 웹앱 개발",
        skills: ["HTML", "CSS", "JavaScript", "React", "Vue", "Spring", "Django"]
      },
      {
        name: "프론트엔드 개발자",
        description: "UI 개발 중심",
        skills: ["React", "Vue.js", "TypeScript", "Webpack"]
      },
      {
        name: "백엔드 개발자",
        description: "서버, DB, API 개발",
        skills: ["Java", "Spring", "Node.js", "Python", "Django", "MySQL", "MongoDB"]
      },
      {
        name: "앱 개발자",
        description: "모바일 앱 개발",
        skills: ["Kotlin", "Swift", "Flutter", "React Native"]
      },
      {
        name: "게임 개발자",
        description: "게임 엔진 기반 콘텐츠 개발",
        skills: ["Unity", "Unreal Engine", "C#", "C++"]
      },
      {
        name: "데이터 엔지니어",
        description: "데이터 수집/처리",
        skills: ["Python", "SQL", "Hadoop", "Spark", "Airflow"]
      },
      {
        name: "AI 개발자",
        description: "머신러닝/딥러닝 개발",
        skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn"]
      },
      {
        name: "보안 전문가",
        description: "시스템 및 정보 보안",
        skills: ["Linux", "Firewall", "암호화", "OWASP", "WAS", "SIEM"]
      }
    ]
  },
	{
		category: "디자인 / 콘텐츠",
		subCategories: [
			{
				name: "UI/UX 디자이너",
				description: "사용자 인터페이스 설계",
				skills: [
					"Figma", "Sketch", "Adobe XD", "ProtoPie", "Zeplin", 
					"Design System", "User Research", "UX Writing", "Wireframing"
				]
			},
			{
				name: "그래픽 디자이너",
				description: "시각 콘텐츠 제작",
				skills: [
					"Photoshop", "Illustrator", "InDesign", 
					"Typography", "Color Theory", "Layout Design"
				]
			},
			{
				name: "모션 그래픽 디자이너",
				description: "영상 기반 애니메이션 디자인",
				skills: [
					"After Effects", "Blender", "Cinema 4D", "Rotoscoping", 
					"Keyframing", "Lottie", "Motion Design"
				]
			},
			{
				name: "웹 디자이너",
				description: "웹페이지 시각 구성",
				skills: [
					"HTML", "CSS", "Adobe XD", "Figma", 
					"Responsive Design", "Bootstrap", "Cross-Browser Testing"
				]
			},
			{
				name: "게임 아티스트",
				description: "게임 배경/캐릭터 디자인",
				skills: [
					"Unity", "Photoshop", "Spine", "ZBrush", 
					"Substance Painter", "Concept Art", "Sprite Sheet"
				]
			},
			{
				name: "3D 디자이너",
				description: "3D 모델링 및 렌더링",
				skills: [
					"Blender", "3ds Max", "Maya", "ZBrush", 
					"Arnold Renderer", "Rigging", "UV Mapping"
				]
			},
			{
				name: "브랜딩 디자이너",
				description: "브랜드 아이덴티티 구축",
				skills: [
					"Illustrator", "InDesign", "Logo Design", 
					"Brand Guidelines", "Typography", "Color Palette"
				]
			},
			{
				name: "영상 편집자",
				description: "영상 콘텐츠 편집",
				skills: [
					"Premiere Pro", "Final Cut Pro", "After Effects", 
					"DaVinci Resolve", "Color Grading", "Motion Tracking", "Sound Design"
				]
			}
		]
	}
	,
	{
		category: "데이터 / 분석 / 통계",
		subCategories: [
			{
				name: "데이터 분석가",
				description: "데이터 기반 의사결정",
				skills: ["Python", "Pandas", "NumPy", "Excel", "SQL", "Jupyter", "Data Cleaning", "EDA", "Matplotlib", "Seaborn"]
			},
			{
				name: "데이터 사이언티스트",
				description: "모델링, 분석",
				skills: ["Python", "R", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "Feature Engineering", "Model Evaluation", "Data Pipeline"]
			},
			{
				name: "BI 분석가",
				description: "대시보드 제작 및 분석",
				skills: ["Power BI", "Tableau", "Looker", "Metabase", "SQL", "KPI 분석", "데이터 모델링"]
			},
			{
				name: "통계 분석가",
				description: "통계 기반 예측",
				skills: ["R", "SPSS", "SAS", "Regression", "ANOVA", "시계열 분석", "Hypothesis Testing"]
			},
			{
				name: "리서처",
				description: "시장조사 및 정량·정성 분석",
				skills: ["Excel", "Qualtrics", "Google Forms", "Interview", "설문 설계", "정성분석"]
			},
			{
				name: "데이터 시각화 전문가",
				description: "시각적 데이터 표현",
				skills: ["Tableau", "Power BI", "D3.js", "Chart.js", "데이터 스토리텔링", "Interactive Visualization"]
			},
			{
				name: "CRM 분석가",
				description: "고객 데이터 분석",
				skills: ["Salesforce", "Google Analytics", "RFM", "SQL", "세그먼트 분석", "CDP", "고객 여정 분석"]
			},
			{
				name: "웹 로그 분석가",
				description: "사용자 행동 분석",
				skills: ["GA4", "Tag Manager", "Mixpanel", "Amplitude", "Heatmap", "A/B Test", "Funnel 분석"]
			}
		]
	},
  {
		category: "기획 / 프로젝트 관리",
		subCategories: [
			{
				name: "서비스 기획자",
				description: "기능/화면 설계",
				skills: ["Notion", "Figma", "Jira", "Wireframe", "Flowchart", "GA", "User Story", "기능명세서"]
			},
			{
				name: "게임 기획자",
				description: "게임 시스템 설계",
				skills: ["Excel", "UE", "Unity", "레벨 디자인", "게임 밸런싱", "GDD", "스토리라인 작성"]
			},
			{
				name: "웹 기획자",
				description: "웹사이트 기획",
				skills: ["Axure", "Sketch", "Wireframing", "GA", "사용자 시나리오", "A/B Testing"]
			},
			{
				name: "제품 기획자",
				description: "하드웨어/소프트웨어 제품 기획",
				skills: ["Confluence", "Miro", "MVP 전략", "Product Discovery", "Market Research", "User Research"]
			},
			{
				name: "프로젝트 매니저(PM)",
				description: "일정/인력/위험 관리",
				skills: ["Jira", "MS Project", "Trello", "Agile", "Scrum", "Risk Management", "회의록 작성"]
			},
			{
				name: "PO(Product Owner)",
				description: "제품 방향/우선순위 관리",
				skills: ["Jira", "Roadmap Tools", "OKR", "User Story Mapping", "Backlog Grooming"]
			},
			{
				name: "QA 테스터",
				description: "제품 품질 보증",
				skills: ["TestRail", "Selenium", "Bug Tracking", "Test Case Design", "Postman", "JMeter"]
			},
			{
				name: "기술기획자",
				description: "기술 전략 수립",
				skills: ["Git", "CI/CD", "DevOps", "기술 트렌드 분석", "Tech Stack 선정", "기술 로드맵"]
			}
		]
	}
	,
	 {
			category: "경영 / 전략 / 사무",
			subCategories: [
				{
					name: "전략기획",
					description: "사업/시장 전략 수립",
					skills: ["Excel", "PPT", "Tableau", "Market Research", "SWOT", "Porter", "Forecasting", "Financial Modeling"]
				},
				{
					name: "인사(HR)",
					description: "채용/평가/교육",
					skills: ["SAP", "Workday", "채용 프로세스", "성과 평가 시스템", "HRIS", "온보딩", "조직문화 설계"]
				},
				{
					name: "총무 / 사무",
					description: "일반 행정 관리",
					skills: ["MS Office", "ERP", "문서 관리", "예산 운영", "사내 커뮤니케이션", "하드웨어 관리"]
				},
				{
					name: "재무 / 회계",
					description: "기업 재무/세무",
					skills: ["더존", "SAP", "Excel", "IFRS", "세무 신고", "재무제표 분석", "Tax Compliance"]
				},
				{
					name: "경영 컨설턴트",
					description: "비즈니스 진단 및 제안",
					skills: ["PPT", "Excel", "Data 분석", "Case Interview", "Business Framework", "Stakeholder Engagement", "Material Preparation"]
				},
				{
					name: "법무 / 컴플라이언스",
					description: "계약 및 법적 검토",
					skills: ["법률 시스템", "로스쿨 지식", "계약 검토", "규정 준수", "리스크 관리", "Litigation Support"]
				},
				{
					name: "구매 / 물류",
					description: "공급망 관리",
					skills: ["SAP SCM", "Oracle", "Supplier Management", "Contract Negotiation", "Inventory Optimization", "Logistics Planning"]
				},
				{
					name: "사업개발(BD)",
					description: "파트너십/신사업 발굴",
					skills: ["CRM", "제안서 작성", "시장 진입 전략", "파트너십 관리", "사업 타당성 분석", "Pitch Deck"]
				}
			]
		}
		,
		{
		category: "마케팅 / 광고 / 홍보",
		subCategories: [
			{
				name: "디지털 마케터",
				description: "온라인 채널 마케팅",
				skills: [
					"Google Ads", "Facebook Ads", "Instagram Ads", "YouTube Ads",
					"GA4", "UTM", "캠페인 설계", "리타겟팅", "Google Analytics"
				]
			},
			{
				name: "퍼포먼스 마케터",
				description: "광고 ROI 최적화",
				skills: [
					"ROAS 분석 도구", "SQL", "A/B 테스트", "GA4", "데이터 분석",
					"비딩 전략", "실시간 모니터링"
				]
			},
			{
				name: "콘텐츠 마케터",
				description: "글/영상 콘텐츠 제작",
				skills: [
					"Notion", "블로그", "유튜브", "콘텐츠 전략", "SEO", 
					"Copywriting", "콘텐츠 퍼널", "콘텐츠 캘린더"
				]
			},
			{
				name: "브랜드 마케터",
				description: "브랜드 캠페인 기획",
				skills: [
					"PPT", "SNS 플랫폼", "CI/BI", "스토리텔링", 
					"브랜드 포지셔닝", "감성 마케팅", "캠페인 KPI"
				]
			},
			{
				name: "CRM 마케터",
				description: "고객 세그먼트 운영",
				skills: [
					"Salesforce", "ActiveCampaign", "세그먼트 전략", "LTV 분석", 
					"NPS", "MA 도구", "이메일 마케팅", "이탈 분석"
				]
			},
			{
				name: "SEO 전문가",
				description: "검색 최적화",
				skills: [
					"SEMrush", "Ahrefs", "GA", "웹마스터 도구", 
					"키워드 분석", "SEO 콘텐츠 작성", "검색 의도 분석"
				]
			},
			{
				name: "PR / 홍보",
				description: "언론 대응/보도자료",
				skills: [
					"MS Word", "언론 네트워크", "보도자료 작성", "미디어 릴레이션",
					"PR 캠페인", "위기 대응 전략"
				]
			},
			{
				name: "이벤트 마케터",
				description: "행사/이벤트 기획",
				skills: [
					"Airtable", "Excel", "오프라인 행사 운영", "이벤트 KPIs", 
					"후기 분석", "현장 관리", "커뮤니케이션 플랜"
				]
			}
		]
	}
	,
	 {
		category: "교육 / 연구",
		subCategories: [
			{
				name: "초·중·고 교사",
				description: "교육과정 운영",
				skills: [
					"PPT", "온라인 강의도구", "Google Classroom", "Zoom", 
					"수업자료 제작", "평가 시스템", "온라인 협업툴", "Padlet"
				]
			},
			{
				name: "대학교수 / 조교",
				description: "고등교육/연구",
				skills: [
					"R", "Python", "LaTeX", "논문작성 도구", 
					"EndNote", "논문 검색 DB", "강의계획서", "학술발표 준비"
				]
			},
			{
				name: "교육 콘텐츠 개발자",
				description: "교육 자료 설계",
				skills: [
					"Articulate", "Adobe Captivate", "Storyline", "SCORM", 
					"Instructional Design", "LMS 연동", "영상 편집"
				]
			},
			{
				name: "학습 설계자(LXD)",
				description: "교육 커리큘럼 설계",
				skills: [
					"LMS", "Canva", "Miro", "교육 목표 설정", 
					"시나리오 작성", "Design Thinking", "인터랙티브 콘텐츠"
				]
			},
			{
				name: "유아 교사",
				description: "놀이 및 창의교육",
				skills: [
					"그림 도구", "교육 앱", "Montessori", 
					"동화 활용", "플레이기반 교수법", "교구 개발", "관찰일지"
				]
			},
			{
				name: "온라인 강사",
				description: "이러닝 콘텐츠 제작",
				skills: [
					"OBS", "Zoom", "YouTube", "영상 편집", 
					"강의 스크립트 작성", "썸네일 제작", "댓글 관리", "강의플랫폼 운영"
				]
			},
			{
				name: "연구원",
				description: "실험/논문 작성",
				skills: [
					"SPSS", "Python", "R", "통계 분석", 
					"실험 설계", "논문 제출 시스템", "데이터 시각화", "IRB"
				]
			},
			{
				name: "평생교육사",
				description: "성인 교육 운영",
				skills: [
					"교육플랫폼", "설문도구", "성인 학습자 분석", 
					"과정 평가", "블렌디드 러닝", "비대면 교육기획", "수료 관리"
				]
			}
		]
	}
,
  {
		category: "엔지니어링 / 제조 / 품질",
		subCategories: [
			{
				name: "기계 엔지니어",
				description: "기계 설계/분석",
				skills: ["AutoCAD", "SolidWorks", "3D CAD", "ANSYS", "CAE", "기구 설계", "기술 도면 해독"]
			},
			{
				name: "전기/전자 엔지니어",
				description: "회로 및 설계",
				skills: ["OrCAD", "MATLAB", "Altium", "PCB 설계", "SPICE", "FPGA", "회로 시뮬레이션", "LabVIEW"]
			},
			{
				name: "품질 관리자",
				description: "품질관리 및 검증",
				skills: ["Minitab", "6시그마", "FMEA", "QC 7 Tools", "ISO 인증", "불량 분석", "통계적 품질관리"]
			},
			{
				name: "생산기술 엔지니어",
				description: "공정 설계/개선",
				skills: ["MES", "PLC", "TPS", "Cycle Time 분석", "공정 개선", "Lean Manufacturing", "자동화 설비"]
			},
			{
				name: "로봇공학자",
				description: "자동화 기술 개발",
				skills: ["ROS", "C++", "Python", "Robot Arm Programming", "SLAM", "OpenCV", "기계비전", "Embedded 시스템"]
			},
			{
				name: "설비 엔지니어",
				description: "설비 유지보수",
				skills: ["SCADA", "설비 분석 툴", "PLC", "Predictive Maintenance", "OEE", "Vibration Analysis", "설비 수명주기"]
			},
			{
				name: "금형 설계자",
				description: "부품/금형 설계",
				skills: ["UG NX", "Catia", "CAM", "Moldflow", "기계가공 공정", "사출 설계", "금형 해석"]
			},
			{
				name: "반도체 엔지니어",
				description: "공정/설비/소자 개발",
				skills: ["CleanRoom 설비", "Cadence", "Synopsys", "EDA Workflow", "Verilog", "Photo Lithography", "반도체 공정 분석"]
			}
		]
	}
,
	{
		category: "건축 / 토목 / 환경",
		subCategories: [
			{
				name: "건축가",
				description: "설계/계획",
				skills: ["AutoCAD", "Revit", "SketchUp", "Rhino", "V-Ray", "3ds Max", "건축계획", "건축법규", "렌더링"]
			},
			{
				name: "토목 엔지니어",
				description: "도로/구조 설계",
				skills: ["Civil 3D", "STAAD", "AutoCAD Civil 3D", "MicroStation", "도로 설계", "토공량 산출", "수문해석"]
			},
			{
				name: "구조 엔지니어",
				description: "건물 구조 해석",
				skills: ["ETABS", "SAP2000", "MIDAS", "SAFE", "구조해석", "내진설계", "RC 설계", "철근 상세도"]
			},
			{
				name: "조경 디자이너",
				description: "공간 디자인",
				skills: ["SketchUp", "Lumion", "Photoshop", "AutoCAD", "LandFX", "조경계획", "디자인 프레젠테이션"]
			},
			{
				name: "도시계획가",
				description: "도시구조 설계",
				skills: ["ArcGIS", "QGIS", "UrbanSim", "SPSS", "계획분석", "토지이용 분석", "교통모델링"]
			},
			{
				name: "건설현장 관리자",
				description: "공사 계획 및 관리",
				skills: ["건설 ERP", "현장 보고 앱", "시공 일정표", "작업일지", "하도급 관리", "현장 안전관리", "품질 점검"]
			},
			{
				name: "환경 엔지니어",
				description: "환경 영향 분석",
				skills: ["R", "ArcGIS", "EIA", "LCA", "환경 모니터링", "대기/수질 분석", "지속가능성 평가"]
			},
			{
				name: "BIM 전문가",
				description: "디지털 건설 모델링",
				skills: ["Revit", "Navisworks", "Clash Detection", "BIM 4D", "BIM 5D", "IFC", "BIM Collaboration"]
			}
		]
	}
,
  {
		category: "의료 / 바이오 / 복지",
		subCategories: [
			{
				name: "의사 / 간호사",
				description: "진료/간호",
				skills: ["EMR 시스템", "PACS", "Vitals Monitoring", "간호기록 시스템", "처방 시스템", "진료기록 관리"]
			},
			{
				name: "임상병리사",
				description: "검사 및 분석",
				skills: ["분석 장비", "LIMS", "혈액 검사기", "면역화학 분석기", "PCR", "LIS", "Sample Management"]
			},
			{
				name: "물리치료사",
				description: "재활치료",
				skills: ["물리치료 기기", "도수치료", "전기자극 치료기", "운동치료 기기", "EMG", "ROM 측정"]
			},
			{
				name: "약사 / 제약",
				description: "약물 제조/유통",
				skills: ["GMP", "SAP", "GCP", "의약품 개발", "Pharmacovigilance", "제제 개발", "CSV"]
			},
			{
				name: "생명과학 연구원",
				description: "생물/유전자 연구",
				skills: ["PCR", "ELISA", "Western Blot", "Cell Culture", "qPCR", "실험노트", "분자생물학 도구"]
			},
			{
				name: "의료기기 엔지니어",
				description: "의료 장비 개발",
				skills: ["LabVIEW", "회로설계", "Embedded 설계", "의료 인증", "시그널 처리", "테스트 장비", "펌웨어"]
			},
			{
				name: "사회복지사",
				description: "복지 서비스 지원",
				skills: ["복지행정 시스템", "사례관리", "위기개입", "복지 상담", "사회조사", "지역자원 연계"]
			},
			{
				name: "심리상담사",
				description: "상담 및 평가",
				skills: ["심리 평가도구", "기록 도구", "MMPI", "MBTI", "상담기법", "정서조절", "상담일지", "윤리의식"]
			}
		]
	}

];

export default categories;