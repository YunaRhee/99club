"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PageLayout from "@/components/page-layout"
import { formatDateShort } from "@/lib/utils"
import { getAnswersByQuestionId } from "@/lib/answers"
import AnswerList from "@/components/answer-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function QuestionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publicAnswers, setPublicAnswers] = useState<any[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all") // 카테고리 필터링을 위한 상태 추가
  const [showModelAnswer, setShowModelAnswer] = useState(false) // 모범 답변 표시 상태

  // 하드코딩된 질문들 사용
  const questions = [
    {
      id: "q1",
      title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
      content:
        "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
      date: "2024-04-08",
      category: "Frontend",
      hint: "함수와 그 함수가 선언된 렉시컬 환경과의 조합을 생각해보세요.",
      modelAnswer:
        "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부함수가 외부함수의 변수에 접근할 수 있는 것을 말합니다. 이를 통해 데이터 은닉, 캡슐화, 팩토리 함수 등을 구현할 수 있습니다. 예를 들어, 카운터 함수를 만들 때 클로저를 활용하면 내부 상태를 외부에서 직접 접근하지 못하게 보호할 수 있습니다.",
      days: 1,
    },
    {
      id: "q2",
      title: "RESTful API의 설계 원칙은 무엇인가요?",
      content: "RESTful API를 설계할 때 고려해야 할 주요 원칙들에 대해 설명하고, 좋은 RESTful API의 예시를 들어주세요.",
      date: "2024-04-09",
      category: "Backend",
      hint: "자원(Resource), 행위(Verb), 표현(Representation)의 개념을 고려해보세요.",
      modelAnswer:
        "RESTful API 설계의 주요 원칙은 1) 자원 기반 구조(URI로 자원 표현), 2) HTTP 메서드를 통한 행위 표현(GET, POST, PUT, DELETE), 3) 무상태성(Stateless), 4) 캐시 가능성, 5) 계층화된 시스템, 6) 통일된 인터페이스입니다. 좋은 예시로는 GitHub API가 있으며, 자원을 명확히 표현하고 적절한 HTTP 메서드를 사용합니다.",
      days: 2,
    },
    {
      id: "q3",
      title: "동시성 문제 해결",
      content:
        "동시성 문제란 무엇이며, 이를 해결하기 위한 기본적인 전략을 설명해주세요. 실제 운영 환경에 적용한 사례가 있다면 함께 설명해 주어도 좋습니다.",
      date: "2024-04-09",
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
      date: "2024-04-09",
      category: "인성",
      hint: '"갈등"은 코드 스타일, 일정 조율, 기술 선택 등 작은 것도 포함됩니다. 감정적 판단보다 협업과 결과 중심의 해결 노력을 강조해 보세요.',
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트 중 백엔드 API 명세를 문서화하는 방식을 두고 의견 차이가 있었습니다. 어떤 팀원은 Notion, 저 Swagger UI를 주장했죠. 갈등을 줄이기 위해 각 방식의 장단점을 정리해 공유하고, 실제 구현 테스트도 함께 해보자는 제안을 했습니다. 결과적으로 Swagger가 자동화와 유지보수 측면에서 낫다는 데 모두 동의했고, 팀워크도 자연스럽게 회복되었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n코드 리뷰 과정에서 주니어 개발자와 네이밍 규칙을 두고 의견이 충돌한 적이 있습니다. 단순히 지적하기보다, 그 규칙이 왜 필요한지 설명하고 예시를 제시했습니다. 이후에는 리뷰 문화에 대한 가이드를 팀 내에 문서화했고, 리뷰 가이드 세션도 주도했습니다. 개인적인 의견 차이에서 시작된 갈등을 협업 문화 개선의 기회로 바꾼 경험이었습니다.",
      days: 1,
    },
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
      id: "q7",
      title: "마이크로서비스 데이터 일관성",
      content:
        "마이크로서비스 혹은 분산 시스템에서 데이터 일관성을 유지하기 위한 전략을 고민하거나 적용한 경험이 있다면 공유해주세요. 규모가 작아도 서비스 간 데이터 처리 흐름을 설계해본 경험이면 충분합니다.",
      date: "2025-04-10",
      category: "Backend",
      hint: "단일 DB 트랜잭션이 아닌, 서비스 간 데이터 일관성을 유지하는 방식을 고민해본 경험을 떠올려 보세요. (예: Eventual Consistency, 이벤트 기반 처리, SAGA 패턴 등)",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>\n토이 프로젝트에서 사용자 서비스와 결제 서비스를 나누어 구현했는데, 결제 완료 후 사용자 상태를 업데이트하는 로직이 REST API 방식의 동기 호출되다 보니 결제 실패 시 사용자 상태가 잘못 변경되는 문제가 있었습니다.\n이를 해결하기 위해 RabbitMQ를 도입해 결제 완료 시 이벤트 메시지를 발행하고, 사용자 서비스가 이를 구독해 상태를 변경하도록 했습니다.\n비록 작은 프로젝트였지만, 서비스 간의 의존도를 줄이고 일관된 흐름을 유지하기 위해 비동기 메시징이 필요하다는 것을 체감할 수 있었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n커머스 시스템에서 주문, 결제, 배송 서비스를 마이크로서비스로 분리한 이후, 주문 생성 후 결제 실패 시 데이터 정합성 이슈가 발생했습니다.\n이를 해결하기 위해 SAGA 패턴을 기반으로 한 이벤트 드리븐 구조를 도입했고, Kafka를 이벤트 브로커로 사용해 서비스 간 데이터를 전달했습니다.\n실패 시 보상 트랜잭션을 통해 이전 상태로 복구하는 로직을 각 서비스에 구현했으며, idempotent key 처리, DLQ 설계 등도 함께 적용해 정성을 높였습니다.\n결과적으로 연관 서비스 간 장애 전파율이 줄고 유지보수 비용도 감소했습니다.",
      days: 2,
    },
    {
      id: "q8",
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
        "<b>[첫 취업 준비생이라면?]</b><br>팀 프로젝트에서 일정이 촉박해 공통 컴포넌트를 빠르게 하드코딩 방식으로 처리  주간 점검 등)을 중심으로 답변해 보세요.",
      modelAnswer:
        "<b>[첫 취업 준비생이라면?]</b><br>팀 프로젝트에서 일정이 촉박해 공통 컴포넌트를 빠르게 하드코딩 방식으로 처리한 적이 있습니다.<br>나중에는 같은 컴포넌트에 반복적으로 수정이 들어가면서 유지보수가 어려워졌고, 이걸 계기로 리팩토링 전용 스프린트를 따로 만들었습니다.<br>기능과 속도만 보던 초반과 달리, 이후엔 기술 부채도 하나의 '관리 대상'으로 인식하게 되었고, 지금은 설계 단계에서부터 중복과 확장 가능성을 의식하려 노력하고 있습니다.<br><br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br>사내 로젝트에서 테스트 커버리지 부족, 중복 로직, 복잡한 조건문이 점점 쌓이면서 개발 속도도 떨어지고 버그 빈도가 높아졌습니다.<br>이를 해결하기 위해 기술 부채 점검 기준을 팀 차원에서 정리하고, 매 스프린트마다 일정 비율로 리팩토링 태스크를 포함했습니다.",
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
      hint: 'DevTools나 Lighthouse에서 어떤 수치를 보고 문제를 파악했는지, 그리고 개선 전후 어떤 변화가 있었는지를 명확히 설명해 보세요. 단순히 "느렸다 → 빨라졌다"보다는 병목 구간을 정확히 짚는 것이 중요합니다.',
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
      hint: '실무에서는 API가 한 번 공개되면 쉽게 바꿀 수 없습니다. 이 질문은 "처음부터 바뀔 수 있음을 고려하고 설계했는가"를 묻는 것입니다. URI 버전 관리, 응답 포맷 고정, Deprecation 정책 같은 구체적인 조치가 있다면 강력한 답변이 됩니다.',
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
        "<b>[첫 취업 준비생이라면?]</b><br> 팀 프로젝트에서 코드 스타일이 들쭉날쭉했고, 리뷰도 감으로 진행되던 상황이 있었습니다.<br> eslint와 prettier를 도입하고, PR 작성 시 체크리스트를 추가해 코드 리뷰의 기준을 명확히 했습니다.<br> 간단한 unit test도 작성하게 되면서 코드에 대한 신뢰도와 자신감이 함께 높아졌습니다.<br><br><b>[현직 개발자로, 이직 면접이라면?]</b><br> 기존 팀은 QA 인력이 없이 개발자가 전담 테스트하던 구조였고, 반복 테스트 부담이 컸습니다.<br> CI 파이프라인에 jest + testing-library 기반 테스트 자동화를 추가하고, GitHub Actions로 커버리지 리포트를 자동으로 생성하도록 설정했습니다.<br> 그 결과, 배포 전 버그 발견율이 20% 이상 높아졌고, 테스트 시간도 단축되어 개발 생산성이 향상되었습니다.",
      days: 6,
    },
  ]

  // 카테고리별 필터링된 질문 목록
  const filteredQuestions =
    selectedCategory === "all" ? questions : questions.filter((q) => q.category === selectedCategory)

  // 질문 클릭 핸들러
  const handleQuestionClick = async (question: any) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
    setShowModelAnswer(false) // 모달 열 때마다 모범 답변 상태 초기화

    // 공개된 답변 가져오기
    setIsLoadingAnswers(true)
    try {
      const answers = await getAnswersByQuestionId(question.id, true)
      setPublicAnswers(answers)
    } catch (error) {
      console.error("답변 가져오기 오류:", error)
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  // 모범 답변 표시 가능 여부 확인
  const canShowModelAnswer = (questionDay: number) => {
    // Day 6 질문은 오늘 저녁 8시 이후에만 공개
    if (questionDay === 6) {
      const now = new Date()
      const today8PM = new Date()
      today8PM.setHours(20, 0, 0, 0) // 오늘 저녁 8시

      return now >= today8PM
    }

    // Day 1~5 질문은 항상 모범 답변 표시 가능
    return questionDay >= 1 && questionDay <= 5
  }

  // HTML 문자열을 안전하게 렌더링하는 함수
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString || "" }
  }

  return (
    <PageLayout
      title="지난 면접 질문"
      subtitle={
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-hanghae-gray text-hanghae-text border-hanghae-light hover:cursor-pointer">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent className="bg-hanghae-gray text-hanghae-text border-hanghae-light">
            <SelectItem value="all" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              전체
            </SelectItem>
            <SelectItem value="공통" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              공통
            </SelectItem>
            <SelectItem value="Backend" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              Backend
            </SelectItem>
            <SelectItem value="Frontend" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              Frontend
            </SelectItem>
            <SelectItem value="인성" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              인성
            </SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card
            key={question.id}
            className="bg-hanghae-gray border-[#3a3e41] border-[1px] cursor-pointer hover:border-main-red transition-colors"
            onClick={() => handleQuestionClick(question)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{question.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text">
                  Day {question.days || 1}
                </Badge>
                <Badge
                  className={
                    question.category === "Frontend"
                      ? "bg-[#4A6EB0] hover:bg-[#4A6EB0]/90 text-white"
                      : question.category === "Backend"
                        ? "bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
                        : question.category === "공통"
                          ? "bg-[#9370DB] hover:bg-[#9370DB]/90 text-white"
                          : "bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
                  }
                >
                  {question.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(question.date)}</p>
              <p className="text-hanghae-text line-clamp-2">{question.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 질문 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" style={{ wordBreak: "break-all" }}>
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedQuestion.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-hanghae-light text-hanghae-text">Day {selectedQuestion.days || 1}</Badge>
                  <Badge
                    className={
                      selectedQuestion.category === "Frontend"
                        ? "bg-[#4A6EB0] text-white"
                        : selectedQuestion.category === "Backend"
                          ? "bg-[#6B8E23] text-white"
                          : selectedQuestion.category === "공통"
                            ? "bg-[#9370DB] text-white"
                            : "bg-[#FF8C00] text-white"
                    }
                  >
                    {selectedQuestion.category}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="mt-4">
                <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(selectedQuestion.date)}</p>
                <p className="text-hanghae-text whitespace-pre-wrap break-all">{selectedQuestion.content}</p>

                {selectedQuestion.hint && (
                  <div className="mt-4 p-4 bg-hanghae-light rounded-md">
                    <h3 className="text-sm font-medium mb-1">힌트</h3>
                    <p className="text-sm text-hanghae-text/70 whitespace-pre-wrap break-all">
                      {selectedQuestion.hint}
                    </p>
                  </div>
                )}
              </div>

              {/* 모범 답변 토글 */}
              {selectedQuestion.modelAnswer && (
                <div className="mt-6">
                  <div
                    className={`bg-[#3a3e41] rounded-[16px] p-4 flex justify-between items-center cursor-pointer h-[70px] ${
                      !canShowModelAnswer(selectedQuestion.days) ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (canShowModelAnswer(selectedQuestion.days)) {
                        setShowModelAnswer(!showModelAnswer)
                      }
                    }}
                  >
                    <div className="text-hanghae-text">
                      {canShowModelAnswer(selectedQuestion.days)
                        ? "모범 답변이 공개되었어요."
                        : "모범 답변이 저녁 8시에 공개돼요."}
                    </div>
                    <div className="text-hanghae-text/70 flex items-center">
                      {canShowModelAnswer(selectedQuestion.days) ? (
                        <>
                          확인하기{" "}
                          {showModelAnswer ? (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronRight className="h-4 w-4 ml-1" />
                          )}
                        </>
                      ) : (
                        getRemainingTimeText()
                      )}
                    </div>
                  </div>

                  {/* 모범 답변 내용 */}
                  {showModelAnswer && canShowModelAnswer(selectedQuestion.days) && (
                    <Card className="mt-4 bg-hanghae-gray border-[#3a3e41] border-[1px]">
                      <CardContent className="pt-4">
                        <div className="prose dark:prose-invert max-w-none text-hanghae-text">
                          <div dangerouslySetInnerHTML={renderHTML(selectedQuestion.modelAnswer)} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">공개된 답변</h2>
                {isLoadingAnswers ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-pulse text-hanghae-text">답변을 불러오는 중...</div>
                  </div>
                ) : (
                  <AnswerList answers={publicAnswers} />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}

// 모범 답변 공개까지 남은 시간 계산
function getRemainingTimeText(): string {
  const now = new Date()
  const today8PM = new Date()
  today8PM.setHours(20, 0, 0, 0) // 오늘 저녁 8시

  if (now >= today8PM) {
    return "곧 공개됩니다"
  }

  const diffMs = today8PM.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${diffHours}시간 ${diffMinutes}분 후 공개`
}
