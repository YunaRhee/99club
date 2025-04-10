import { type NextRequest, NextResponse } from "next/server"
import { getQuestionById } from "@/lib/server-api"

// Next.js App Router에서 요구하는 정확한 함수 시그니처 사용
export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
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
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
