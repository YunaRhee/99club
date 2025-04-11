"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/questions"
import QuestionCard from "@/components/question-card"
import AnswerForm from "@/components/answer-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ModelAnswer from "@/components/model-answer"
import PageLayout from "@/components/page-layout"
import { Clock } from "lucide-react"

export default function Home() {
  // 하드코딩된 Day 2 질문들 - ID 형식 수정
  const hardcodedQuestions = {
    frontend: {
      id: "q6", // frontend Day 2 질문 ID
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
    backend: {
      id: "q7", // backend Day 2 질문 ID
      title: "마이크로서비스 데이터 일관성",
      content:
        "마이크로서비스 혹은 분산 시스템에서 데이터 일관성을 유지하기 위한 전략을 고민하거나 적용한 경험이 있다면 공유해주세요. 규모가 작아도 서비스 간 데이터 처리 흐름을 설계해본 경험이면 충분합니다.",
      date: "2025-04-10",
      category: "Backend",
      hint: "단일 DB 트랜잭션이 아닌, 서비스 간 데이터 일관성을 유지하는 방식을 고민해본 경험을 떠올려 보세요. (예: Eventual Consistency, 이벤트 기반 처리, SAGA 패턴 등)",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n토이 프로젝트에서 사용자 서비스와 결제 서비스를 나누어 구현했는데, 결제 완료 후 사용자 상태를 업데이트하는 로직이 REST API 방식의 동기 호출되다 보니 결제 실패 시 사용자 상태가 잘못 변경되는 문제가 있었습니다.\n이를 해결하기 위해 RabbitMQ를 도입해 결제 완료 시 이벤트 메시지를 발행하고, 사용자 서비스가 이를 구독해 상태를 변경하도록 했습니다.\n비록 작은 프로젝트였지만, 서비스 간의 의존도를 줄이고 일관된 흐름을 유지하기 위해 비동기 메시징이 필요하다는 것을 체감할 수 있었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n커머스 시스템에서 주문, 결제, 배송 서비스를 마이크로서비스로 분리한 이후, 주문 생성 후 결제 실패 시 데이터 정합성 이슈가 발생했습니다.\n이를 해결하기 위해 SAGA 패턴을 기반으로 한 이벤트 드리븐 구조를 도입했고, Kafka를 이벤트 브로커로 사용해 서비스 간 데이터를 전달했습니다.\n실패 시 보상 트랜잭션을 통해 이전 상태로 복구하는 로직을 각 서비스에 구현했으며, idempotent key 처리, DLQ 설계 등도 함께 적용해 안정성을 높였습니다.\n결과적으로 연관 서비스 간 장애 전파율이 줄고 유지보수 비용도 감소했습니다.",
      days: 2,
    },
    common: {
      id: "q5", // 공통 Day 2 질문 ID
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
    personality: {
      id: "q8", // 인성 Day 2 질문 ID
      title: "실패 경험과 교훈",
      content:
        "최근에 실패했던 경험이 있다면 솔직하게 공유해 주세요. 그 실패로부터 무엇을 배우고, 어떻게 성장했는지도 함께 이야기해 주세요. 결과가 좋지 않아도 괜찮습니다.",
      date: "2025-04-10",
      category: "인성",
      hint: '"실패"는 결과가 안 좋았던 프로젝트, 일정 지연, 기술 선택 실패, 협업 문제 등 다양합니다. 이런 질문의 핵심은 실패 자체보다 그 이후의 성찰과 변화가 무엇이었는지 묻는 거예요!',
      modelAnswer:
        '<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트 중 더 완성도 높은 결과물을 만들고 싶다는 욕심에, 개발 도중 기획을 확장하다 보니 마감 기한을 지키지 못했습니다.\n특히 복잡한 필터링 기능을 추가했는데, 예상보다 많은 시간과 버그가 발생했고 팀원들의 부담도 커졌습니다.\n이 경험을 통해 \'무엇을 얼마나 잘 구현할 것인가\'도 중요하지만, MVP를 명확히 정의하고 우선순위를 조율하는 것이 프로젝트의 핵심이라는 걸 배웠습니다. 이후엔 모든 프로젝트에서 이 부분을 가장 먼저 체크하고 있습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n첫 이직 후, 전 직장에서 쓰지 않던 GraphQL을 사용하는 프로젝트에 투입되었는데, 생소한 도구와 도메인 때문에 문제를 스스로 해결하려다 기능 배포가 지연된 적이 있습니다.\n"적응 중인데 민폐를 끼치기 싫다"는 생각에 요청을 미뤘지만, 오히려 팀에 부담을 준 결과였죠.\n이후 팀 리더와 회고를 진행했고, 그 뒤로는 작은 어려움도 빠르게 공유하고 온보딩 기술 공유 세션을 자발적으로 운영했습니다.\n이 경험은 "성장 = 혼자 해결"이라는 고정관념을 깬 계기가 되었고, 지금은 신규 입사자들의 질문을 먼저 들어주는 입장이 되었습니다.',
      days: 2,
    },
    // Day 3 질문들
    q9: {
      id: "q9",
      title: "의견 충돌과 협상",
      content:
        "팀 내에서 기술적 의견 차이가 있었던 상황에서, 본인의 입장을 유지하면서도 상대와 타협하거나 협상을 이끌어낸 경험이 있다면 공유해주세요.",
      date: "2025-04-11",
      category: "인성",
      hint: '기술 선택, 일정 조율, 코드 스타일, 구현 방식 등에서 갈등이 생길 수 있습니다.\n여기서 포인트는 "무작정 고집"이 아니라, 근거 기반 설득 → 협상 → 합의 도출의 과정이며, 자신이 제안한 방식이 채택되지 않아도, 과정이 건강했다면 좋은 예입니다!',
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트에서 UI 라이브러리를 통일할지 각자 사용하는 방식대로 진행할지를 두고 팀원과 의견이 엇갈렸습니다.<br>\n저는 유지보수와 코드 통일성 측면에서 통일된 라이브러리가 낫다고 주장했고, 그 근거를 문서로 정리한 뒤 공유했습니다.<br>\n결과적으로 토론 끝에 메인 기능은 통일된 라이브러리를 쓰되, 부가 기능은 자유롭게 구현하기로 타협점을 찾을 수 있었습니다.<br>\n\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n코드 리뷰 중 유틸 함수의 책임 분리를 두고 팀원과 충돌이 있었습니다. 저는 단일 책임 원칙에 따라 분리를 제안했고, 팀원은 복잡성 증가를 우려했습니다.<br>\n이에 기존 코드에서 발생했던 유지보수 이슈를 기반으로 설명하고, 일단 분리해 적용 후 회고에서 다시 검토하기로 했습니다.<br>\n최종적으로는 설계의 장점이 입증되었고, 팀의 기술 토론 문화가 더 성숙해지는 계기가 되었습니다.\n",
      days: 3,
    },
    q10: {
      id: "q10",
      title: "코드 리팩토링 경험",
      content:
        "기존 코드베이스에서 리팩토링을 진행한 경험이 있다면, 어떤 문제를 발견했고 어떻게 개선했는지 설명해주세요. 리팩토링 전후의 차이점과 그 결과도 함께 공유해주세요.",
      date: "2025-04-11",
      category: "공통",
      hint: "리팩토링은 외부 동작을 바꾸지 않으면서 내부 구조를 개선하는 과정입니다. 코드 중복 제거, 함수 분리, 클래스 재구성 등의 경험을 떠올려보세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트에서 API 호출 로직이 여러 컴포넌트에 중복되어 있어 유지보수가 어려웠습니다. 이를 개선하기 위해 공통 훅(custom hook)으로 분리하고, 에러 처리와 로딩 상태 관리도 일관되게 처리했습니다. 리팩토링 후에는 코드량이 30% 정도 줄었고, 새로운 API 연동 시 개발 시간도 크게 단축되었습니다.<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n레거시 프로젝트에서 비즈니스 로직과 UI 로직이 혼재된 컴포넌트를 발견했습니다. 이로 인해 테스트가 어렵고 기능 확장 시 사이드 이펙트가 자주 발생했습니다. 이를 개선하기 위해 Presenter-Container 패턴을 적용해 비즈니스 로직을 분리하고, 단위 테스트를 추가했습니다. 결과적으로 테스트 커버리지가 40%에서 75%로 증가했고, 이후 기능 추가 시 버그 발생률이 60% 감소했습니다.",
      days: 3,
    },
    q11: {
      id: "q11",
      title: "데이터베이스 최적화 경험",
      content:
        "데이터베이스 성능 이슈를 경험하고 이를 해결한 경험이 있다면 공유해주세요. 어떤 문제가 있었고, 어떤 방식으로 진단하고 개선했는지 설명해주세요.",
      date: "2025-04-11",
      category: "Backend",
      hint: "인덱스 최적화, 쿼리 튜닝, 데이터 모델링 개선, 캐싱 도입 등의 경험을 떠올려보세요. 성능 측정 방법과 개선 효과도 함께 설명하면 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n토이 프로젝트에서 게시글 목록을 불러올 때 페이지 로딩이 느려지는 문제가 있었습니다. 개발 도구로 확인해보니 DB 쿼리 실행 시간이 길었고, EXPLAIN 명령어로 분석한 결과 인덱스가 제대로 활용되지 않고 있었습니다. 게시글 테이블에 복합 인덱스를 추가하고, 페이지네이션 쿼리를 최적화한 결과 조회 시간이 2초에서 0.3초로 단축되었습니다.<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n실시간 대시보드 서비스에서 사용자가 늘어나면서 DB 부하가 증가하고 응답 시간이 10초 이상으로 늘어나는 문제가 발생했습니다. 프로파일링 결과, 자주 조회되는 통계 데이터를 매번 계산하는 것이 원인이었습니다. 이를 해결하기 위해 Redis를 도입해 계산된 결과를 캐싱하고, 배치 작업으로 주기적으로 갱신하는 방식으로 변경했습니다. 또한 자주 사용되는 쿼리에 적절한 인덱스를 추가하고, 일부 테이블은 파티셔닝을 적용했습니다. 결과적으로 평균 응답 시간이 0.5초 이내로 개선되었고, DB 서버 부하도 70% 감소했습니다.",
      days: 3,
    },
    q12: {
      id: "q12",
      title: "프론트엔드 상태 관리 전략",
      content:
        "복잡한 프론트엔드 애플리케이션에서 상태 관리를 어떻게 설계하고 구현했는지 경험을 공유해주세요. 어떤 상태 관리 라이브러리나 패턴을 선택했고, 그 이유는 무엇인가요?",
      date: "2025-04-11",
      category: "Frontend",
      hint: "상태의 종류(전역/지역, 서버/클라이언트, UI/데이터)를 구분하고, 각각에 적합한 관리 방식을 선택한 경험을 설명해보세요. 라이브러리 선택 이유와 아키텍처 설계 과정도 함께 공유하면 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트에서 사용자 인증, 장바구니, UI 상태 등 다양한 상태를 관리해야 했습니다. 처음에는 Context API만으로 구현했지만, 컴포넌트가 늘어나면서 불필요한 리렌더링과 코드 복잡성 문제가 발생했습니다. 이를 해결하기 위해 상태를 UI 상태와 서버 데이터로 구분하고, UI 상태는 Recoil로, 서버 데이터는 React Query로 관리하는 방식을 도입했습니다. 그 결과 코드 가독성이 높아지고, 캐싱과 비동기 상태 관리가 용이해졌습니다.<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n대규모 어드민 대시보드 프로젝트에서 상태 관리 전략을 설계했습니다. 애플리케이션의 복잡성을 고려해 상태를 세 가지로 분류했습니다: 1) 전역 앱 상태(Redux), 2) 서버 데이터(React Query), 3) 지역 UI 상태(useState/useReducer). Redux는 미들웨어 생태계와 DevTools의 이점 때문에 선택했으며, 특히 복잡한 필터링과 정렬 상태를 관리하는 데 효과적이었습니다. 또한 Redux 모듈을 도메인별로 분리하고 Redux Toolkit을 도입해 보일러플레이트 코드를 줄였습니다. 이러한 접근 방식으로 개발자 간 일관된 상태 관리가 가능해졌고, 새로운 기능 추가 시 개발 속도도 30% 향상되었습니다.",
      days: 3,
    },
  }

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

  // 현재 날짜 기준 Day 계산 - 항상 2 반환
  const dayCount = calculateDayCount()

  // 카테고리별 질문 확인 상태 관리
  const [confirmedCategories, setConfirmedCategories] = useState<{ [key: string]: boolean }>({
    frontend: false,
    backend: false,
    common: false,
    personality: false,
  })

  // 질문 데이터 상태 - 하드코딩된 질문으로 초기화
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<{
    frontend: Question | null
    backend: Question | null
    common: Question | null
    personality: Question | null
  }>(() => {
    // 현재 시간 확인
    const now = new Date()
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 2025년 4월 11일 오전 9시

    // Day 3 공개 시간이 되었는지 확인
    if (now >= day3ReleaseTime) {
      // Day 3 질문 표시
      return {
        frontend: hardcodedQuestions.q12, // Day 3 Frontend 질문
        backend: hardcodedQuestions.q11, // Day 3 Backend 질문
        common: hardcodedQuestions.q10, // Day 3 공통 질문
        personality: hardcodedQuestions.q9, // Day 3 인성 질문
      }
    } else {
      // Day 2 질문 표시
      return {
        frontend: hardcodedQuestions.frontend,
        backend: hardcodedQuestions.backend,
        common: hardcodedQuestions.common,
        personality: hardcodedQuestions.personality,
      }
    }
  })
  const [initialLoading, setInitialLoading] = useState(false)

  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState("common") // 공통 탭을 기본으로 선택

  // 현재 날짜 포맷팅 (25/04/03(목))
  const today = new Date()
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()]
  const formattedDate = `${today.getFullYear().toString().slice(2)}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}(${dayOfWeek})`

  // 타이머 상태 추가
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [nextQuestionTime, setNextQuestionTime] = useState<string>("")

  // 타이머 계산 함수
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()

      // 오늘 오전 9시
      const today9AM = new Date(now)
      today9AM.setHours(9, 0, 0, 0)

      // 내일 오전 9시
      const tomorrow9AM = new Date(now)
      tomorrow9AM.setDate(tomorrow9AM.getDate() + 1)
      tomorrow9AM.setHours(9, 0, 0, 0)

      // 현재 시간이 오늘 오전 9시 이전이면 오늘 오전 9시까지, 아니면 내일 오전 9시까지
      const targetTime = now < today9AM ? today9AM : tomorrow9AM

      const diffMs = targetTime.getTime() - now.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }

    calculateTimeRemaining()
    const timer = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(timer)
  }, [])

  // 로컬 스토리지에서 확인 상태 로드 - 수정된 부분
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newConfirmedState = { ...confirmedCategories }
      let hasChanges = false

      // 각 카테고리별 질문 확인 상태 로드
      const categoryKeys = ["frontend", "backend", "common", "personality"]

      categoryKeys.forEach((key) => {
        if (questions[key]) {
          const question = questions[key]
          const category = getCategoryFromKey(key)
          const storageKey = `question_read_${question.id}_${category}`

          if (localStorage.getItem(storageKey) === "true") {
            newConfirmedState[key] = true
            hasChanges = true
          }
        }
      })

      // 상태가 변경되었을 때만 업데이트
      if (hasChanges) {
        setConfirmedCategories(newConfirmedState)
      }
    }
  }, [])

  // 카테고리 키에서 카테고리 이름 가져오기
  const getCategoryFromKey = (key: string): string => {
    switch (key) {
      case "frontend":
        return "Frontend"
      case "backend":
        return "Backend"
      case "common":
        return "공통"
      case "personality":
        return "인성"
      default:
        return key
    }
  }

  // 질문 확인 핸들러
  const handleQuestionConfirmed = (category: string) => {
    const categoryKey = getCategoryKey(category)

    // 로컬 스토리지에 저장
    if (typeof window !== "undefined") {
      const question = questions[categoryKey]
      if (question) {
        localStorage.setItem(`question_read_${question.id}_${category}`, "true")
      }
    }

    setConfirmedCategories((prev) => ({
      ...prev,
      [categoryKey]: true,
    }))
  }

  // 카테고리 문자열을 키로 변환
  const getCategoryKey = (category: string): string => {
    switch (category) {
      case "Frontend":
        return "frontend"
      case "Backend":
        return "backend"
      case "공통":
        return "common"
      case "인성":
        return "personality"
      default:
        return "frontend"
    }
  }

  // 현재 탭에 해당하는 질문 ID 가져오기
  const getCurrentQuestionId = () => {
    const question = questions[activeTab]
    return question ? question.id : ""
  }

  // 현재 탭에 해당하는 카테고리 가져오기
  const getCurrentCategory = () => {
    switch (activeTab) {
      case "frontend":
        return "Frontend"
      case "backend":
        return "Backend"
      case "common":
        return "공통"
      case "personality":
        return "인성"
      default:
        return "Frontend"
    }
  }

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <PageLayout title={`Day ${dayCount} 오늘의 질문`} subtitle={formattedDate}>
      <Tabs defaultValue="common" onValueChange={handleTabChange}>
        <TabsList className="mb-0.5 w-full rounded-md">
          <TabsTrigger value="frontend" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            Backend
          </TabsTrigger>
          <TabsTrigger value="common" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            공통
          </TabsTrigger>
          <TabsTrigger
            value="personality"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black"
          >
            인성
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frontend">
          {questions.frontend ? (
            <QuestionCard question={questions.frontend} category="Frontend" onConfirmRead={handleQuestionConfirmed} />
          ) : (
            <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
              오늘의 Frontend 질문이 준비되지 않았습니다.
            </div>
          )}
        </TabsContent>

        <TabsContent value="backend">
          {questions.backend ? (
            <QuestionCard question={questions.backend} category="Backend" onConfirmRead={handleQuestionConfirmed} />
          ) : (
            <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
              오늘의 Backend 질문이 준비되지 않았습니다.
            </div>
          )}
        </TabsContent>

        <TabsContent value="common">
          {questions.common ? (
            <QuestionCard question={questions.common} category="공통" onConfirmRead={handleQuestionConfirmed} />
          ) : (
            <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
              오늘의 공통 질문이 준비되지 않았습니다.
            </div>
          )}
        </TabsContent>

        <TabsContent value="personality">
          {questions.personality ? (
            <QuestionCard question={questions.personality} category="인성" onConfirmRead={handleQuestionConfirmed} />
          ) : (
            <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
              오늘의 인성 질문이 준비되지 않았습니다.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 답변 작성하기 폼 - 해당 카테고리 질문이 확인된 경우에만 표시 */}
      {confirmedCategories[activeTab] && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-hanghae-text">답변 작성하기</h2>
            <div className="flex items-center text-main-red font-bold">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">인증 마감까지</span>
              <span className="ml-2">{timeRemaining}</span>
            </div>
          </div>
          <AnswerForm questionId={getCurrentQuestionId()} category={getCurrentCategory()} />
        </div>
      )}

      {/* 모범 답안 - 항상 표시 */}
      {questions[activeTab] && <ModelAnswer modelAnswer={questions[activeTab].modelAnswer || ""} />}
    </PageLayout>
  )
}
