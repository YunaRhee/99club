import { NextResponse } from "next/server"
import { getTodayQuestion } from "@/lib/server-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const day = searchParams.get("day")
    const dayCount = day ? Number.parseInt(day) : 1

    const question = await getTodayQuestion(dayCount)

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("오늘의 질문 API 오류:", error)
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
