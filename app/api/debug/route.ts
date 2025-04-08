import { google } from "googleapis"
import { NextResponse } from "next/server"

// 환경 변수에서 인증 정보 가져오기
import { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } from "@/lib/config"

// 하드코딩된 인증 정보 부분을 변수로 대체
const serviceAccountEmail = GOOGLE_SERVICE_ACCOUNT_EMAIL
const privateKey = GOOGLE_PRIVATE_KEY
const spreadsheetId = GOOGLE_SPREADSHEET_ID

export async function GET() {
  try {
    // 인증 정보 확인
    const authInfo = {
      serviceAccountEmail: serviceAccountEmail,
      privateKeyLength: privateKey.length,
      privateKeyFormat: {
        startsWithDash: privateKey.includes("-----BEGIN PRIVATE KEY-----"),
        containsNewlines: privateKey.includes("\n"),
        firstChars: privateKey.slice(0, 20) + "...",
        lastChars: "..." + privateKey.slice(-20),
      },
      spreadsheetId: spreadsheetId,
    }

    // 인증 테스트
    let authTest = { success: false, message: "테스트 실행되지 않음" }
    try {
      const auth = await testGoogleAuth()
      authTest = { success: true, message: "인증 성공" }

      // 스프레드시트 접근 테스트
      const sheets = google.sheets({ version: "v4", auth })
      const testResponse = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      })

      authTest.spreadsheetTitle = testResponse.data.properties?.title || "제목 없음"
      authTest.sheetsCount = testResponse.data.sheets?.length || 0
    } catch (error) {
      authTest = { success: false, message: error.message }
    }

    return NextResponse.json({
      success: true,
      message: "인증 정보 상태",
      authInfo,
      authTest,
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

// 아래 함수에서도 동일하게 변경
async function testGoogleAuth() {
  const { JWT } = google.auth

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
}
