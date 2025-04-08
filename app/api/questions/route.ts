import { NextResponse } from "next/server"
import { getAllQuestions } from "@/lib/server-api"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"
import { google } from "googleapis"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.QUESTION

export async function GET() {
  try {
    const questions = await getAllQuestions()

    // 디버깅을 위한 로그 추가
    console.log(`API: Fetched ${questions.length} questions`)

    // 'days' 필드가 없는 질문에 대해 날짜 기반으로 계산
    const questionsWithDays = questions.map((q) => {
      if (q.days === undefined) {
        // 날짜 기반으로 day 계산
        const startDate = new Date(2025, 3, 1) // April 1st, 2025
        const questionDate = new Date(q.date)

        startDate.setHours(0, 0, 0, 0)
        questionDate.setHours(0, 0, 0, 0)

        const diffTime = questionDate.getTime() - startDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        return {
          ...q,
          days: diffDays + 1, // Day 1 is April 1st
        }
      }
      return q
    })

    return NextResponse.json({
      success: true,
      data: questionsWithDays,
    })
  } catch (error) {
    console.error("질문 API 오류:", error)
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, date, category, hint, modelAnswer } = body

    // 필수 필드 검증
    if (!title || !content || !category) {
      return NextResponse.json({ success: false, message: "제목, 내용, 카테고리는 필수 항목입니다." }, { status: 400 })
    }

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    // 시트가 있는지 확인하고 없으면 생성
    await checkAndCreateSheet(sheets, SPREADSHEET_ID, SHEET_NAME)

    // 고유 ID 생성
    const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // 스프레드시트에 데이터 추가
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:G`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            id,
            title,
            content,
            date || new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }),
            category,
            hint || "",
            modelAnswer || "",
          ],
        ],
      },
    })

    return NextResponse.json({
      success: true,
      message: "질문이 성공적으로 저장되었습니다.",
      questionId: id,
    })
  } catch (error) {
    console.error("질문 저장 오류:", error)
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
      range: `${SHEET_NAME}!A1:G1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["id", "title", "content", "date", "category", "hint", "modelAnswer"]],
      },
    })

    console.log(`시트 "${sheetName}"가 생성되었습니다.`)
  }
}
