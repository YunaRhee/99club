import { NextResponse } from "next/server"

// 명시적으로 런타임 설정 추가
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "API 테스트 성공",
    timestamp: new Date().toISOString(),
  })
}
