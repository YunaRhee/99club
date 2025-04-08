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
