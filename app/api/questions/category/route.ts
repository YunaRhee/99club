import { NextResponse } from "next/server"
import { getQuestionsByCategory } from "@/lib/server-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const dayIndexParam = searchParams.get("dayIndex")
    const dayIndex = dayIndexParam ? Number.parseInt(dayIndexParam) : 0

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "카테고리 파라미터가 필요합니다.",
        },
        { status: 400 },
      )
    }

    const questions = await getQuestionsByCategory(category, dayIndex)

    return NextResponse.json({
      success: true,
      data: questions,
    })
  } catch (error) {
    console.error("카테고리별 질문 API 오류:", error)
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
