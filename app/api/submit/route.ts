import { google } from "googleapis"
import { NextResponse } from "next/server"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"
const SHEET_NAME = "답변"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, nickname, password, questionId, category, content, isPublic = false, answerId } = body

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

    // 현재 날짜 및 시간 (KST)
    const now = new Date()
    // KST로 변환 (UTC+9)
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    const formattedDate = kstNow.toISOString()

    // 또는 더 명확하게 한국 시간으로 포맷팅:
    // const formattedDate = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // 고유 ID 생성 (answerId가 있으면 사용, 없으면 새로 생성)
    const finalAnswerId = answerId || `ans_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Google Sheets API 인증 설정
    const auth = await getGoogleAuth()
    const sheets = google.sheets({ version: "v4", auth })

    console.log("스프레드시트 저장 시도:", {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME,
      answerId: finalAnswerId,
    })

    // 스프레드시트에 데이터 추가 (단순화된 방식)
    try {
      // 먼저 시트가 있는지 확인
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      })

      // 시트 목록 가져오기
      const sheetsList = spreadsheet.data.sheets?.map((sheet) => sheet.properties?.title) || []
      console.log("시트 목록:", sheetsList)

      // 시트가 없으면 생성
      if (!sheetsList.includes(SHEET_NAME)) {
        console.log(`시트 "${SHEET_NAME}"가 없습니다. 생성합니다.`)
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: SHEET_NAME,
                  },
                },
              },
            ],
          },
        })

        // 헤더 추가
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:G1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [["id", "timestamp", "questionId", "nickname", "phone", "content", "isPublic"]],
          },
        })
        console.log("시트 생성 및 헤더 추가 완료")
      }

      // 데이터 추가 (항상 새로운 행으로 추가)
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:G`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[finalAnswerId, formattedDate, questionId, nickname, password, content, isPublic.toString()]],
        },
      })

      console.log("데이터 추가 성공:", appendResponse.data.updates?.updatedRange)

      return NextResponse.json({
        success: true,
        message: "답변이 성공적으로 저장되었습니다.",
        answerId: finalAnswerId,
        debug: {
          spreadsheetId: SPREADSHEET_ID,
          sheetName: SHEET_NAME,
          updatedRange: appendResponse.data.updates?.updatedRange,
        },
      })
    } catch (apiError) {
      console.error("Google Sheets API 오류:", apiError)

      // 오류 세부 정보 로깅
      if (apiError.response) {
        console.error("API 응답 오류:", apiError.response.data)
      }

      throw new Error(`Google Sheets API 오류: ${apiError.message}`)
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
