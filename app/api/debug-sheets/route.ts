import { google } from "googleapis"
import { NextResponse } from "next/server"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"

// GoogleSheetData 인터페이스 정의
interface GoogleSheetData {
  exists: boolean
  rowCount: number
  data: any[]
  error?: string
}

// AuthTestResult 인터페이스 정의
interface AuthTestResult {
  success: boolean
  message: string
  spreadsheetTitle?: string // spreadsheetTitle 속성 추가
}

export async function GET() {
  try {
    // Google Sheets API 인증 테스트
    let authTest: AuthTestResult = { success: false, message: "인증 테스트를 시작합니다." }
    let questionSheetData: GoogleSheetData = { exists: false, rowCount: 0, data: [] }

    try {
      // Google Sheets API 인증 설정
      const auth = await getGoogleAuth()
      const sheets = google.sheets({ version: "v4", auth })

      // 스프레드시트 정보 가져오기
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      })

      authTest = {
        success: true,
        message: "Google Sheets API 인증 성공",
        spreadsheetTitle: spreadsheet.data.properties?.title || "제목 없음",
      }

      // 질문 시트 데이터 가져오기
      questionSheetData = await getGoogleSheetData(sheets, SPREADSHEET_ID, "질문")
    } catch (error) {
      authTest = {
        success: false,
        message: error.message,
        spreadsheetTitle: undefined, // 명시적으로 undefined 설정
      }
    }

    return NextResponse.json({
      auth: authTest,
      questionSheet: questionSheetData,
    })
  } catch (error) {
    console.error("디버그 API 오류:", error)
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

// Google 인증 함수
async function getGoogleAuth() {
  const { JWT } = google.auth

  try {
    // 환경 변수에서 서비스 계정 정보 가져오기
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

    if (!serviceAccountEmail || !privateKey) {
      throw new Error("Google 서비스 계정 정보가 없습니다.")
    }

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

// 구글 시트 데이터 가져오기 함수
async function getGoogleSheetData(sheets, spreadsheetId, sheetName): Promise<GoogleSheetData> {
  try {
    // 시트 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    })

    const rows = response.data.values || []
    return {
      exists: true,
      rowCount: rows.length,
      data: rows,
    }
  } catch (error) {
    return { exists: false, rowCount: 0, data: [], error: error.message }
  }
}
