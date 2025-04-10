import { NextResponse } from "next/server"
import { getQuestionById } from "@/lib/server-api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
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

    // 오류 메시지 추출 방식 단순화
    const errorMessage = error instanceof Error ? error.message : String(error)

    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
