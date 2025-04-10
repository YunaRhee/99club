import { google } from "googleapis"
import { NextResponse } from "next/server"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"
const SHEET_NAME = "User"

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

// Google 인증 함수 - 하드코딩된 인증 정보 사용
async function getGoogleAuth() {
  const { JWT } = google.auth

  try {
    // 하드코딩된 서비스 계정 정보 사용
    const serviceAccountEmail = "id-99club-1day1challenge@club-1day1interview.iam.gserviceaccount.com"
    const privateKey =
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyvZ21E4a254G3\nQJ5+38EQy1dDQky2d4qKqkjeUHmECzW94vchI1iXOO9eRqVJqaCCkCFJXhXKi8pc\n+mC/ujqrTseTz6QhzwEQNr+6NleMI9u62nQcc5NL2q1yFFDHxpaipVnURckt1ZL1\nUOsF+ntI+nT7EZaZsjKfeKTKePr+cDEwxu1mucnaMK5hKf7BCI9WrXe4qpQ+0Zb+\nVNSNjmhGVa7ogi9eXALuHTdEeP8YqLNZLMommUjcuE8OCcGwjuwWhtfxL1evNZwL\nPbH6omHGZrdPGcNdhyQBp7IZ2C0GWcMoqsvC2rtINwJJYYP7OjQyw6GvMaycB2VZ\nybcICfwXAgMBAAECggEAHYSQ8eF6ouQSmPfT9PHwyVw7WgEt+Ag/2eyLQiOaHcNY\nKba8xz02GSsu5KvYChU4S7ePt7UQ9jUlwzsaFS+lFrtY3EEzQt4Tt+DCwvbMeHlH\nhVEkUbqIfcNsV2WhfYx/Pfb+ob6wnaAit96YIZGfIIs0HG5oJ5O1Jn7fAA0ArloE\nCTnESe6QBedtW7sY1wSYRo5TvzDsVp0mTRT08SdUDwdja8vdcJjVjBAiRxl722HX\nSabX44yHQsyPNrS7g1NzP21acgQ8GVpkSW6ETSpSrE5/zFMYA07n71sbeVYpBIzn\n+FvTpRxQkIJpYflL0/GwU9g8C/3tp8hZYtgec+ZqoQKBgQDkF+jxdwIuPXWM//yy\noQF8ODRbVADymxPMDFPMHQhjsAKlFfsjRxkWdJpG1kdUYNUIRKMjmuEZzwImYO5s\nAvGyB9AaqeqF1npjhKGjIizDBTdAQwe5vnwEad/k6+8uAFMGIYW5yOoV2NLaKsri\nfJrzuLR9d34CxI/bOKa2VVsapwKBgQDIm+9VYHPXlgbEfT4gAkj9VKwZrznJMu1W\nhKYJvOTKsvU+BVoNkfHcQDsMdEFBZJkQKbRO8r5Wkg5isQjVJQRdilXn2Hvz8Nib\nVHgcejW2cLyB4nFyd4tXpSTDWkrdg3xCbSqa4h9AQBXLuG/wTUTdtiYilISgFGXX\nx1xCqqrxEQKBgQDNIFuTXA2P/CGNLmHZW0Z0qi8buw4nICPLq4Jo2+tBi3a1dHEo\nJrZ/JVnhPq9jSLoM930ndg/eH/a1ARMp+/PUwYX7lLeeqWXjvdGHXiKXOEeZ+S4n\ncxEg/v4lZ7Dv08bWiqsyi2dJQndNUJKo4JqReJiJBT9DyfX9lpMHAvgtnQKBgDLF\n3LZEGi2nSAE1HaMmUOjlJEW/5qU4oX8zRX7TcyimUJGo8xjaJlezXf6R8e4mEuNX\nWs5ce7YXc1KhMfYYT1mJaKKsVPrxqzDtGRVEDRImyF8rO8FX5kmBf6N919Lms21w\nicb3kidF0P5lqNcuB08CCfbYlhSZ9Qi+6WfqICexAoGBANFMQ9A51rOivA2SOOoR\nA8k6s5hz1wuIzBe3iULzMtBZ16re72XM1jixMMHMKLAZIUDIRj1Xj8ty8prTMA6M\n0ggbkAQckPcQppLUU//23RH+5wWyDZCv6oJTiQWQ3UcUmB9euHJ7LdBIihiW2mhf\n8ytvee76gEbNjpTcTStKHDoc\n-----END PRIVATE KEY-----\n"

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
