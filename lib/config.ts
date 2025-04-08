// 중요: 실제 값은 환경 변수에서 가져오거나 사용자가 직접 입력해야 합니다
// 여기에는 변수만 선언하고 실제 값은 비워두세요

// Google API 인증 정보
export const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ""
export const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n")

// Google 스프레드시트 ID
export const GOOGLE_SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || ""

// 스프레드시트 시트 이름
export const SHEET_NAMES = {
  QUESTION: "Question",
  ANSWER: "답변",
  USER: "User",
}

// 관리자 비밀번호
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234"
