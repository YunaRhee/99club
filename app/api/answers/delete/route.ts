import { google } from "googleapis"
import { NextResponse } from "next/server"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.ANSWER

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answerId } = body

    // 필수 필드 검증
    if (!answerId) {
      return NextResponse.json(
        {
          success: false,
          message: "답변 ID가 필요합니다.",
        },
        { status: 400 },
      )
    }

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 스프레드시트에서 모든 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
    })

    const rows = response.data.values || []
    if (rows.length <= 1) {
      return NextResponse.json(
        {
          success: false,
          message: "답변 데이터가 없습니다.",
        },
        { status: 404 },
      )
    }

    // 삭제할 행 찾기
    let rowIndex = -1
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === answerId) {
        rowIndex = i
        break
      }
    }

    if (rowIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "해당 ID의 답변을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    // 행 삭제
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await getSheetId(sheets, SPREADSHEET_ID, SHEET_NAME),
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: "답변이 성공적으로 삭제되었습니다.",
    })
  } catch (error) {
    console.error("답변 삭제 오류:", error)
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

// 시트 ID 가져오기
async function getSheetId(sheets, spreadsheetId, sheetName) {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  const sheet = spreadsheet.data.sheets?.find((s) => s.properties?.title === sheetName)
  if (!sheet) {
    throw new Error(`시트 "${sheetName}"를 찾을 수 없습니다.`)
  }

  return sheet.properties?.sheetId
}
