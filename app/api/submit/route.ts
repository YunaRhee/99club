import { google } from "googleapis"
import { NextResponse } from "next/server"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.ANSWER

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, nickname, password, questionId, category, content, isPublic = false } = body

    // 필수 필드 검증
    if (!nickname || !password || !questionId || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "필수 필드가 누락되었습니다.",
        },
        { status: 400 },
      )
    }

    // 카테고리 검증 - 카테고리가 없으면 Frontend로 기본값 설정
    const validCategory = category || "Frontend"

    // 현재 날짜 및 시간 (KST)
    const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })

    // 고유 ID 생성
    const answerId = `ans_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 스프레드시트에 데이터 추가
    try {
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:H`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [answerId, now, questionId, validCategory, userId, nickname, password, content, isPublic.toString()],
          ],
        },
      })

      return NextResponse.json({
        success: true,
        message: "답변이 성공적으로 저장되었습니다.",
        answerId,
        debug: {
          spreadsheetId: SPREADSHEET_ID,
          sheetName: SHEET_NAME,
          updatedRange: appendResponse.data.updates?.updatedRange,
          category: validCategory,
        },
      })
    } catch (apiError) {
      console.error("Google Sheets API 오류:", apiError)

      // 스프레드시트 구조 확인
      try {
        await checkAndCreateSheet(sheets, SPREADSHEET_ID, SHEET_NAME)

        // 다시 시도
        const appendResponse = await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A:H`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [answerId, now, questionId, validCategory, userId, nickname, password, content, isPublic.toString()],
            ],
          },
        })

        return NextResponse.json({
          success: true,
          message: "답변이 성공적으로 저장되었습니다. (시트 생성 후)",
          answerId,
          category: validCategory,
        })
      } catch (retryError) {
        console.error("재시도 오류:", retryError)
        throw new Error(`Google Sheets API 오류: ${apiError.message}. 재시도 실패: ${retryError.message}`)
      }
    }
  } catch (error) {
    console.error("스프레드시트 저장 오류:", error)
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
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
      range: `${sheetName}!A1:I1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["id", "timestamp", "questionId", "category", "userId", "nickname", "phone", "content", "isPublic"]],
      },
    })

    console.log(`시트 "${sheetName}"가 생성되었습니다.`)
  }
}
