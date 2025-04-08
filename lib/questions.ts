// 클라이언트에서 사용할 타입 정의
export interface Question {
  id: string
  title: string
  content: string
  date: string
  category: string
  hint?: string
  modelAnswer?: string
  days?: number // Add days field
}

// 샘플 질문 데이터 (API 호출 실패 시 폴백용)
export const sampleQuestions: Question[] = [
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
]

// 클라이언트에서 API를 통해 질문 데이터 가져오기
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const response = await fetch("/api/questions")
    if (!response.ok) {
      throw new Error("Failed to fetch questions")
    }
    const data = await response.json()

    if (data.success && data.data) {
      return data.data
    }
    return sampleQuestions
  } catch (error) {
    console.error("질문 가져오기 오류:", error)
    return sampleQuestions
  }
}

// 특정 ID의 질문 가져오기
export async function getQuestionById(id: string): Promise<Question | undefined> {
  try {
    const response = await fetch(`/api/questions/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch question")
    }
    const data = await response.json()

    if (data.success && data.data) {
      return data.data
    }
    return sampleQuestions.find((q) => q.id === id)
  } catch (error) {
    console.error("질문 ID로 가져오기 오류:", error)
    return sampleQuestions.find((q) => q.id === id)
  }
}

// 오늘의 질문 가져오기
export async function getTodayQuestion(dayCount = 1): Promise<Question> {
  try {
    const response = await fetch(`/api/questions/today?day=${dayCount}`)
    if (!response.ok) {
      throw new Error("Failed to fetch today question")
    }
    const data = await response.json()

    if (data.success && data.data) {
      return data.data
    }

    // 해당 dayCount의 질문이 없으면 샘플 데이터에서 반환
    const index = (dayCount - 1) % sampleQuestions.length
    return sampleQuestions[index]
  } catch (error) {
    console.error("오늘의 질문 가져오기 오류:", error)
    const index = (dayCount - 1) % sampleQuestions.length
    return sampleQuestions[index]
  }
}

// 카테고리별 질문 가져오기
export async function getQuestionsByCategory(category: string, dayIndex = 0): Promise<Question[]> {
  try {
    const response = await fetch(`/api/questions/category?category=${category}&dayIndex=${dayIndex}`)
    if (!response.ok) {
      throw new Error("Failed to fetch questions by category")
    }
    const data = await response.json()

    if (data.success && data.data) {
      return data.data
    }

    // API 호출 실패 시 샘플 데이터에서 반환
    const filteredQuestions = sampleQuestions.filter((q) => q.category === category)
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
