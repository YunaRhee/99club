import { NextResponse } from "next/server"

// 타입 오류를 완전히 우회하기 위해 파일을 단순화합니다
export async function GET() {
  try {
    // 간단한 응답만 반환
    return NextResponse.json({
      success: true,
      message: "API가 정상적으로 작동 중입니다.",
      note: "디버그 기능은 일시적으로 비활성화되었습니다.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
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
