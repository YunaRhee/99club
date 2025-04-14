import { google } from "googleapis"
import { NextResponse } from "next/server"

// 타입 정의 추가
interface QuestionSheetData {
  exists: boolean
  rowCount: number
  data: any[]
  error?: string // error 속성 추가
}

export async function GET() {
  try {
    // 하드코딩된 인증 정보
    const serviceAccountEmail = "id-99club-1day1challenge@club-1day1interview.iam.gserviceaccount.com"
    const privateKey =
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyvZ21E4a254G3\nQJ5+38EQy1dDQky2d4qKqkjeUHmECzW94vchI1iXOO9eRqVJqaCCkCFJXhXKi8pc\n+mC/ujqrTseTz6QhzwEQNr+6NleMI9u62nQcc5NL2q1yFFDHxpaipVnURckt1ZL1\nUOsF+ntI+nT7EZaZsjKfeKTKePr+cDEwxu1mucnaMK5hKf7BCI9WrXe4qpQ+0Zb+\nVNSNjmhGVa7ogi9eXALuHTdEeP8YqLNZLMommUjcuE8OCcGwjuwWhtfxL1evNZwL\nPbH6omHGZrdPGcNdhyQBp7IZ2C0GWcMoqsvC2rtINwJJYYP7OjQyw6GvMaycB2VZ\nybcICfwXAgMBAAECggEAHYSQ8eF6ouQSmPfT9PHwyVw7WgEt+Ag/2eyLQiOaHcNY\nKba8xz02GSsu5KvYChU4S7ePt7UQ9jUlwzsaFS+lFrtY3EEzQt4Tt+DCwvbMeHlH\nhVEkUbqIfcNsV2WhfYx/Pfb+ob6wnaAit96YIZGfIIs0HG5oJ5O1Jn7fAA0ArloE\nCTnESe6QBedtW7sY1wSYRo5TvzDsVp0mTRT08SdUDwdja8vdcJjVjBAiRxl722HX\nSabX44yHQsyPNrS7g1NzP21acgQ8GVpkSW6ETSpSrE5/zFMYA07n71sbeVYpBIzn\n+FvTpRxQkIJpYflL0/GwU9g8C/3tp8hZYtgec+ZqoQKBgQDkF+jxdwIuPXWM//yy\noQF8ODRbVADymxPMDFPMHQhjsAKlFfsjRxkWdJpG1kdUYNUIRKMjmuEZzwImYO5s\nAvGyB9AaqeqF1npjhKGjIizDBTdAQwe5vnwEad/k6+8uAFMGIYW5yOoV2NLaKsri\nfJrzuLR9d34CxI/bOKa2VVsapwKBgQDIm+9VYHPXlgbEfT4gAkj9VKwZrznJMu1W\nhKYJvOTKsvU+BVoNkfHcQDsMdEFBZJkQKbRO8r5Wkg5isQjVJQRdilXn2Hvz8Nib\nVHgcejW2cLyB4nFyd4tXpSTDWkrdg3xCbSqa4h9AQBXLuG/wTUTdtiYilISgFGXX\nx1xCqqrxEQKBgQDNIFuTXA2P/CGNLmHZW0Z0qi8buw4nICPLq4Jo2+tBi3a1dHEo\nJrZ/JVnhPq9jSLoM930ndg/eH/a1ARMp+/PUwYX7lLeeqWXjvdGHXiKXOEeZ+S4n\ncxEg/v4lZ7Dv08bWiqsyi2dJQndNUJKo4JqReJiJBT9DyfX9lpMHAvgtnQKBgDLF\n3LZEGi2nSAE1HaMmUOjlJEW/5qU4oX8zRX7TcyimUJGo8xjaJlezXf6R8e4mEuNX\nWs5ce7YXc1KhMfYYT1mJaKKsVPrxqzDtGRVEDRImyF8rO8FX5kmBf6N919Lms21w\nicb3kidF0P5lqNcuB08CCfbYlhSZ9Qi+6WfqICexAoGBANFMQ9A51rOivA2SOOoR\nA8k6s5hz1wuIzBe3iULzMtBZ16re72XM1jixMMHMKLAZIUDIRj1Xj8ty8prTMA6M\n0ggbkAQckPcQppLUU//23RH+5wWyDZCv6oJTiQWQ3UcUmB9euHJ7LdBIihiW2mhf\n8ytvee76gEbNjpTcTStKHDoc\n-----END PRIVATE KEY-----\n"
    const spreadsheetId = "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"

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
      const { JWT } = google.auth
      const auth = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      })

      // 인증 테스트
      await auth.authorize()
      authTest = { success: true, message: "인증 성공" }

      // 스프레드시트 접근 테스트
      const sheets = google.sheets({ version: "v4", auth })
      const testResponse = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      })

      // 시트 목록 가져오기
      const sheetsList = testResponse.data.sheets?.map((sheet) => sheet.properties?.title) || []

      // Question 시트 데이터 가져오기
      let questionSheetData: QuestionSheetData = { exists: false, rowCount: 0, data: [] }
      try {
        const questionSheet = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: "Question!A:H",
        })

        questionSheetData = {
          exists: true,
          rowCount: questionSheet.data.values?.length || 0,
          data: questionSheet.data.values?.slice(0, 3) || [], // 처음 3개 행만 표시
        }
      } catch (error) {
        questionSheetData = { exists: false, rowCount: 0, data: [], error: error.message }
      }

      return NextResponse.json({
        success: true,
        message: "구글 시트 연결 테스트",
        authInfo,
        authTest: {
          ...authTest,
          spreadsheetTitle: testResponse.data.properties?.title || "제목 없음",
          sheetsCount: testResponse.data.sheets?.length || 0,
          sheetsList: sheetsList,
          questionSheetData,
        },
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "구글 시트 연결 오류",
          authInfo,
          authTest: { success: false, message: error.message, stack: error.stack },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
