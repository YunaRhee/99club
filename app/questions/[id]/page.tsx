"use client"

import { useState, useEffect } from "react"
import { getQuestionById } from "@/lib/questions"
import QuestionCard from "@/components/question-card"
import AnswerForm from "@/components/answer-form"
import { getAnswersByQuestionId } from "@/lib/answers"
import AnswerList from "@/components/answer-list"
import { notFound } from "next/navigation"
import PageLayout from "@/components/page-layout"
import type { Question } from "@/lib/questions"
import type { Answer } from "@/lib/answers"

// 클라이언트 컴포넌트로 변경하고 데이터 페칭 로직 수정
export default function QuestionPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // 클라이언트 사이드에서 데이터 페칭
        const fetchedQuestion = await getQuestionById(params.id)
        if (!fetchedQuestion) {
          notFound()
        }
        setQuestion(fetchedQuestion)

        const publicAnswers = await getAnswersByQuestionId(params.id, true)
        setAnswers(publicAnswers)
      } catch (error) {
        console.error("데이터 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse">로딩 중...</div>
        </div>
      </PageLayout>
    )
  }

  if (!question) {
    return notFound()
  }

  return (
    <PageLayout>
      <QuestionCard question={question} category={question.category} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">답변 작성하기</h2>
        <AnswerForm questionId={question.id} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">공개된 답변</h2>
        <AnswerList answers={answers} />
      </div>
    </PageLayout>
  )
}
