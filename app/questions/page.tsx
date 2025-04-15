"use client"
import type { Question } from "@/lib/questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, ChevronUp, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import PageLayout from "@/components/page-layout"
import { useAuth } from "@/lib/auth-context"
import type { Answer } from "@/lib/answers"
import { canViewModelAnswer } from "@/lib/utils"
import { markQuestionAsRead } from "@/lib/user-activity"

export default function QuestionsPage() {
  // 하드코딩된 Day 1과 Day 2 질문들 - ID 형식 수정
  const hardcodedQuestions: Question[] = [
    // Day 1 질문들
    {
      id: "q1",
      title: "최신 기술 트렌드의 영향",
      content:
        "최근 5년간 발전한 기술 트렌드 중, 당신의 개발 방식 또는 학습 방식에 가장 큰 영향을 준 기술은 무엇인가요? 그 이유와, 실제로 적용해 보았거나 흥미롭게 느꼈던 경험이 있다면 함께 설명해 주세요.",
      date: "2025-04-09",
      category: "공통",
      hint: '"기술 트렌드"는 AI, 클라우드, 프레임워크 변화, DevOps 도구 등 다양합니다.\n학습 방식이나 개발 철학에 영향을 준 경험 중심으로 이야기해 보세요.',
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n저는 최근 빠르게 발전하고 있는 <b>AI 기반 개발 도구(GitHub Copilot)</b>의 등장이 가장 인상 깊었습니다. 졸업 프로젝트를 진행하면서 처음 사용해 보았는데, 코드 자동완성을 넘어 테스트 함수나 반복 로직의 구조까지 제안해주는 점이 놀라웠습니다. 이 도구 덕분에 단순 구현보다 코드 구조와 설계에 더 집중하는 개발 습관을 기를 수 있었습니다. 실무에 들어가서도 이런 AI 보조 도구를 적극 활용하면 빠르게 성장할 수 있을 것 같다고 느꼈습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n가장 큰 영향을 준 기술은 CI/CD 자동화 환경과 GitHub Actions의 확산입니다. 반복되는 배포 과정과 QA 자동화를 줄이기 위해 팀 내에서 직접 Actions 워크플로우를 구성하고 운영해본 경험이 있습니다. 특히 QA 테스트 결과에 따라 PR을 자동으로 머지/반려하도록 설정하면서 개발 효율성과 팀 신뢰도가 높아졌습니다. 이러한 경험은 코드 작성뿐만 아니라 팀 내 개발 프로세스 개선까지 주도하는 역량을 키우는 데 도움이 되었습니다.",
      days: 1,
    },
    {
      id: "q2",
      title: "UI 상태 관리",
      content:
        "UI 상태 관리에서 어려움을 겪었던 경험이 있다면, 어떤 방식으로 구조를 개선하거나 상태를 관리했는지 설명해 주세요. 그 과정에서 적용한 성능 최적화 기법이나 고민한 점이 있다면 함께 설명해 주세요.",
      date: "2025-04-09",
      category: "Frontend",
      hint: "상태 관리란 단순한 useState부터 전역 상태 관리 라이브러리까지 포함됩니다. 어려웠던 점 → 개선 방향 → 성능 혹은 사용자 경험 향상을 연결해 보세요.",
      modelAnswer:
        '<b>[첫 취업 준비생이라면?]</b><br>\nReact로 프로젝트를 할 때, 여러 개의 모달과 필터 상태를 각각 useState로 관리하다 보니 코드가 복잡해지고 버그가 자주 발생했습니다. 이를 해결하기 위해 Context API를 도입해 전역 상태로 관리했고, 필요 시 useReducer로 구조화했습니다. 이 경험을 통해 상태를 단순히 "어디에 둘 것인가"가 아니라 "누가 언제 관리할 것인가"라는 관점으로 보게 되었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n내부 어드민 시스템에서 유저 검색/필터/페이징 상태를 관리하던 중, 렌더링 최적화 문제가 발생했습니다. 각 컴포넌트가 서로 의존성이 많아 불필요한 리렌더링이 생겼기 때문입니다. 이를 해결하기 위해 zustand를 도입해 전역 상태를 분리하고, selector를 활용한 부분 구독 방식으로 성능을 개선했습니다. 리렌더링 횟수가 60% 이상 감소했고, 코드 유지보수성도 크게 개선되었습니다.',
      days: 1,
    },
    {
      id: "q2-1",
      title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
      content:
        "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
      date: "2025-04-09",
      category: "Frontend",
      hint: "함수와 그 함수가 선언된 렉시컬 환경과의 조합을 생각해보세요.",
      modelAnswer:
        "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부함수가 외부함수의 변수에 접근할 수 있는 것을 말합니다. 이를 통해 데이터 은닉, 캡슐화, 팩토리 함수 등을 구현할 수 있습니다. 예를 들어, 카운터 함수를 만들 때 클로저를 활용하면 내부 상태를 외부에서 직접 접근하지 못하게 보호할 수 있습니다.",
      days: 1,
    },
    {
      id: "q3-1",
      title: "RESTful API의 설계 원칙은 무엇인가요?",
      content: "RESTful API를 설계할 때 고려해야 할 주요 원칙들에 대해 설명하고, 좋은 RESTful API의 예시를 들어주세요.",
      date: "2025-04-09",
      category: "Backend",
      hint: "자원(Resource), 행위(Verb), 표현(Representation)의 개념을 고려해보세요.",
      modelAnswer:
        "RESTful API 설계의 주요 원칙은 1) 자원 기반 구조(URI로 자원 표현), 2) HTTP 메서드를 통한 행위 표현(GET, POST, PUT, DELETE), 3) 무상태성(Stateless), 4) 캐시 가능성, 5) 계층화된 시스템, 6) 통일된 인터페이스입니다. 좋은 예시로는 GitHub API가 있으며, 자원을 명확히 표현하고 적절한 HTTP 메서드를 사용합니다.",
      days: 1,
    },
    {
      id: "q3",
      title: "동시성 문제 해결",
      content:
        "동시성 문제란 무엇이며, 이를 해결하기 위한 기본적인 전략을 설명해주세요. 실제 운영 환경에 적용한 사례가 있다면 함께 설명해 주어도 좋습니다.",
      date: "2025-04-09",
      category: "Backend",
      hint: "동시성은 다중 사용자/요청이 동시에 자원에 접근할 때 발생합니다. 락(lock), 큐(queue), 트랜잭션 격리 수준 등의 개념을 활용해 본 경험을 떠올려 보세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n동시성 문제는 여러 사용자가 동시에 같은 자원에 접근할 때, 의도하지 않은 결과가 생기는 현상입니다. 예를 들어, 게시글 추천 수를 동시에 여러 명이 누르면 실제 추천 수보다 적거나 중복될 수 있습니다. 이를 해결하기 위해 DB에서 트랜잭션을 활용하거나, 어플리케이션 단에서는 락을 사용하는 방법을 학습했습니다. 개인 프로젝트에서 단순한 예시로 Python에서 threading을 사용한 카운터 처리에서 race condition을 실험하고 해결한 적이 있습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n실제 운영 중이던 커머스 서비스에서, 주문 수량 처리 중 동시성 이슈로 재고가 마이너스로 떨어지는 문제가 있었습니다. 해결을 위해 Redis를 활용한 <b>분산 락 시스템(Redlock)</b>을 도입했고, 동시에 트랜잭션의 격리 수준을 Read Committed → Repeatable Read로 조정했습니다. 이후에는 race condition 없이 재고 처리가 안정적으로 이루어졌고, 동시에 예약 처리가 필요한 기능에도 확장 적용할 수 있었습니다.",
      days: 1,
    },
    {
      id: "q4",
      title: "갈등 중재 경험",
      content:
        "프로젝트 진행 중 협업 과정에서 갈등이나 의견 차이가 있었던 경험이 있다면, 이를 어떻게 해결했는지 설명해주세요. 그 과정에서 본인이 맡았던 역할과 결과도 함께 알려주세요.",
      date: "2025-04-09",
      category: "인성",
      hint: '"갈등"은 코드 스타일, 일정 조율, 기술 선택 등 작은 것도 포함됩니다. 감정적 판단보다 협업과 결과 중심의 해결 노력을 강조해 보세요.',
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트 중 백엔드 API 명세를 문서화하는 방식을 두고 의견 차이가 있었습니다. 어떤 팀원은 Notion, 저는 Swagger UI를 주장했죠. 갈등을 줄이기 위해 각 방식의 장단점을 정리해 공유하고, 실제 구현 테스트도 함께 해보자는 제안을 했습니다. 결과적으로 Swagger가 자동화와 유지보수 측면에서 낫다는 데 모두 동의했고, 팀워크도 자연스럽게 회복되었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n코드 리뷰 과정에서 주니어 개발자와 네이밍 규칙을 두고 의견이 충돌한 적이 있습니다. 단순히 지적하기보다, 그 규칙이 왜 필요한지 설명하고 예시를 제시했습니다. 이후에는 리뷰 문화에 대한 가이드를 팀 내에 문서화했고, 리뷰 가이드 세션도 주도했습니다. 개인적인 의견 차이에서 시작된 갈등을 협업 문화 개선의 기회로 바꾼 경험이었습니다.",
      days: 1,
    },
    // Day 2 질문들
    {
      id: "q5",
      title: "기술 도입 시 리스크 관리",
      content:
        "기존 코드베이스에 새로운 기술이나 도구를 도입했던 경험이 있다면, 어떤 리스크를 고려했고, 이를 어떻게 관리했는지 설명해주세요. 실무 경험이 없다면 팀 프로젝트나 사이드 프로젝트에서 고민했던 사례를 공유해 주세요.",
      date: "2025-04-10",
      category: "공통",
      hint: "도입 기술은 프레임워크, 상태 관리 도구, 빌드 시스템, 배포 도구 등 다양합니다. 기존 시스템과의 충돌, 학습 비용, 유지보수 리스크 등을 고려해 본 경험을 공유하세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n졸업작품에서 Redux를 사용하던 기존 코드에 일부 기능만 Recoil로 바꿔보려 했던 적이 있습니다. 하지만 프로젝트 후반에 두 상태 관리 방식이 혼재되면서, 어떤 데이터가 어디서 변경되는지를 추적하기 어려워졌고, 디버깅 시간이 급증했습니다. 이를 해결하기 위해 팀원들과 함께 상태 관리 방식을 통일하기로 결정했고, Recoil로 전면 전환하되 이전 구조와의 차이점을 문서로 남겨 이후 팀원들이 적응할 수 있도록 했습니다. 이 경험을 통해 새로운 기술 도입은 기능 중심이 아니라 유지보수성과 팀 전체의 이해도까지 고려해야 한다는 교훈을 얻었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n사내에서 오래된 Gulp 기반 빌드 환경을 유지하던 프로젝트가 있었습니다. 기능이 많아지면서 빌드 시간이 길어지고, 일부 플러그인은 유지보수가 어려워져 문제가 반복됐습니다.\n이를 해결하기 위해 Webpack 기반 환경으로 점진적 전환을 제안했고, 기존 Gulp task를 하나씩 Webpack config로 이관하는 방식으로 진행했습니다.\n특히 코드 분할(Code Splitting), HMR 도입 등으로 로컬 개발 빌드 시간이 평균 30% 단축되었고, 에러 추적도 쉬워졌습니다.\n중요한 건 새 도구 자체보다, 기존 시스템과 충돌 없이 점진적으로 바꾸는 과정이었고, 이를 위해 팀 내 문서화와 주간 공유를 병행했습니다.",
      days: 2,
    },
    {
      id: "q6",
      title: "렌더링 최적화 경험",
      content:
        "사용자 화면 렌더링이 느리거나 지연됐던 경험이 있다면, 문제를 어떻게 분석하고 어떤 방식으로 개선했는지 설명해 주세요. 작은 프로젝트여도 괜찮습니다.",
      date: "2025-04-10",
      category: "Frontend",
      hint: 'Chrome DevTools, Lighthouse 등으로 화면이 느려지는 원인을 찾아내고 Lazy loading, 리렌더링 최소화, 애니메이션 최적화 등으로 개선한 사례를 설명해 주세요. 핵심은 "무엇이 문제였고, 어떻게 확인했고, 어떻게 해결했는가"의 흐름입니다!',
      modelAnswer:
        '<b>[첫 취업 준비생이라면?]</b><br>\n포트폴리오용 SPA 프로젝트에서 초기 화면 로딩이 늦는 문제가 있었습니다.\nChrome DevTools로 확인해보니, 이미지와 API 데이터를 동시에 불러오면서 렌더링 시점이 늦어지고 있었고, 일부 스타일도 화면을 그리는 시점에 적용되면서 지연이 발생했습니다.\n이를 해결하기 위해 이미지에 loading="lazy" 속성을 적용했고, 데이터 로딩은 페이지 진입 직후가 아닌 컴포넌트 마운트 이후로 분리했습니다.\n또, 스타일은 미리 로딩되도록 구조를 정리했더니 사용자 입장에서 첫 화면이 빠르게 뜨는 걸 확인할 수 있었습니다.\n이 경험을 통해 렌더링 흐름을 이해하고, 작은 변화로도 사용자 경험이 크게 달라질 수 있다는 점을 배웠습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n사내 고객센터 페이지가 느리다는 피드백이 있어, Chrome DevTools의 Performance 탭과 Lighthouse를 활용해 분석했습니다.\n주요 문제는 동적으로 삽입되는 스타일과 웹폰트 로딩이 화면 표시를 지연시키고 있었고, 애니메이션도 브라우저의 처리 비용을 높이고 있었습니다.\n이에 먼저 보여야 할 스타일은 HTML에 미리 포함하고, 웹폰트는 font-display: swap으로 설정해 화면 렌더링을 막지 않게 했습니다.\n애니메이션은 transform 기반으로 변경해 GPU 가속을 유도했고, 결과적으로 FCP는 3.6초에서 2.1초로 단축되었습니다.\n이 과정은 단순 성능 개선을 넘어서, 렌더링 흐름을 시스템적으로 바라보는 시야를 넓힐 수 있었던 계기였습니다.',
      days: 2,
    },
    {
      id: "q22",
      title: "컴포넌트 설계 원칙",
      content:
        "컴포넌트를 설계할 때 재사용성과 유지보수성을 높이기 위해 어떤 원칙을 적용했는지, 실제 사례와 함께 설명해 주세요.",
      date: "2025-04-15",
      category: "Frontend",
      hint: "재사용성은 단순히 나누었다가 아니라, 역할 분리와 데이터 흐름을 고민했는지에 달려 있습니다. Atomic Design, Container/Presentational 구조, props 최소화 등의 실천이 구체적으로 드러나면 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> React 프로젝트에서 UI 요소가 점점 중복되자, 공통 UI를 Atomic Design 기준으로 재설계한 경험이 있습니다.<br> Button, Modal, Card 같은 컴포넌트를 각각의 관심사에 따라 분리하고, props를 엄격히 관리해 재사용성을 높였습니다.<br> 이후 기능 추가 시 중복 없이 빠르게 적용할 수 있었고, 팀원들과의 협업 속도도 개선되었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>디자인 시스템을 도입하면서 공통 UI 컴포넌트를 Atomic Design 패턴에 따라 재구성했습니다.<br>또한 로직이 섞이지 않도록 Presentation-Container 구조로 나누고, props를 최소화하고 기본값을 명시하는 방식으로 유지보수성을 확보했습니다.<br>이후 팀 신규 기능 개발 속도가 약 30% 향상되었고, 테스트도 훨씬 수월해졌습니다.",
      days: 5,
    },
  ]

  const [questions, setQuestions] = useState<Question[]>(hardcodedQuestions)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(hardcodedQuestions)
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [publicAnswers, setPublicAnswers] = useState<Answer[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const { user } = useAuth()
  const userId = user?.userId
  const [nextQuestionTime, setNextQuestionTime] = useState<string>("")
  const [hasMarkedRead, setHasMarkedRead] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showModelAnswer, setShowModelAnswer] = useState(false) // 모범 답변 토글 상태
  const [canViewAnswer, setCanViewAnswer] = useState(false) // 모범 답변 볼 수 있는지 여부
  const [timeRemaining, setTimeRemaining] = useState("") // 남은 시간

  // 현재 날짜 기준으로 Day 계산 - 시간에 따라 Day 3 표시
  const calculateDayCount = () => {
    const now = new Date()

    // 2025년 4월 11일 오전 9시 (Day 3 공개 시간)
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 월은 0부터 시작하므로 4월은 3

    // 현재 시간이 2025년 4월 11일 오전 9시 이후인지 확인
    if (now >= day3ReleaseTime) {
      return 3 // Day 3 표시
    }

    return 2 // 그 전에는 Day 2 표시
  }

  // 현재 날짜 기준 Day 계산
  const currentDay = calculateDayCount()

  // 카테고리별 배지 색상 설정
  const getBadgeClass = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-[#4A6EB0] hover:bg-[#4A6EB0]/90 text-white"
      case "Backend":
        return "bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
      case "공통":
        return "bg-[#9370DB] hover:bg-[#9370DB]/90 text-white"
      case "인성":
        return "bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
      default:
        return "bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text"
    }
  }

  // 날짜 포맷팅 함수 추가
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "04/10" // 기본값 설정
      }
      const year = date.getFullYear().toString().slice(2)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      return `${year}/${month}/${day}`
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error)
      return "04/10" // 오류 시 기본값
    }
  }

  // 질문 필터링 함수 수정 - 카테고리별 필터링 유지 및 시간 기반 필터링 추가
  const filterQuestions = (category) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false)

    // 현재 시간 확인
    const now = new Date()
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 2025년 4월 11일 오전 9시

    // 시간 기반 필터링된 질문 목록
    const timeFilteredQuestions = [...hardcodedQuestions].filter((q) => {
      // Day 3 질문은 오전 9시 이후에만 표시
      if (q.days === 3) {
        return now >= day3ReleaseTime
      }
      return true // Day 1, 2 질문은 항상 표시
    })

    // 카테고리 필터링 적용
    if (category === "전체") {
      setFilteredQuestions(timeFilteredQuestions)
    } else {
      const filtered = timeFilteredQuestions.filter((q) => q.category === category)
      setFilteredQuestions(filtered)
    }
  }

  const fetchPublicAnswers = async (questionId: string) => {
    setIsLoadingAnswers(true)
    try {
      const response = await fetch(`/api/answers?questionId=${questionId}&publicOnly=true`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setPublicAnswers(data.data)
        } else {
          setPublicAnswers([])
        }
      } else {
        setPublicAnswers([])
      }
    } catch (error) {
      console.error("답변 가져오기 오류:", error)
      setPublicAnswers([])
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  // 모범 답변 볼 수 있는지 확인하는 로직 수정
  const handleQuestionClick = async (question: Question) => {
    setSelectedQuestion(question)
    setShowModelAnswer(false) // 모달 열릴 때 모범 답변 숨기기

    // Day3 문제인지 확인하고 모범 답변 볼 수 있는지 체크
    const isDay3Question = question.days === 3
    if (isDay3Question) {
      // Day3 질문은 이미 어제 저녁 8시에 공개되었으므로 항상 볼 수 있음
      setCanViewAnswer(true)
    } else {
      // Day1, Day2 문제는 저녁 8시 이후에만 볼 수 있음
      setCanViewAnswer(canViewModelAnswer())
    }

    // Mark question as read only if it hasn't been marked as read before
    if (userId && !hasMarkedRead) {
      markQuestionAsRead(userId, question.id)
      setHasMarkedRead(true) // Set the state to true after marking as read
    }
  }

  // 남은 시간 계산 함수
  const calculateTimeRemaining = () => {
    const now = new Date()
    const releaseHour = 20 // 저녁 8시

    // 오늘 저녁 8시
    const today8PM = new Date(now)
    today8PM.setHours(releaseHour, 0, 0, 0)

    if (now >= today8PM) {
      setTimeRemaining("")
      return "모범 답변이 공개되었습니다"
    }

    // 남은 시간 계산 (hh:mm:ss 형식)
    const diffMs = today8PM.getTime() - now.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    setTimeRemaining(formattedTime)
    return formattedTime
  }

  useEffect(() => {
    if (selectedQuestion) {
      fetchPublicAnswers(selectedQuestion.id)
    }
  }, [selectedQuestion])

  // 시간 업데이트를 위한 타이머 설정 부분도 수정
  useEffect(() => {
    if (selectedQuestion?.days === 3) {
      // Day3 문제인 경우에만 타이머 설정
      calculateTimeRemaining()
      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining()
        if (remaining === "모범 답변이 공개되었습니다") {
          setCanViewAnswer(true)
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [selectedQuestion])

  const categories = ["전체", "Frontend", "Backend", "공통", "인성"]

  // useEffect 내의 정렬 로직도 수정
  useEffect(() => {
    // 현재 시간 확인
    const now = new Date()
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 2025년 4월 11일 오전 9시

    // 시간 기반 필터링
    const timeFilteredQuestions = [...hardcodedQuestions].filter((q) => {
      // Day 3 질문은 오전 9시 이후에만 표시
      if (q.days === 3) {
        return now >= day3ReleaseTime
      }
      return true // Day 1, 2 질문은 항상 표시
    })

    // 질문을 Day 기준으로 내림차순 정렬 (최신순)
    const sortedQuestions = timeFilteredQuestions.sort((a, b) => {
      // 먼저 Day로 내림차순 정렬
      if (b.days !== a.days) {
        return b.days - a.days
      }
      // Day가 같으면 ID로 정렬 (q1, q2, q2-1, q3, q3-1, q4 순서)
      return a.id.localeCompare(b.id)
    })

    setQuestions(sortedQuestions)
    setFilteredQuestions(sortedQuestions)
  }, [])

  // Add click-outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if dropdown is open and the click is outside dropdown area
      if (isDropdownOpen && event.target.closest("[data-dropdown-container]") === null) {
        setIsDropdownOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Clean up the event listener when dropdown closes or component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-hanghae-text">지난 면접 질문</h1>
        <div className="relative" data-dropdown-container>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory}
            <ChevronDown className="h-4 w-4" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-hanghae-gray border border-[#3a3e41] rounded-md shadow-lg z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left px-4 py-2 hover:bg-hanghae-light"
                  onClick={() => filterQuestions(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Dialog
            key={question.id}
            open={isDialogOpen && selectedQuestion?.id === question.id}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (open) {
                setHasMarkedRead(false) // Reset the state when the dialog is opened
                handleQuestionClick(question)
              } else {
                setSelectedQuestion(null)
              }
            }}
          >
            <DialogTrigger asChild>
              <Card className="hover:bg-hanghae-light/50 transition-colors cursor-pointer border-[#3a3e41] border-[1px]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{question.title}</CardTitle>
                    <Badge className={getBadgeClass(question.category)}>{question.category}</Badge>
                  </div>
                  <div className="text-sm text-hanghae-text/70">
                    Day {question.days} ({formatDate(question.date)})
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-hanghae-text/70 line-clamp-2">{question.content}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
              <DialogHeader>
                <div className="flex justify-between items-center pr-8">
                  <DialogTitle className="text-xl">{selectedQuestion?.title}</DialogTitle>
                  <Badge className={selectedQuestion ? getBadgeClass(selectedQuestion.category) : ""}>
                    {selectedQuestion?.category}
                  </Badge>
                </div>
                <div className="text-sm text-hanghae-text/70">
                  Day {selectedQuestion?.days} ({selectedQuestion ? formatDate(selectedQuestion.date) : ""})
                </div>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <div className="prose dark:prose-invert max-w-none text-hanghae-text break-words">
                  <p>{selectedQuestion?.content}</p>

                  {selectedQuestion?.hint && (
                    <div className="mt-4 p-4 bg-hanghae-light rounded-md">
                      <h3 className="text-sm font-medium mb-1">힌트</h3>
                      <p className="text-sm">{selectedQuestion.hint}</p>
                    </div>
                  )}
                </div>

                {/* 모범 답변 - 오늘의 문제는 시간에 따라 표시 */}
                {selectedQuestion?.modelAnswer && (
                  <div className="mt-6">
                    <button
                      onClick={() => canViewAnswer && setShowModelAnswer(!showModelAnswer)}
                      className="flex items-center text-lg font-medium mb-3 w-full justify-between"
                      disabled={!canViewAnswer}
                    >
                      <span>모범 답변</span>
                      {selectedQuestion.days === 2 && !canViewAnswer ? (
                        <div className="flex items-center text-sm text-hanghae-text/70">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{timeRemaining ? `${timeRemaining} 후 공개` : "저녁 8시에 공개됩니다"}</span>
                        </div>
                      ) : showModelAnswer ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>
                    {canViewAnswer && showModelAnswer && (
                      <div
                        className="bg-hanghae-light p-4 rounded-md break-words text-sm"
                        dangerouslySetInnerHTML={{ __html: selectedQuestion.modelAnswer }}
                      />
                    )}
                    {selectedQuestion.days === 2 && !canViewAnswer && (
                      <div className="bg-hanghae-light p-4 rounded-md text-center text-hanghae-text/70">
                        모범 답변은 저녁 8시에 공개됩니다.
                      </div>
                    )}
                  </div>
                )}

                {/* 공개된 답변들 */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">공개된 답변 ({publicAnswers.length})</h3>
                  {isLoadingAnswers ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-hanghae-light p-4 rounded-md animate-pulse">
                          <div className="flex justify-between items-center mb-2">
                            <div className="h-4 bg-hanghae-gray rounded w-24"></div>
                            <div className="h-3 bg-hanghae-gray rounded w-32"></div>
                          </div>
                          <div className="h-16 bg-hanghae-gray rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : publicAnswers.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {publicAnswers.map((answer) => (
                        <div key={answer.id} className="bg-hanghae-light p-4 rounded-md">
                          <div className="mb-2">
                            <span className="font-medium">{answer.nickname}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words">{answer.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-hanghae-light p-4 rounded-md">
                      <p className="text-hanghae-text/70 text-center">아직 공개된 답변이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </PageLayout>
  )
}
