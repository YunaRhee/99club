"use client"
import type { Question } from "@/lib/questions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, ChevronUp, Clock } from 'lucide-react'
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
    // Day 3 질문들
    {
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
    {
      id: "q10",
      title: "기술 부채 관리",
      content:
        "프로젝트에서 기술 부채를 어떻게 정의하고, 그것을 정량화하거나 체계적으로 관리해본 경험이 있다면 설명해주세요.그 과정을 통해 어떤 효과가 있었는지도 함께 이야기해주세요.",
      date: "2025-04-11",
      category: "공통",
      hint: "기술 부채는 빠른 개발을 위해 나중에 갚기로 한 '빚' 같은 기술적 타협을 말하며, 코드 중복, 테스트 누락, 문서화 부족 등도 포함됩니다. 기술 부채에 대한 정량화 기준(예: PR backlog, 테스트 커버리지 등), 대응 방식(Refactor Sprint, 주간 점검 등)을 중심으로 답변해 보세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>팀 프로젝트에서 일정이 촉박해 공통 컴포넌트를 빠르게 하드코딩 방식으로 처리한 적이 있습니다.<br>나중에는 같은 컴포넌트에 반복적으로 수정이 들어가면서 유지보수가 어려워졌고, 이걸 계기로 리팩토링 전용 스프린트를 따로 만들었습니다.<br>기능과 속도만 보던 초반과 달리, 이후엔 기술 부채도 하나의 '관리 대상'으로 인식하게 되었고, 지금은 설계 단계에서부터 중복과 확장 가능성을 의식하려 노력하고 있습니다.<br><br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>사내 프로젝트에서 테스트 커버리지 부족, 중복 로직, 복잡한 조건문이 점점 쌓이면서 개발 속도도 떨어지고 버그 빈도가 높아졌습니다.<br>이를 해결하기 위해 기술 부채 점검 기준을 팀 차원에서 정리하고, 매 스프린트마다 일정 비율로 리팩토링 태스크를 포함했습니다.",
      days: 3,
    },
    {
      id: "q11",
      title: "분산 시스템 장애 복구",
      content:
        "분산 시스템에서 서비스 장애나 노드 장애가 발생했을 때, 복구 전략이나 재시작 로직을 설계하면서 고려했던 요소와 실제 경험이 있다면 설명해주세요.",
      date: "2025-04-11",
      category: "Backend",
      hint: "장애 탐지 방법, 복구 전략(자동/수동), 데이터 정합성 유지 방법, 장애 전파 방지 등의 관점에서 설명해 보세요. 실제 경험이 없다면 학습한 내용이나 토이 프로젝트에서 고려했던 부분을 공유해도 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>Kafka를 활용한 데이터 파이프라인을 구성하던 토이 프로젝트에서, consumer가 중단되면 메시지를 처리하지 못해 데이터 누락 문제가 발생했습니다.<br>이후 오프셋을 명시적으로 관리하고, 실패 시에는 일정 시간 간격을 둔 재시도 로직을 추가했습니다.<br>단순히 메시지를 처리하는 것뿐 아니라, 실패 가능성을 고려한 복구 구조의 중요성을 느낀 경험이었습니다.<br><br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>실시간 통계 수집 시스템에서 노드 장애가 발생하면서 결과 데이터 누락 문제가 생긴 적이 있었습니다.<br>장애 탐지와 상태 복구를 위해 Redis 기반 상태 저장, liveness probe 설정, 그리고 서킷 브레이커 패턴을 적용했습니다.<br>또한 Kafka 메시지의 idempotent 처리, DLQ 설정까지 함께 구성해 장애 복구 시 데이터의 정합성을 유지할 수 있도록 했습니다.<br>결과적으로 운영 중단 없이 자동 복구가 가능해졌고, 재현 테스트도 안정적으로 통과할 수 있었습니다.",
      days: 3,
    },
    {
      id: "q12",
      title: "코드 스플리팅 & Lazy Loading",
      content:
        "대규모 애플리케이션에서 코드 스플리팅이나 Lazy loading을 적용하며 성능 최적화를 시도한 경험이 있다면,구현 중 어떤 문제를 마주했고, 어떻게 해결했는지 설명해주세요.",
      date: "2025-04-11",
      category: "Frontend",
      hint: "적용 과정에서 생긴 성능·UX상의 이슈와, 이를 해결하기 위해 도입한 도구나 기법(Webpack, dynamic import 등)을 구체적으로 설명해 보세요!",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>React로 만든 포트폴리오 사이트에서 초기 로딩 속도가 느려 사용자 이탈이 발생했습니다.<br>라우트 기반으로 React.lazy와 Suspense를 적용해 페이지 단위로 분리하고, 이미지에는 loading=\"lazy\" 속성을 넣었습니다.<br>처음에는 깜빡이는 현상이 있었지만 Skeleton UI를 도입하고, 데이터 요청 시점을 조정하면서 UX가 개선된 경험이 있습니다.<br><br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>대규모 관리자 페이지에서 JS 번들이 점점 커지면서 LCP 지표가 악화됐고, 특히 모바일에서 문제였어요.<br>Webpack에서 공통 컴포넌트 단위까지 코드 스플리팅을 적용하고, IntersectionObserver를 활용해 Lazy Loading을 구현했습니다.<br>또한 초기 렌더링을 방해하는 비동기 리소스를 defer 처리하고, Critical CSS를 별도로 관리하면서 LCP가 약 40% 개선되었습니다.<br>이 과정에서 기술보다 '언제 무엇을 로딩할 것인가'의 전략이 훨씬 중요하다는 걸 체감했습니다.",
      days: 3,
    },
    // Day 4 질문들
    {
      id: "q13",
      title: "컨테이너화와 오케스트레이션",
      content:
        "컨테이너화 및 오케스트레이션 도구를 통해 개발/배포 환경을 효율화한 사례가 있다면, 그 방식과 효과를 구체적으로 설명해 주세요.",
      date: "2025-04-14",
      category: "공통",
      hint: "단순히 Docker를 사용해봤다는 수준을 넘어서, 실제 어떤 문제를 해결하기 위해 도입했는지를 중심으로 풀어주는 게 좋습니다.GitOps 방식, Canary 배포, 자동 스케일링 등의 키워드를 함께 언급하시면 실전 경험이 잘 드러납니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>학부 프로젝트에서 도커를 활용해 개발 환경을 통일한 경험이 있습니다.<br> 개발자마다 로컬 환경이 달라 빌드 오류가 잦았는데, Dockerfile을 설정해 공통 환경을 구성했고, 팀원 전원이 동일한 환경에서 개발할 수 있도록 만들었습니다.<br> 이후 GitHub Actions를 통해 이미지 빌드 및 테스트 자동화를 구성하면서, 실무에 가까운 CI/CD 흐름을 경험할 수 있었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> EKS 기반 마이크로서비스에서 배포 자동화를 위해 ArgoCD를 도입했습니다.<br> 각 서비스는 Helm chart로 구성해 공통 배포 규칙을 관리했고, GitOps 방식으로 운영하면서 배포 오류율이 70% 이상 감소했습니다.<br> 또한 HPA를 연동해 트래픽 급증 시 자동 스케일링이 가능해졌고, Canary 배포 전략으로 무중단 배포까지 구현했습니다.",
      days: 4,
    },
    {
      id: "q14",
      title: "클라이언트 보안",
      content:
        "웹 클라이언트에서 발생할 수 있는 보안 취약점을 방지하기 위해 어떤 전략을 설계하고 구현했는지 실제 사례를 들어 설명해 주세요.",
      date: "2025-04-14",
      category: "Frontend",
      hint: "XSS나 CSRF 같은 용어만 나열하기보다는, 실제 어떤 입력값이 문제였고 그에 어떤 도구나 정책으로 대응했는지를 설명해주시면 좋습니다. 보안은 예방보다 복구가 어렵기 때문에, 초기 설계 관점에서 접근한 경험이 있다면 특히 강점이 될 수 있습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> React로 구현한 블로그 프로젝트에서 XSS 공격 가능성을 테스트하다 alert() 삽입이 가능하다는 걸 발견했습니다.<br> 이후 DOMPurify를 도입해 사용자 입력값을 sanitize 처리했고, 사용자 입력 시 위험한 태그를 제거하도록 수정했습니다.<br> 보안은 단순 기능 외에도 기본 방어선이 있어야 한다는 걸 처음 체감한 경험입니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 사내 관리자 페이지에서 iframe embedding, XSS 시도 등의 이슈가 발견된 이후, CSP 정책 설정과 input 필드에 sanitize 처리를 적용했습니다.<br> 또한 쿠키에 SameSite 설정을 적용해 CSRF 대응을 강화했고, Sentry를 통해 사용자 단의 예외 이벤트도 함께 추적했습니다.<br> 보안은 기능 구현 이후가 아니라, 기획 단계부터 염두에 두어야 함을 깨달은 계기였습니다.",
      days: 4,
    },
    {
      id: "q15",
      title: "데이터베이스 최적화 기법",
      content:
        "DB 인덱스, 샤딩, 복제 등의 기법을 활용해 성능을 개선한 경험이 있다면, 문제 상황과 적용 방식, 결과를 함께 설명해 주세요.",
      date: "2025-04-14",
      category: "Backend",
      hint: '쿼리 성능 문제를 어떤 방식으로 진단했고, 그에 따라 어떤 인덱스를 어떻게 설계했는지가 중요합니다. 단순히 "인덱스를 추가했다"보다는, 실행 계획(EXPLAIN) 분석이나 파티셔닝·샤딩을 통한 구조적 접근이 담기면 훨씬 설득력 있는 답변이 됩니다.',
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 사이드 프로젝트에서 특정 게시글 리스트 API가 매우 느려지는 현상이 있었고, 쿼리를 분석해보니 날짜 필드 정렬 시 인덱스가 적용되지 않는 문제가 있었습니다.<br> 이를 해결하기 위해 복합 인덱스를 생성했고, DB 조회 속도가 3초 → 0.3초로 개선되었습니다.<br> 처음엔 단순히 LIMIT 문제로 생각했지만, 실제 실행 계획(EXPLAIN) 확인의 중요성을 알게 되었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 거래 데이터가 수억 건 누적된 테이블에서 정산 리포트 API의 성능 문제가 발생했습니다.<br> 비정규화 테이블을 분리하고 파티셔닝 전략과 인덱스 튜닝, 읽기 전용 슬레이브를 통한 부하 분산을 적용해 평균 응답 속도를 5초 → 0.7초로 줄였습니다.<br> 이외에도 slow query 로그 기반으로 인덱스 통계를 정리해 매월 리팩토링 주기를 운영했습니다.",
      days: 4,
    },
    {
      id: "q16",
      title: "리더십 발휘 순간",
      content:
        "프로젝트나 팀 활동 중 리더십을 발휘했던 경험이 있다면, 어떤 방식으로 팀을 이끌었고 어떤 결과를 냈는지 설명해 주세요.",
      date: "2025-04-14",
      category: "인성",
      hint: "팀원 간 의견 차이나 일정 위기 등 구체적인 상황에서 어떻게 조율하고 리드했는지가 중요합니다. 주도적으로 흐름을 바꿨던 순간이나, 팀 분위기·성과에 긍정적인 영향을 미친 행동이 잘 드러나야 실무형 리더십으로 인정받을 수 있습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 팀 프로젝트에서 일정이 자꾸 밀려 팀 분위기가 가라앉은 상황이 있었습니다.<br> 제가 먼저 팀원들과 일정을 다시 정리하고 우선순위를 조정해 '작동하는 기능부터 완성하자'는 MVP 전략을 제안했습니다.<br> 이후 팀원 간 협업이 원활해졌고 프로젝트도 제시간에 마무리할 수 있었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 신규 기능 런칭 프로젝트에서 PO가 중간 이탈해 일정이 크게 흔들린 적이 있습니다.<br> PM 부재 상태에서 주도적으로 요구사항 정리, 스프린트 재계획, QA 체크리스트 작성 등을 리드했고, 릴리즈를 무사히 완료했습니다.<br> 이후 회고에서 해당 경험이 계기가 되어 팀 내 기술 PM 역할을 제안받기도 했습니다.",
      days: 4,
    },
    {
      id: "q17",
      title: "데이터 보안 설계",
      content:
        "시스템이나 서비스 설계 시 데이터 보안 또는 개인정보 보호를 고려한 사례가 있다면, 어떤 원칙에 따라 설계했는지 설명해 주세요.",
      date: "2025-04-15",
      category: "공통",
      hint: "개인정보 암호화나 마스킹은 기술 이름보다, 왜 그렇게 설계했는지를 중심으로 설명해 보세요. 최소 권한 원칙, 접근 통제, 로깅 등 보안 설계의 관점이 담기면 강한 인상을 줄 수 있습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 학생 대상 설문 시스템을 만들면서, 이름과 이메일을 그대로 저장한 것이 개인정보 노출 위험이 크다는 피드백을 받았습니다.<br> 이후 이메일은 일부 마스킹 처리, 이름은 해시함수를 적용하여 저장 방식 자체를 바꿨습니다.<br> 처음엔 단순 저장만 고려했는데, 데이터 설계 자체에 보안 개념이 들어가야 함을 느꼈습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 회원 가입 및 주문 시스템 설계 시, 민감 데이터는 AES256으로 암호화하고, DB에는 접근 로깅을 남기도록 설정했습니다.<br> 또한 운영자 화면에서는 실명·연락처 정보를 마스킹 처리해 조회하도록 구성했고, 특정 권한 그룹에서만 접근 가능하도록 RBAC 기반 권한 제어를 적용했습니다.<br> 이후 개인정보보호 점검에서도 무이슈 통과 경험이 있습니다.",
      days: 5,
    },
    {
      id: "q18",
      title: "퍼포먼스 모니터링",
      content:
        "프론트엔드 성능 병목을 진단하고 개선한 경험이 있다면, 어떤 도구를 사용했고 어떤 수치를 중심으로 개선했는지 설명해 주세요.",
      date: "2025-04-15",
      category: "Frontend",
      hint: "DevTools나 Lighthouse에서 어떤 수치를 보고 문제를 파악했는지, 그리고 개선 전후 어떤 변화가 있었는지를 명확히 설명해 보세요. 단순히 “느렸다 → 빨라졌다”보다는 병목 구간을 정확히 짚는 것이 중요합니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> React 기반 포트폴리오 사이트에서 초기 로딩 속도가 지나치게 느렸고, Lighthouse 분석 결과 이미지와 폰트 로딩이 병목 원인이었습니다.<br> 이미지에는 Lazy Loading을 적용하고, 웹폰트를 preload 처리하여 FCP를 2초에서 0.9초로 개선했습니다.<br> 이 과정에서 성능 지표를 수치로 보며 개선하는 재미를 처음 느꼈습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 내부 CRM 시스템에서 유저 전환 시 LCP 지연이 발생했으며, DevTools 성능 탭을 통해 Layout Shift와 JS 실행 시간이 문제임을 파악했습니다.<br> chunk 분리, 이미지 최적화, critical CSS 추출 등 다각적 개선을 통해 주요 지표가 30~40% 개선되었고, 사용자 불만도 확연히 줄었습니다.<br> 이후 New Relic과 연동하여 배포 후에도 실시간 성능 지표를 모니터링하고 있습니다.",
      days: 5,
    },
    {
      id: "q19",
      title: "API 설계와 버전 관리 전략",
      content:
        "API를 설계하거나 운영하면서, 일관성을 유지하고 변경을 관리하기 위해 어떤 전략을 사용했는지 설명해 주세요. (버전 관리, 응답 포맷 설계, 호환성 유지 방식 등을 중심으로)",
      date: "2025-04-15",
      category: "Backend",
      hint: "실무에서는 API가 한 번 공개되면 쉽게 바꿀 수 없습니다. 이 질문은 “처음부터 바뀔 수 있음을 고려하고 설계했는가”를 묻는 것입니다. URI 버전 관리, 응답 포맷 고정, Deprecation 정책 같은 구체적인 조치가 있다면 강력한 답변이 됩니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 처음엔 기능만 되면 된다고 생각했는데, 프론트엔드 파트너가 다른 화면에서 재사용할 수 없다고 불편을 느끼는 걸 보고 설계가 중요하다는 걸 느꼈습니다.<br> 그 후에는 URI와 응답 포맷을 명확히 정의하고, 응답에 항상 status, message, data 필드를 고정해서 주도록 구조를 정리했습니다.<br> 추후에 기능이 추가될 때도 혼란 없이 API를 재사용할 수 있었고, 의도하지 않은 깨짐도 줄어들었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> API 응답 포맷이 일관되지 않아 프론트와의 협업 효율이 떨어지는 문제가 반복됐습니다.<br> 이에 응답 구조를 JSON Schema 기반으로 명세화하고, Swagger 문서화와 함께 Lint를 통한 API 규칙 검사를 도입했습니다.<br> 또한 v1/v2로 URI 버전 관리 체계를 적용하고, Deprecation 시점과 호환 유지 기준을 문서로 정리해 신규 기능 도입 시 혼란을 최소화할 수 있었습니다.",
      days: 5,
    },
    {
      id: "q20",
      title: "스트레스 관리 및 동기 부여",
      content:
        "업무나 프로젝트에서 높은 스트레스를 받았던 상황에서, 본인은 어떻게 동기를 유지하고 팀 사기를 관리했는지 경험을 공유해 주세요.",
      date: "2025-04-15",
      category: "인성",
      hint: "이 질문은 지원자가 힘들었던 상황이 궁금한 게 아니라, 그 상황에서 어떤 태도나 루틴으로 회복했는지를 보고자 합니다. 개인 회고, 동료 격려, 팀 분위기 전환 등 구체적인 실천 방식이 있으면 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 졸업작품과 취업 준비가 겹쳐서 체력적으로도 정신적으로도 지치는 시기가 있었습니다.<br> 스스로 동기부여를 유지하기 위해 매일 일정 끝에 소감 기록을 남겼고, 팀원들에게도 짧은 회고 타임을 제안했습니다.<br> 이를 통해 서로 격려하고 장점을 발견하는 분위기가 생기면서, 마감도 무사히 넘길 수 있었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 1년간 긴 유지보수 업무가 이어지며 팀 전체 사기가 저하되던 시기가 있었습니다.<br> 작은 성공도 주간 회고에서 공유하고, '미니 챌린지'라는 이름으로 스스로 성장 주제를 정해 발표하는 시간을 만들었습니다.<br> 팀원들 사이에 다시 자율성과 성취감이 생기면서 분위기와 퍼포먼스가 함께 회복되었습니다.",
      days: 5,
    },
    {
      id: "q21",
      title: "코드 리뷰와 테스트 자동화",
      content:
        "코드 리뷰와 테스트 자동화를 도입하거나 개선하여 개발 흐름이나 품질에 기여한 경험이 있다면 구체적으로 공유해 주세요.",
      date: "2025-04-16",
      category: "공통",
      hint: "도입 계기, 팀원과의 협업 방식, 퀄리티 향상 등의 구체적 변화가 드러나야 좋은 답변이 됩니다. (예: PR 템플릿, 리뷰 기준 정립, 테스트 커버리지 도입, 린트 자동화 등)",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 팀 프로젝트에서 코드 스타일이 들쭉날쭉했고, 리뷰도 감으로 진행되던 상황이 있었습니다.<br> eslint와 prettier를 도입하고, PR 작성 시 체크리스트를 추가해 코드 리뷰의 기준을 명확히 했습니다.<br> 간단한 unit test도 작성하게 되면서 코드에 대한 신뢰도와 자신감이 함께 높아졌습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 기존 팀은 QA 인력이 없이 개발자가 전담 테스트하던 구조였고, 반복 테스트 부담이 컸습니다.<br> CI 파이프라인에 jest + testing-library 기반 테스트 자동화를 추가하고, GitHub Actions로 커버리지 리포트를 생성했습니다.<br> 결과적으로 기능 릴리스 주기가 2배 이상 빨라졌고, 신입 개발자도 테스트 기준을 빠르게 익힐 수 있었습니다.",
      days: 6,
    },
    {
      id: "q22",
      title: "컴포넌트 설계 원칙",
      content:
        "컴포넌트를 설계할 때 재사용성과 유지보수성을 높이기 위해 어떤 원칙을 적용했는지, 실제 사례와 함께 설명해 주세요.",
      date: "2025-04-16",
      category: "Frontend",
      hint: "재사용성은 단순히 나누었다가 아니라, 역할 분리와 데이터 흐름을 고민했는지에 달려 있습니다. Atomic Design, Container/Presentational 구조, props 최소화 등의 실천이 구체적으로 드러나면 좋습니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> React 프로젝트에서 UI 요소가 점점 중복되자, 공통 UI를 Atomic Design 기준으로 재설계한 경험이 있습니다.<br> Button, Modal, Card 같은 컴포넌트를 각각의 관심사에 따라 분리하고, props를 엄격히 관리해 재사용성을 높였습니다.<br> 이후 기능 추가 시 중복 없이 빠르게 적용할 수 있었고, 팀원들과의 협업 속도도 개선되었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>디자인 시스템을 도입하면서 공통 UI 컴포넌트를 Atomic Design 패턴에 따라 재구성했습니다.<br>또한 로직이 섞이지 않도록 Presentation-Container 구조로 나누고, props를 최소화하고 기본값을 명시하는 방식으로 유지보수성을 확보했습니다.<br>이후 팀 신규 기능 개발 속도가 약 30% 향상되었고, 테스트도 훨씬 수월해졌습니다.",
      days: 6,
    },
    {
      id: "q23",
      title: "장애 대응 및 복구 전략",
      content:
        "시스템 장애 발생 시 신속하게 대응하고 복구하기 위해 어떤 전략을 수립하고 적용했는지 구체적으로 설명해 주세요.",
      date: "2025-04-16",
      category: "Backend",
      hint: "장애 탐지, 알림 시스템, 롤백 전략, 재시도 메커니즘 등의 구체적인 대응 방식을 중심으로 설명해 주세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 개인 프로젝트에서 외부 API 호출 실패로 인해 서비스가 중단되는 문제를 경험했습니다. 이를 해결하기 위해 재시도 로직과 타임아웃 설정을 추가하고, 장애 발생 시 사용자에게 적절한 안내 메시지를 제공하는 방식으로 개선했습니다. 이러한 경험을 통해 장애 대응의 중요성을 체감할 수 있었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 결제 시스템에서 간헐적인 장애가 발생하여, 장애 탐지 및 대응 체계를 구축했습니다. Prometheus와 Grafana를 활용한 모니터링 시스템을 도입하고, 장애 발생 시 Slack을 통한 실시간 알림을 설정했습니다. 또한, 롤백 전략과 재시도 메커니즘을 구현하여 서비스의 안정성을 확보했습니다.",
      days: 6,
    },
    {
      id: "q24",
      title: "개발 외의 관심사",
      content:
        "개발을 제외하고, 요즘 본인이 가장 중요하게 생각하거나 고민하고 있는 주제가 있다면 무엇인지 공유해 주세요.",
      date: "2025-04-16",
      category: "인성",
      hint: "기술적인 이야기에서 잠시 벗어나, 지원자의 사고방식, 가치관, 현재의 관심사를 묻는 질문입니다. 꼭 멋진 답이 아니어도 좋습니다. 다만 ‘왜 그걸 중요하게 생각하는지’가 드러나는 게 핵심입니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 요즘은 “협업을 잘하려면 뭘 먼저 신경 써야 할까?”를 자주 고민하고 있어요.<br> 혼자 공부할 땐 기술이 전부라고 생각했는데, 프로젝트를 해보니 커뮤니케이션 실수 하나가 전체 일정에 영향을 주더라고요.<br> 그래서 말 습관이나 회의 정리 같은 것도 연습 중입니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 최근에는 “내가 일하는 방식이 얼마나 지속 가능한가?”를 많이 고민하고 있습니다.<br> 빠르게 일하는 것도 좋지만, 무리하거나 지치면 결국 퍼포먼스가 떨어지더라고요.<br> 그래서 회고 습관, 일정 관리 도구 활용 등 ‘꾸준한 일’을 만드는 연습을 하고 있습니다.",
      days: 6,
    },
  ]

  // 카테고리 수정 부분만 변경합니다.
  // q21, q22, q23의 카테고리를 올바르게 수정합니다.

  // q21 카테고리 수정 (공통)
  const q21 = hardcodedQuestions.find(q => q.id === "q21");
  if (q21) {
    q21.category = "공통";
  }

  // q22 카테고리 수정 (Frontend)
  const q22 = hardcodedQuestions.find(q => q.id === "q22");
  if (q22) {
    q22.category = "Frontend";
  }

  // q23 카테고리 수정 (Backend)
  const q23 = hardcodedQuestions.find(q => q.id === "q23");
  if (q23) {
    q23.category = "Backend";
  }

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
    const day5ReleaseTime = new Date(2025, 3, 15, 9, 0, 0) // 월은 0부터 시작하므로 4월은 3

    // 현재 시간이 2025년 4월 11일 오전 9시 이후인지 확인
    if (now >= day5ReleaseTime) {
      return 5 // Day 3 표시
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
    const day5ReleaseTime = new Date(2025, 3, 15, 9, 0, 0) // 2025년 4월 11일 오전 9시

    // 시간 기반 필터링된 질문 목록
    const timeFilteredQuestions = [...hardcodedQuestions].filter((q) => {
      // Day 3 질문은 오전 9시 이후에만 표시
      if (q.days === 5) {
        return now >= day5ReleaseTime
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

    // 현재 날짜 기준으로 최신 Day 계산 (현재는 Day 5)
    const currentMaxDay = 5

    // Day 1~4 문제는 항상 모범 답변을 볼 수 있음
    // Day 5(현재 최신 Day) 문제만 저녁 8시 이후에 볼 수 있음
    if (question.days < currentMaxDay) {
      // 이전 Day의 문제는 항상 모범 답변을 볼 수 있음
      setCanViewAnswer(true)
    } else if (question.days === currentMaxDay) {
      // 현재 Day의 문제는 저녁 8시 이후에만 볼 수 있음
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
    // 현재 최신 Day (Day 5)
    const currentMaxDay = 5

    // 현재 Day의 문제에 대해서만 타이머 설정
    if (selectedQuestion?.days === currentMaxDay) {
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
    const day5ReleaseTime = new Date(2025, 3, 15, 9, 0, 0) // 2025년 4월 11일 오전 9시

    // 시간 기반 필터링
    const timeFilteredQuestions = [...hardcodedQuestions].filter((q) => {
      // Day 3 질문은 오전 9시 이후에만 표시
      if (q.days === 5) {
        return now >= day5ReleaseTime
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
                      {selectedQuestion.days === 5 && !canViewAnswer ? (
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
                    {selectedQuestion.days === 5 && !canViewAnswer && (
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
