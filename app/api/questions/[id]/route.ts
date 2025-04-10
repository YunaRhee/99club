import { NextResponse } from "next/server"
import { getQuestionById } from "@/lib/server-api"

// 명시적으로 런타임 설정 추가
export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // params가 Promise이므로 await 사용
    const { id } = await params
    const question = await getQuestionById(id)

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "질문을 찾을 수 없습니다.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: question,
    })
  } catch (error) {
    console.error("질문 API 오류:", error)

    // 간단한 오류 처리
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
