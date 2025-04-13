"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/questions"
import QuestionCard from "@/components/question-card"
import AnswerForm from "@/components/answer-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ModelAnswer from "@/components/model-answer"
import PageLayout from "@/components/page-layout"
import { Clock } from "lucide-react"
import { getTimeRemainingForSubmission } from "@/lib/utils"

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
    q11: {
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
    q12: {
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
    q13: {
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
    q14: {
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
    q15: {
      id: "q15",
      title: "데이터베이스 최적화 기법",
      content:
        "DB 인덱스, 샤딩, 복제 등의 기법을 활용해 성능을 개선한 경험이 있다면, 문제 상황과 적용 방식, 결과를 함께 설명해 주세요.",
      date: "2025-04-14",
      category: "Backend",
      hint: "쿼리 성능 문제를 어떤 방식으로 진단했고, 그에 따라 어떤 인덱스를 어떻게 설계했는지가 중요합니다. 단순히 “인덱스를 추가했다”보다는, 실행 계획(EXPLAIN) 분석이나 파티셔닝·샤딩을 통한 구조적 접근이 담기면 훨씬 설득력 있는 답변이 됩니다.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br> 사이드 프로젝트에서 특정 게시글 리스트 API가 매우 느려지는 현상이 있었고, 쿼리를 분석해보니 날짜 필드 정렬 시 인덱스가 적용되지 않는 문제가 있었습니다.<br> 이를 해결하기 위해 복합 인덱스를 생성했고, DB 조회 속도가 3초 → 0.3초로 개선되었습니다.<br> 처음엔 단순히 LIMIT 문제로 생각했지만, 실제 실행 계획(EXPLAIN) 확인의 중요성을 알게 되었습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 거래 데이터가 수억 건 누적된 테이블에서 정산 리포트 API의 성능 문제가 발생했습니다.<br> 비정규화 테이블을 분리하고 파티셔닝 전략과 인덱스 튜닝, 읽기 전용 슬레이브를 통한 부하 분산을 적용해 평균 응답 속도를 5초 → 0.7초로 줄였습니다.<br> 이외에도 slow query 로그 기반으로 인덱스 통계를 정리해 매월 리팩토링 주기를 운영했습니다.",
      days: 4,
    },
    q16: {
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
  }

  // 현재 날짜 기준으로 Day 계산 - Day 4는 2025년 4월 14일 오전 9시 이후에 공개
  const calculateDayCount = () => {
    const now = new Date()

    // 2025년 4월 11일 오전 9시 (Day 3 공개 시간)
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 월은 0부터 시작하므로 4월은 3
    // 2025년 4월 14일 오전 9시 (Day 4 공개 시간)
    const day4ReleaseTime = new Date(2025, 3, 14, 9, 0, 0)

    if (now >= day4ReleaseTime) {
      return 4 // Day 4 공개됨
    } else if (now >= day3ReleaseTime) {
      return 3 // Day 3 공개됨
    }

    return 2 // 그 전에는 Day 2
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
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0)
    const day4ReleaseTime = new Date(2025, 3, 14, 9, 0, 0) // 2025년 4월 14일 오전 9시

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

  // 타이머 계산 함수 수정
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const currentQuestion = questions[activeTab]

      if (!currentQuestion) return ""

      // 현재 질문의 Day 번호 가져오기
      const questionDay = currentQuestion.days || 1

      // 새로운 유틸리티 함수 사용
      return getTimeRemainingForSubmission(questionDay)
    }

    calculateTimeRemaining()
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining()
      setTimeRemaining(remaining)
    }, 1000)

    return () => clearInterval(timer)
  }, [activeTab, questions])

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
      {questions[activeTab] && (
        <ModelAnswer
          modelAnswer={questions[activeTab].modelAnswer || ""}
          questionDay={questions[activeTab].days || 1}
        />
      )}
    </PageLayout>
  )
}
