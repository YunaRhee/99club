import { google } from "googleapis"
import { NextResponse } from "next/server"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.USER

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, nickname, phone, password, profileIcon, createdAt } = body

    // 필수 필드 검증
    if (!userId || !nickname || !phone || !password) {
      return NextResponse.json({ success: false, message: "필수 필드가 누락되었습니다." }, { status: 400 })
    }

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 스프레드시트에 데이터 추가
    try {
      // 시트가 있는지 확인하고 없으면 생성
      await checkAndCreateSheet(sheets, SPREADSHEET_ID, SHEET_NAME)

      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:F`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[userId, nickname, phone, password, profileIcon || "🐦", createdAt]],
        },
      })

      return NextResponse.json({
        success: true,
        message: "사용자 정보가 성공적으로 저장되었습니다.",
      })
    } catch (apiError) {
      console.error("Google Sheets API 오류:", apiError)
      throw new Error(`Google Sheets API 오류: ${apiError.message}`)
    }
  } catch (error) {
    console.error("사용자 정보 저장 오류:", error)
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

// 스프레드시트 구조 확인 및 생성 함수
async function checkAndCreateSheet(sheets, spreadsheetId, sheetName) {
  // 스프레드시트 정보 가져오기
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
  })

  // 시트가 있는지 확인
  const sheetExists = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === sheetName)

  if (!sheetExists) {
    // 시트 생성
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    })

    // 헤더 추가
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:F1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["userId", "nickname", "phone", "password", "profileIcon", "createdAt"]],
      },
    })

    console.log(`시트 "${sheetName}"가 생성되었습니다.`)
  }
}
