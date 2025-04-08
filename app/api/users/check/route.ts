import { google } from "googleapis"
import { NextResponse } from "next/server"
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID, SHEET_NAMES } from "@/lib/config"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = GOOGLE_SPREADSHEET_ID
const SHEET_NAME = SHEET_NAMES.USER

export async function GET(request: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(request.url)
    const nickname = searchParams.get("nickname")
    const phone = searchParams.get("phone")

    if (!nickname || !phone) {
      return NextResponse.json({ success: false, message: "닉네임과 전화번호가 필요합니다." }, { status: 400 })
    }

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    try {
      // 스프레드시트에서 사용자 데이터 가져오기
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:F`,
      })

      const rows = response.data.values || []

      // 첫 번째 행은 헤더로 간주하고 제외
      const users = rows.slice(1).map((row) => ({
        userId: row[0] || "",
        nickname: row[1] || "",
        phone: row[2] || "",
        password: row[3] || "",
      }))

      // 닉네임과 전화번호가 일치하는 사용자 찾기
      const existingUser = users.find((user) => user.nickname === nickname && user.phone === phone)

      // 닉네임만 일치하는 사용자 찾기
      const duplicateNickname = users.find((user) => user.nickname === nickname && user.phone !== phone)

      // 전화번호만 일치하는 사용자 찾기
      const duplicatePhone = users.find((user) => user.nickname !== nickname && user.phone === phone)

      if (duplicateNickname) {
        return NextResponse.json(
          {
            success: false,
            message: "이미 사용 중인 닉네임입니다.",
            exists: false,
          },
          { status: 409 },
        )
      }

      if (duplicatePhone) {
        return NextResponse.json(
          {
            success: false,
            message: "이미 사용 중인 전화번호입니다.",
            exists: false,
          },
          { status: 409 },
        )
      }

      return NextResponse.json({
        success: true,
        exists: !!existingUser,
        user: existingUser
          ? {
              userId: existingUser.userId,
              nickname: existingUser.nickname,
            }
          : null,
      })
    } catch (apiError) {
      console.error("Google Sheets API 오류:", apiError)

      // 시트가 없는 경우 - 첫 사용자
      if (apiError.message && apiError.message.includes("Unable to parse range")) {
        return NextResponse.json({
          success: true,
          exists: false,
          user: null,
        })
      }

      throw new Error(`Google Sheets API 오류: ${apiError.message}`)
    }
  } catch (error) {
    console.error("사용자 확인 오류:", error)
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
