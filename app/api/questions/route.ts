import { NextResponse } from "next/server"
import { getAllQuestions } from "@/lib/server-api"

export async function GET() {
  try {
    const questions = await getAllQuestions()

    // 디버깅을 위한 로그 추가
    console.log(`API: Fetched ${questions.length} questions`)

    // 'days' 필드가 없는 질문에 대해 날짜 기반으로 계산
    const questionsWithDays = questions.map((q) => {
      if (q.days === undefined) {
        // 날짜 기반으로 day 계산
        const startDate = new Date(2025, 3, 9) // April 9th, 2025
        const questionDate = new Date(q.date)

        startDate.setHours(0, 0, 0, 0)
        questionDate.setHours(0, 0, 0, 0)

        const diffTime = questionDate.getTime() - startDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        return {
          ...q,
          days: diffDays + 1, // Day 1 is April 9th
        }
      }
      return q
    })

    console.log(`API: Processed ${questionsWithDays.length} questions with days`)

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

import { google } from "googleapis"

// 환경 변수에서 스프레드시트 ID와 인증 정보 가져오기
const SPREADSHEET_ID = "1CAYCVNhTeF4F5lw7BmNboJTvgTqcc7QNpp0CcRdtkxA"
const SHEET_NAME = "Question"

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

// Google 인증 함수 - 하드코딩된 인증 정보 사용
async function getGoogleAuth() {
  const { JWT } = google.auth

  try {
    // 하드코딩된 서비스 계정 정보 사용
    const serviceAccountEmail = "id-99club-1day1challenge@club-1day1interview.iam.gserviceaccount.com"
    const privateKey =
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyvZ21E4a254G3\nQJ5+38EQy1dDQky2d4qKqkjeUHmECzW94vchI1iXOO9eRqVJqaCCkCFJXhXKi8pc\n+mC/ujqrTseTz6QhzwEQNr+6NleMI9u62nQcc5NL2q1yFFDHxpaipVnURckt1ZL1UOsF+ntI+nT7EZaZsjKfeKTKePr+cDEwxu1mucnaMK5hKf7BCI9WrXe4qpQ+0Zb+\nVNSNjmhGVa7ogi9eXALuHTdEeP8YqLNZLMommUjcuE8OCcGwjuwWhtfxL1evNZwLPbH6omHGZrdPGcNdhyQBp7IZ2C0GWcMoqsvC2rtINwJJYYP7OjQyw6GvMaycB2VZybcICfwXAgMBAAECggEAHYSQ8eF6ouQSmPfT9PHwyVw7WgEt+Ag/2eyLQiOaHcNY\nKba8xz02GSsu5KvYChU4S7ePt7UQ9jUlwzsaFS+lFrtY3EEzQt4Tt+DCwvbMeHlHhVEkUbqIfcNsV2WhfYx/Pfb+ob6wnaAit96YIZGfIIs0HG5oJ5O1Jn7fAA0ArloE\nCTnESe6QBedtW7sY1wSYRo5TvzDsVp0mTRT08SdUDwdja8vdcJjVjBAiRxl722HX\nSabX44yHQsyPNrS7g1NzP21acgQ8GVpkSW6ETSpSrE5/zFMYA07n71sbe\n"
    const VYpBIzn = "" // Declare the variable
    const restOfPrivateKey =
      "+FvTpRxQkIJpYflL0/GwU9g8C/3tp8hZYtgec+ZqoQKBgQDkF+jxdwIuPXWM//\nyy\noQF8ODRbVADymxPMDFPMHQhjsAKlFfsjRxkWdJpG1kdUYNUIRKMjmuEZzwImYO5s\nAvGyB9AaqeqF1npjhKGjIizDBTdAQwe5vnwEad/k6+8uAFMGIYW5yOoV2NLaKsri\nfJrzuLR9d34CxI/bOKa2VVsapwKBgQDIm+9VYHPXlgbEfT4gAkj9VKwZrznJMu1W\nhKYJvOTKsvU+BVoNkfHcQDsMdEFBZJkQKbRO8r5Wkg5isQjVJQRdilXn2Hvz8Nib\nVHgcejW2cLyB4nFyd4tXpSTDWkrdg3xCbSqa4h9AQBXLuG/wTUTdtiYilISgFGXX\nx1xCqqrxEQKBgQDNIFuTXA2P/CGNLmHZW0Z0qi8buw4nICPLq4Jo2+tBi3a1dHEo\nJrZ/JVnhPq9jSLoM930ndg/eH/a1ARMp+/PUwYX7lLeeqWXjvdGHXiKXOEeZ+S4n\ncxEg/v4lZ7Dv08bWiqsyi2dJQndNUJKo4JqReJiJBT9DyfX9lpMHAvgtnQKBgDLF\n3LZEGi2nSAE1HaMmUOjlJEW/5qU4oX8zRX7TcyimUJGo8xjaJlezXf6R8e4mEuNX\nWs5ce7YXc1KhMfYYT1mJaKKsVPrxqzDtGRVEDRImyF8rO8FX5kmBf6N919Lms21w\nicb3kidF0P5lqNcuB08CCfbYlhSZ9Qi+6WfqICexAoGBANFMQ9A51rOivA2SOOoR\nA8k6s5hz1wuIzBe3iULzMtBZ16re72XM1jixMMHMKLAZIUDIRj1Xj8ty8prTMA6M\n0ggbkAQckPcQppLUU//23RH+5wWyDZCv6oJTiQWQ3UcUmB9euHJ7LdBIihiW2mhf\n8ytvee76gEbNjpTcTStKHDoc\n-----END PRIVATE KEY-----\n"

    // 서비스 계정 키 정보
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey + VYpBIzn + restOfPrivateKey,
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
