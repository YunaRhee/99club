"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PageLayout from "@/components/page-layout"
import { formatDateShort } from "@/lib/utils"
import type { Question } from "@/lib/questions"
import { getAnswersByQuestionId } from "@/lib/answers"
import AnswerList from "@/components/answer-list"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publicAnswers, setPublicAnswers] = useState<any[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)

  // 현재 날짜 기준으로 Day 계산 - Day 5는 2025년 4월 15일 오전 9시 이후에 공개
  const calculateDayCount = () => {
    const now = new Date()

    // 2025년 4월 11일 오전 9시 (Day 3 공개 시간)
    const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 월은 0부터 시작하므로 4월은 3
    // 2025년 4월 14일 오전 9시 (Day 4 공개 시간)
    const day4ReleaseTime = new Date(2025, 3, 14, 9, 0, 0)
    // 2025년 4월 15일 오전 9시 (Day 5 공개 시간)
    const day5ReleaseTime = new Date(2025, 3, 15, 9, 0, 0)

    if (now >= day5ReleaseTime) {
      return 5 // Day 5 공개됨
    } else if (now >= day4ReleaseTime) {
      return 4 // Day 4 공개됨
    } else if (now >= day3ReleaseTime) {
      return 3 // Day 3 공개됨
    }

    return 2 // 그 전에는 Day 2
  }

  // 현재 날짜 기준 Day 계산
  const dayCount = calculateDayCount()

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/questions")
        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }
        const data = await response.json()

        if (data.success && data.data) {
          // 현재 시간 확인
          const now = new Date()
          // 2025년 4월 15일 오전 9시 (Day 5 공개 시간)
          const day5ReleaseTime = new Date(2025, 3, 15, 9, 0, 0)

          // 질문 필터링 및 정렬
          let filteredQuestions = [...data.data]

          // Day 5 질문은 2025년 4월 15일 오전 9시 이후에만 표시
          if (now < day5ReleaseTime) {
            filteredQuestions = filteredQuestions.filter((q) => q.days !== 5)
          }

          // 날짜 기준으로 내림차순 정렬 (최신순)
          filteredQuestions.sort((a, b) => {
            // days 필드가 있으면 days 기준으로 내림차순 정렬
            if (a.days && b.days) {
              return b.days - a.days
            }
            // days 필드가 없으면 날짜 기준으로 내림차순 정렬
            return new Date(b.date).getTime() - new Date(a.date).getTime()
          })

          setQuestions(filteredQuestions)
        }
      } catch (error) {
        console.error("질문 목록 가져오기 오류:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // 질문 클릭 핸들러
  const handleQuestionClick = async (question: Question) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)

    // 공개된 답변 가져오기
    setIsLoadingAnswers(true)
    try {
      const answers = await getAnswersByQuestionId(question.id, true)
      setPublicAnswers(answers)
    } catch (error) {
      console.error("답변 가져오기 오류:", error)
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  return (
    <PageLayout title="지난 면접 질문">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-hanghae-text">질문을 불러오는 중...</div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-hanghae-text/70">아직 질문이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.id}
              className="bg-hanghae-gray border-[#3a3e41] border-[1px] cursor-pointer hover:border-main-red transition-colors"
              onClick={() => handleQuestionClick(question)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{question.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text">
                    Day {question.days || 1}
                  </Badge>
                  <Badge
                    className={
                      question.category === "Frontend"
                        ? "bg-[#4A6EB0] hover:bg-[#4A6EB0]/90 text-white"
                        : question.category === "Backend"
                          ? "bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
                          : question.category === "공통"
                            ? "bg-[#9370DB] hover:bg-[#9370DB]/90 text-white"
                            : "bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
                    }
                  >
                    {question.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(question.date)}</p>
                <p className="text-hanghae-text line-clamp-2">{question.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 질문 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedQuestion.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-hanghae-light text-hanghae-text">Day {selectedQuestion.days || 1}</Badge>
                  <Badge
                    className={
                      selectedQuestion.category === "Frontend"
                        ? "bg-[#4A6EB0] text-white"
                        : selectedQuestion.category === "Backend"
                          ? "bg-[#6B8E23] text-white"
                          : selectedQuestion.category === "공통"
                            ? "bg-[#9370DB] text-white"
                            : "bg-[#FF8C00] text-white"
                    }
                  >
                    {selectedQuestion.category}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="mt-4">
                <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(selectedQuestion.date)}</p>
                <p className="text-hanghae-text whitespace-pre-wrap break-all">{selectedQuestion.content}</p>

                {selectedQuestion.hint && (
                  <div className="mt-4 p-4 bg-hanghae-light rounded-md">
                    <h3 className="text-sm font-medium mb-1">힌트</h3>
                    <p className="text-sm text-hanghae-text/70 whitespace-pre-wrap break-all">{selectedQuestion.hint}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">공개된 답변</h2>
                {isLoadingAnswers ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-pulse text-hanghae-text">답변을 불러오는 중...</div>
                  </div>
                ) : (
                  <AnswerList answers={publicAnswers} />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
