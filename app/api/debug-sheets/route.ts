import { NextResponse } from "next/server"
import { google } from "googleapis"

// 구글 시트 데이터 타입 정의 추가
interface GoogleSheetData {
  exists: boolean
  rowCount: number
  data: any[]
  error?: string // error 속성 추가
}

// 구글 시트 데이터 가져오기 함수
async function getGoogleSheetData(): Promise<GoogleSheetData> {
  const { JWT } = google.auth
  let questionSheetData: GoogleSheetData = { exists: false, rowCount: 0, data: [] }

  try {
    // 서비스 계정 정보
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
      throw new Error("Google API 환경 변수가 설정되지 않았습니다.")
    }

    // 서비스 계정 인증
    const auth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    // 구글 시트 API 초기화
    const sheets = google.sheets({ version: "v4", auth })

    // 시트 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Question!A:G", // 시트 이름과 범위
    })

    const rows = response.data.values || []
    questionSheetData = {
      exists: true,
      rowCount: rows.length,
      data: rows,
    }

    return questionSheetData
  } catch (error) {
    // 이제 error 속성이 타입에 정의되어 있으므로 문제가 해결됩니다
    questionSheetData = { exists: false, rowCount: 0, data: [], error: error.message }
    return questionSheetData
  }
}

// API 라우트 핸들러
export async function GET() {
  try {
    const data = await getGoogleSheetData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "구글 시트 데이터를 가져오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}
