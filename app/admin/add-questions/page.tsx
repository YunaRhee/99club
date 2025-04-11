"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import PageLayout from "@/components/page-layout"

export default function AddQuestionsPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionsData, setQuestionsData] = useState("")

  // 관리자가 아니면 접근 제한
  if (!user || !isAdmin) {
    return (
      <PageLayout title="권한 없음">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="py-8">
              <p className="mb-4 text-muted-foreground">관리자 권한이 필요합니다.</p>
              <Button onClick={() => (window.location.href = "/admin")}>관리자 페이지로 이동</Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 데이터 파싱
      let questions = []
      try {
        // 탭으로 구분된 데이터를 파싱
        const rows = questionsData.trim().split("\n")

        questions = rows.map((row) => {
          const columns = row.split("\t")
          if (columns.length < 7) {
            throw new Error(`잘못된 형식: ${row}`)
          }

          return {
            id: columns[0],
            title: columns[1],
            content: columns[2],
            date: columns[3],
            category: columns[4],
            hint: columns[5],
            modelAnswer: columns[6],
            days: columns[7] || "",
          }
        })
      } catch (parseError) {
        // 타입 안전하게 오류 메시지 처리
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError)

        throw new Error(`데이터 파싱 오류: ${errorMessage}`)
      }

      // API 호출
      const response = await fetch("/api/questions/add-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "질문 저장 중 오류가 발생했습니다.")
      }

      const data = await response.json()

      toast({
        title: "질문 저장 완료",
        description: data.message,
      })

      // 성공 후 입력 필드 초기화
      setQuestionsData("")
    } catch (error) {
      console.error("질문 저장 오류:", error)
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "질문 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout title="질문 일괄 추가">
      <Card>
        <CardHeader>
          <CardTitle>질문 데이터 일괄 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                탭으로 구분된 질문 데이터를 붙여넣으세요. 각 행은 하나의 질문이며, 열은 id, title, content, date,
                category, hint, modelAnswer, days 순서여야 합니다.
              </p>
              <Textarea
                value={questionsData}
                onChange={(e) => setQuestionsData(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="q5	기술 도입 시 리스크 관리	기존 코드베이스에 새로운 기술이나 도구를 도입했던 경험이 있다면...	25/04/10	공통	도입 기술은 프레임워크, 상태 관리 도구...	<b>[첫 취업 준비생이라면?]</b><br>..."
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !questionsData.trim()}>
                {isSubmitting ? "저장 중..." : "질문 저장하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>사용 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>스프레드시트나 엑셀에서 질문 데이터를 탭으로 구분된 형식으로 복사합니다.</li>
            <li>위 텍스트 영역에 붙여넣습니다.</li>
            <li>데이터 형식이 올바른지 확인합니다.</li>
            <li>"질문 저장하기" 버튼을 클릭합니다.</li>
            <li>저장이 완료되면 성공 메시지가 표시됩니다.</li>
          </ol>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
