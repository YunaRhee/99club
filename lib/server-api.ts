"use server"

import { google } from "googleapis"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

// Update the Question interface to include the days field
export interface Question {
  id: string
  title: string
  content: string
  date: string
  category: string
  hint?: string
  modelAnswer?: string
  days?: number // Add days field from Google Sheet
}

// 구글 시트에서 질문 데이터 가져오기
async function getGoogleAuth() {
  const { JWT } = google.auth

  try {
    // 환경 변수에서 서비스 계정 정보 사용
    const serviceAccountEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = GOOGLE_PRIVATE_KEY

    // 서비스 계정 키 정보
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // 인증 테스트
    await serviceAccountAuth.authorize()
    return serviceAccountAuth
  } catch (error) {
    console.error("Google 인증 오류:", error)
    throw new Error(`Google 인증 실패: ${error.message}`)
  }
}

// Update the fetchQuestionsFromSheet function to include the days field
export async function fetchQuestionsFromSheet(): Promise<Question[]> {
  try {
    const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
    const SHEET_NAME = SHEET_NAMES.QUESTION

    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 스프레드시트에서 질문 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`, // Extended range to include days column
    })

    const rows = response.data.values || []

    // 첫 번째 행은 헤더로 간주하고 제외
    const headers = rows[0] || ["id", "title", "content", "date", "category", "hint", "modelAnswer", "days"]

    // 데이터 행 처리
    const questions = rows.slice(1).map((row) => {
      return {
        id: row[0] || "",
        title: row[1] || "",
        content: row[2] || "",
        date: row[3] || new Date().toISOString().split("T")[0],
        category: row[4] || "Frontend",
        hint: row[5] || "",
        modelAnswer: row[6] || "",
        days: row[7] ? Number.parseInt(row[7], 10) : undefined, // Parse days as number
      }
    })

    return questions
  } catch (error) {
    console.error("구글 시트에서 질문 가져오기 오류:", error)
    // 오류 발생 시 샘플 데이터 반환
    return sampleQuestions
  }
}

// 샘플 질문 데이터 (구글 시트 연결 실패 시 폴백용)
const sampleQuestions: Question[] = [
  {
    id: "q1",
    title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
    content: "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
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
  // 나머지 샘플 데이터 업데이트
  {
    id: "q3",
    title: "데이터베이스 인덱싱(Indexing)의 작동 원리와 장단점은?",
    content: "데이터베이스에서 인덱싱이 어떻게 작동하는지 설명하고, 인덱스 사용의 장점과 단점에 대해 논의해주세요.",
    date: "2024-04-10",
    category: "Backend",
    hint: "트리 구조와 검색 알고리즘을 생각해보세요.",
    modelAnswer:
      "데이터베이스 인덱싱은 테이블의 특정 열에 대한 검색 속도를 향상시키기 위해 별도의 데이터 구조(주로 B-트리 또는 B+트리)를 생성하는 것입니다. 장점으로는 검색 속도 향상, 정렬 및 그룹화 연산 최적화가 있고, 단점으로는 추가 저장 공간 필요, 삽입/수정/삭제 작업 시 오버헤드, 인덱스 관리 비용이 있습니다.",
    days: 3,
  },
  {
    id: "q4",
    title: "React의 가상 DOM(Virtual DOM)이란 무엇인가요?",
    content: "React의 가상 DOM 개념에 대해 설명하고, 이것이 어떻게 성능 최적화에 도움이 되는지 설명해주세요.",
    date: "2024-04-11",
    category: "Frontend",
    hint: "실제 DOM 조작의 비용과 비교해보세요.",
    modelAnswer:
      "가상 DOM은 실제 DOM의 가벼운 복사본으로, 메모리에 존재하는 JavaScript 객체입니다. React는 상태 변경 시 먼저 가상 DOM을 업데이트하고, 이전 가상 DOM과 비교(Diffing)하여 실제로 변경된 부분만 실제 DOM에 적용합니다. 이를 통해 불필요한 DOM 조작을 줄이고 렌더링 성능을 최적화합니다.",
    days: 4,
  },
  {
    id: "q5",
    title: "객체 지향 프로그래밍의 SOLID 원칙이란?",
    content:
      "객체 지향 프로그래밍의 SOLID 원칙 각각에 대해 설명하고, 실제 코드에서 어떻게 적용할 수 있는지 예시를 들어주세요.",
    date: "2024-04-12",
    category: "공통",
    hint: "Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion의 약자입니다.",
    modelAnswer:
      "SOLID 원칙은 1) 단일 책임 원칙(SRP): 클래스는 하나의 책임만 가져야 함, 2) 개방-폐쇄 원칙(OCP): 확장에는 열려있고 수정에는 닫혀있어야 함, 3) 리스코프 치환 원칙(LSP): 하위 타입은 상위 타입을 대체할 수 있어야 함, 4) 인터페이스 분리 원칙(ISP): 클라이언트는 사용하지 않는 인터페이스에 의존하지 않아야 함, 5) 의존성 역전 원칙(DIP): 추상화에 의존해야 하며 구체화에 의존하지 않아야 함을 의미합니다.",
    days: 5,
  },
]

// 오늘의 질문 가져오기
export async function getTodayQuestion(dayCount = 1): Promise<Question> {
  try {
    const questions = await fetchQuestionsFromSheet()

    // dayCount에 해당하는 질문 찾기
    const question = questions.find((q) => q.days === dayCount)

    if (question) {
      return question
    }

    // 해당 dayCount의 질문이 없으면 인덱스로 접근
    const index = (dayCount - 1) % questions.length
    return questions[index]
  } catch (error) {
    console.error("오늘의 질문 가져오기 오류:", error)
    // 오류 발생 시 샘플 데이터에서 반환
    const index = (dayCount - 1) % sampleQuestions.length
    return sampleQuestions[index]
  }
}

// 모든 질문 가져오기
export async function getAllQuestions(): Promise<Question[]> {
  try {
    return await fetchQuestionsFromSheet()
  } catch (error) {
    console.error("모든 질문 가져오기 오류:", error)
    return sampleQuestions
  }
}

// 특정 ID의 질문 가져오기
export async function getQuestionById(id: string): Promise<Question | undefined> {
  try {
    const questions = await fetchQuestionsFromSheet()
    return questions.find((q) => q.id === id)
  } catch (error) {
    console.error("질문 ID로 가져오기 오류:", error)
    return sampleQuestions.find((q) => q.id === id)
  }
}

// 카테고리별 질문 가져오기
export async function getQuestionsByCategory(category: string, dayIndex = 0): Promise<Question[]> {
  try {
    const questions = await fetchQuestionsFromSheet()
    const filteredQuestions = questions.filter((q) => q.category === category)

    // 날짜 인덱스에 맞는 질문 하나만 반환
    if (filteredQuestions.length === 0) {
      return []
    }

    const index = dayIndex % filteredQuestions.length
    return [filteredQuestions[index]]
  } catch (error) {
    console.error("카테고리별 질문 가져오기 오류:", error)
    const filteredQuestions = sampleQuestions.filter((q) => q.category === category)

    if (filteredQuestions.length === 0) {
      return []
    }

    const index = dayIndex % filteredQuestions.length
    return [filteredQuestions[index]]
  }
}
