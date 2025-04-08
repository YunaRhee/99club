import { google } from "googleapis"
import { NextResponse } from "next/server"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.ANSWER

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get("questionId")
    const publicOnly = searchParams.get("publicOnly") === "true"
    const nickname = searchParams.get("nickname")

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 스프레드시트에서 답변 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
    })

    const rows = response.data.values || []

    // 첫 번째 행은 헤더로 간주하고 제외
    const headers = rows[0] || ["id", "timestamp", "questionId", "nickname", "phone", "content", "isPublic"]
    let answers = rows.slice(1).map((row) => {
      return {
        id: row[0] || "",
        timestamp: row[1] || "",
        questionId: row[2] || "",
        nickname: row[3] || "",
        phone: row[4] || "",
        content: row[5] || "",
        isPublic: row[6]?.toLowerCase() === "true", // Ensure boolean conversion
      }
    })

    // 필터링 적용
    if (questionId) {
      answers = answers.filter((answer) => answer.questionId === questionId)
    }

    if (publicOnly) {
      answers = answers.filter((answer) => answer.isPublic === true) // Strict comparison
    }

    if (nickname) {
      answers = answers.filter((answer) => answer.nickname === nickname)
    }

    // Sort answers by timestamp, most recent first
    answers.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return NextResponse.json({ success: true, data: answers })
  } catch (error) {
    console.error("답변 가져오기 오류:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// Google 인증 함수 수정
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
