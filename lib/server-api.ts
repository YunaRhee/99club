"use server"

import { google } from "googleapis"

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
    // 하드코딩된 서비스 계정 정보 사용
    const serviceAccountEmail = "id-99club-1day1challenge@club-1day1interview.iam.gserviceaccount.com"
    const privateKey =
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyvZ21E4a254G3\nQJ5+38EQy1dDQky2d4qKqkjeUHmECzW94vchI1iXOO9eRqVJqaCCkCFJXhXKi8pc\n+mC/ujqrTseTz6QhzwEQNr+6NleMI9u62nQcc5NL2q1yFFDHxpaipVnURckt1ZL1\nUOsF+ntI+nT7EZaZsjKfeKTKePr+cDEwxu1mucnaMK5hKf7BCI9WrXe4qpQ+0Zb+\nVNSNjmhGVa7ogi9eXALuHTdEeP8YqLNZLMommUjcuE8OCcGwjuwWhtfxL1evNZwL\nPbH6omHGZrdPGcNdhyQBp7IZ2C0GWcMoqsvC2rtINwJJYYP7OjQyw6GvMaycB2VZ\nybcICfwXAgMBAAECggEAHYSQ8eF6ouQSmPfT9PHwyVw7WgEt+Ag/2eyLQiOaHcNY\nKba8xz02GSsu5KvYChU4S7ePt7UQ9jUlwzsaFS+lFrtY3EEzQt4Tt+DCwvbMeHlH\nhVEkUbqIfcNsV2WhfYx/Pfb+ob6wnaAit96YIZGfIIs0HG5oJ5O1Jn7fAA0ArloE\nCTnESe6QBedtW7sY1wSYRo5TvzDsVp0mTRT08SdUDwdja8vdcJjVjBAiRxl722HX\nSabX44yHQsyPNrS7g1NzP21acgQ8GVpkSW6ETSpSrE5/zFMYA07n71sbeVYpBIzn\n+FvTpRxQkIJpYflL0/GwU9g8C/3tp8hZYtgec+ZqoQKBgQDkF+jxdwIuPXWM//yy\noQF8ODRbVADymxPMDFPMHQhjsAKlFfsjRxkWdJpG1kdUYNUIRKMjmuEZzwImYO5s\nAvGyB9AaqeqF1npjhKGjIizDBTdAQwe5vnwEad/k6+8uAFMGIYW5yOoV2NLaKsri\nfJrzuLR9d34CxI/bOKa2VVsapwKBgQDIm+9VYHPXlgbEfT4gAkj9VKwZrznJMu1W\nhKYJvOTKsvU+BVoNkfHcQDsMdEFBZJkQKbRO8r5Wkg5isQjVJQRdilXn2Hvz8Nib\nVHgcejW2cLyB4nFyd4tXpSTDWkrdg3xCbSqa4h9AQBXLuG/wTUTdtiYilISgFGXX\nx1xCqqrxEQKBgQDNIFuTXA2P/CGNLmHZW0Z0qi8buw4nICPLq4Jo2+tBi3a1dHEo\nJrZ/JVnhPq9jSLoM930ndg/eH/a1ARMp+/PUwYX7lLeeqWXjvdGHXiKXOEeZ+S4n\ncxEg/v4lZ7Dv08bWiqsyi2dJQndNUJKo4JqReJiJBT9DyfX9lpMHAvgtnQKBgDLF\n3LZEGi2nSAE1HaMmUOjlJEW/5qU4oX8zRX7TcyimUJGo8xjaJlezXf6R8e4mEuNX\nWs5ce7YXc1KhMfYYT1mJaKKsVPrxqzDtGRVEDRImyF8rO8FX5kmBf6N919Lms21w\nicb3kidF0P5lqNcuB08CCfbYlhSZ9Qi+6WfqICexAoGBANFMQ9A51rOivA2SOOoR\nA8k6s5hz1wuIzBe3iULzMtBZ16re72XM1jixMMKLAZIUDIRj1Xj8ty8prTMA6M\n0ggbkAQckPcQppLUU//23RH+5wWyDZCv6oJTiQWQ3UcUmB9euHJ7LdBIihiW2mhf\n8ytvee76gEbNjpTcTStKHDoc\n-----END PRIVATE KEY-----\n"

    console.log("Google 인증 시도 중...")

    // 서비스 계정 키 정보
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // 인증 테스트
    await serviceAccountAuth.authorize()
    console.log("Google 인증 성공!")
    return serviceAccountAuth
  } catch (error) {
    console.error("Google 인증 오류:", error)
    if (error.message) {
      console.error("오류 메시지:", error.message)
    }
    if (error.stack) {
      console.error("오류 스택:", error.stack)
    }
    throw new Error(`Google 인증 실패: ${error.message}`)
  }
}

// Update the fetchQuestionsFromSheet function to include the days field
export async function fetchQuestionsFromSheet(): Promise<Question[]> {
  try {
    const SPREADSHEET_ID = "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"
    const SHEET_NAME = "Question"

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

    // 데이터가 없는 경우 샘플 데이터 반환
    if (rows.length <= 1) {
      console.error("구글 시트에 데이터가 없습니다. 샘플 데이터를 사용합니다.")
      return sampleQuestions
    }

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

    console.log(`구글 시트에서 ${questions.length}개의 질문을 가져왔습니다.`)
    return questions
  } catch (error) {
    console.error("구글 시트에서 질문 가져오기 오류:", error)
    // 오류 발생 시 샘플 데이터 반환
    return sampleQuestions
  }
}

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

// 샘플 질문 데이터 (구글 시트 연결 실패 시 폴백용)
const sampleQuestions: Question[] = [
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
      "<b>[첫 취업 준비생이라면?]</b><br>\n팀 프로젝트 중 백엔드 API 명세를 문서화하는 방식을 두고 의견 차이가 있었습니다. 어떤 팀원은 Notion, 저 Swagger UI를 주장했죠. 갈등을 줄이기 위해 각 방식의 장단점을 정리해 공유하고, 실제 구현 테스트도 함께 해보자는 제안을 했습니다. 결과적으로 Swagger가 자동화와 유지보수 측면에서 낫다는 데 모두 동의했고, 팀워크도 자연스럽게 회복되었습니다.\n<br><br>\n<b>[현직 개발자로, 이직 면접이라면?]</b><br>\n코드 리뷰 과정에서 주니어 개발자와 네이밍 규칙을 두고 의견이 충돌한 적이 있습니다. 단순히 지적하기보다, 그 규칙이 왜 필요한지 설명하고 예시를 제시했습니다. 이후에는 리뷰 문화에 대한 가이드를 팀 내에 문서화했고, 리뷰 가이드 세션도 주도했습니다. 개인적인 의견 차이에서 시작된 갈등을 협업 문화 개선의 기회로 바꾼 경험이었습니다.",
    days: 1,
  },
]

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
