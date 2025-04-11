"use client"

import { useState, useEffect } from "react"
import { getQuestionById } from "@/lib/questions"
import AnswerForm from "@/components/answer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Question } from "@/lib/questions"

export default function AnswerPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const fetchedQuestion = await getQuestionById(params.id)
        if (!fetchedQuestion) {
          notFound()
        }
        setQuestion(fetchedQuestion)
      } catch (error) {
        console.error("질문 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion()
  }, [params.id])

  if (loading) {
    return (
      <div className="container max-w-4xl py-6 px-4 md:py-10">
        <div className="animate-pulse">로딩 중...</div>
      </div>
    )
  }

  if (!question) {
    return notFound()
  }

  return (
    <div className="container max-w-4xl py-6 px-4 md:py-10">
      <Link
        href={`/questions/${params.id}`}
        className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block"
      >
        ← 질문으로 돌아가기
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{question.title}</CardTitle>
              <CardDescription>
                {new Date(question.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Badge>{question.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert">
            <p>{question.content}</p>
            {question.hint && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <h3 className="text-sm font-medium mb-1">힌트</h3>
                <p className="text-sm text-muted-foreground">{question.hint}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">답변 작성하기</h2>
      <AnswerForm questionId={params.id} />
    </div>
  )
}
