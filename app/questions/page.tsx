"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { markQuestionAsRead } from "@/lib/user-activity"
import PageLayout from "@/components/page-layout"
import { formatDateShort, formatDateTime } from "@/lib/utils"
import type { Question } from "@/lib/questions"
import type { Answer } from "@/lib/answers"
import { getDayCount } from "@/lib/utils"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [publicAnswers, setPublicAnswers] = useState<Answer[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const { user } = useAuth()

  // 현재 날짜 기준으로 Day 계산
  const calculateDayCount = useCallback(() => {
    // 유틸리티 함수 사용
    return getDayCount()
  }, [])

  // 현재 날짜 기준 Day 계산
  const currentDay = calculateDayCount()

  // Calculate day number based on date (fallback if days field is not available)
  const calculateDayNumber = useCallback((dateString: string) => {
    // 테스트를 위해 항상 1 반환
    return 1

    /* 실제 날짜 계산 로직은 아래와 같이 구현할 수 있습니다
    const startDate = new Date(2024, 3, 8) // April 8th, 2024 (month is 0-indexed)
    startDate.setHours(9, 0, 0, 0) // 오전 9시 KST

    const questionDate = new Date(dateString)
    questionDate.setHours(9, 0, 0, 0) // 오전 9시로 설정하여 날짜 비교

    // Calculate difference in days
    const diffTime = questionDate.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Day 1 is April 8th
    return diffDays + 1
    */
  }, [])

  // 샘플 데이터 사용 함수
  const useSampleData = useCallback(() => {
    // 샘플 데이터 사용
    const sampleData = [
      {
        id: "q1",
        title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
        content:
          "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
        date: "2024-04-08",
        category: "Frontend",
        days: 1,
      },
      {
        id: "q2",
        title: "RESTful API의 설계 원칙은 무엇인가요?",
        content:
          "RESTful API를 설계할 때 고려해야 할 주요 원칙들에 대해 설명하고, 좋은 RESTful API의 예시를 들어주세요.",
        date: "2024-04-09",
        category: "Backend",
        days: 2,
      },
      {
        id: "q3",
        title: "데이터베이스 인덱싱(Indexing)의 작동 원리와 장단점은?",
        content: "데이터베이스에서 인덱싱이 어떻게 작동하는지 설명하고, 인덱스 사용의 장점과 단점에 대해 논의해주세요.",
        date: "2024-04-10",
        category: "Backend",
        days: 3,
      },
    ]

    // 현재 날짜까지의 샘플 데이터만 필터링
    const filteredSampleData = sampleData.filter((q) => q.days <= currentDay)
    console.log("Using sample data:", filteredSampleData.length)

    setQuestions(filteredSampleData)
    setFilteredQuestions(filteredSampleData)
  }, [currentDay])

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true)
        console.log("Fetching questions, current day:", currentDay)

        // API 라우트를 통해 질문 데이터 가져오기
        const response = await fetch("/api/questions")
        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }
        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          console.log("Fetched questions:", data.data.length)

          // 현재 날짜까지의 질문만 표시
          // 'days' 필드가 있으면 사용하고, 없으면 날짜로 계산
          const filteredData = data.data.filter((q) => {
            // 'days' 필드가 있으면 사용
            if (q.days !== undefined) {
              return q.days <= currentDay
            }

            // 'days' 필드가 없으면 날짜로 계산
            const questionDay = calculateDayNumber(q.date)
            return questionDay <= currentDay
          })

          console.log("Filtered questions:", filteredData.length)

          // 만약 필터링된 데이터가 없다면, 샘플 데이터 사용
          if (filteredData.length === 0) {
            console.log("No questions found for current day, using sample data")
            useSampleData()
          } else {
            setQuestions(filteredData)
            setFilteredQuestions(filteredData)
          }
        } else {
          console.log("No data from API, using sample data")
          useSampleData()
        }
      } catch (error) {
        console.error("질문 가져오기 오류:", error)
        useSampleData()
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [currentDay, useSampleData, calculateDayNumber])

  const filterQuestions = (category) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false) // Move setIsDropdownOpen here
    if (category === "전체") {
      setFilteredQuestions(questions)
    } else {
      setFilteredQuestions(questions.filter((q) => q.category === category))
    }
  }

  const handleQuestionClick = async (question: Question) => {
    if (user?.userId) {
      markQuestionAsRead(user.userId, question.id)
    }

    setSelectedQuestion(question)
    setIsLoadingAnswers(true)

    try {
      // Fetch public answers for this question
      const response = await fetch(`/api/answers?questionId=${question.id}&publicOnly=true`)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // Answers are already sorted by timestamp on the server
          setPublicAnswers(data.data)
        } else {
          setPublicAnswers([])
        }
      } else {
        setPublicAnswers([])
      }
    } catch (error) {
      console.error("답변 가져오기 오류:", error)
      setPublicAnswers([])
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  const categories = ["전체", "Frontend", "Backend", "공통", "인성"]

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-hanghae-text">지난 면접 질문</h1>
        <div className="relative">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory}
            <ChevronDown className="h-4 w-4" />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-hanghae-gray border border-[#3a3e41] rounded-md shadow-lg z-10">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left px-4 py-2 hover:bg-hanghae-light"
                  onClick={() => filterQuestions(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-hanghae-light rounded w-3/4"></div>
                <div className="h-4 bg-hanghae-light rounded w-1/4 mt-2"></div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="h-4 bg-hanghae-light rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Dialog
              key={question.id}
              onOpenChange={(open) => {
                if (open) handleQuestionClick(question)
              }}
            >
              <DialogTrigger asChild>
                <Card className="hover:bg-hanghae-light/50 transition-colors cursor-pointer border-[#3a3e41] border-[1px]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                      <Badge className="bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text">
                        {question.category}
                      </Badge>
                    </div>
                    <div className="text-sm text-hanghae-text/70">
                      Day {question.days || calculateDayNumber(question.date)} ({formatDateShort(question.date)})
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-hanghae-text/70 line-clamp-2">{question.content}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex justify-between items-center pr-8">
                    <DialogTitle className="text-xl">{selectedQuestion?.title}</DialogTitle>
                    <Badge className="bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text">
                      {selectedQuestion?.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-hanghae-text/70">
                    Day {selectedQuestion?.days || (selectedQuestion ? calculateDayNumber(selectedQuestion.date) : "")}(
                    {selectedQuestion ? formatDateShort(selectedQuestion.date) : ""})
                  </div>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                  <div className="prose dark:prose-invert max-w-none text-hanghae-text">
                    <p>{selectedQuestion?.content}</p>

                    {selectedQuestion?.hint && (
                      <div className="mt-4 p-4 bg-hanghae-light rounded-md">
                        <h3 className="text-sm font-medium mb-1">힌트</h3>
                        <p className="text-sm">{selectedQuestion.hint}</p>
                      </div>
                    )}
                  </div>

                  {/* 공개된 답변들 */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">공개된 답변</h3>
                    {isLoadingAnswers ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="bg-hanghae-light p-4 rounded-md animate-pulse">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-4 bg-hanghae-gray rounded w-24"></div>
                              <div className="h-3 bg-hanghae-gray rounded w-32"></div>
                            </div>
                            <div className="h-16 bg-hanghae-gray rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : publicAnswers.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {publicAnswers.map((answer) => (
                          <div key={answer.id} className="bg-hanghae-light p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{answer.nickname}</span>
                              <span className="text-xs text-hanghae-text/70">{formatDateTime(answer.timestamp)}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{answer.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-hanghae-light p-4 rounded-md">
                        <p className="text-hanghae-text/70 text-center">아직 공개된 답변이 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-hanghae-gray rounded-md text-center border-[#3a3e41] border-[1px]">
          <p className="text-hanghae-text/70">표시할 질문이 없습니다.</p>
          <p className="text-hanghae-text/50 text-sm mt-2">현재 Day: {currentDay}</p>
        </div>
      )}
    </PageLayout>
  )
}
