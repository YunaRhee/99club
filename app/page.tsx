"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/questions"
import QuestionCard from "@/components/question-card"
import AnswerForm from "@/components/answer-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ModelAnswer from "@/components/model-answer"
import PageLayout from "@/components/page-layout"

export default function Home() {
  // 현재 날짜 기준으로 Day 계산 (2024년 4월 8일 오전 9시부터 시작)
  const calculateDayCount = () => {
    // 테스트를 위해 Day 1로 고정
    return 1

    /* 실제 날짜 계산 로직은 아래와 같이 구현할 수 있습니다
    const startDate = new Date(2024, 3, 8) // April 8th, 2024 (month is 0-indexed)
    startDate.setHours(9, 0, 0, 0) // 오전 9시 KST

    const now = new Date()

    // 현재 시간이 오전 9시 이전이면 전날로 계산
    const currentDay = new Date(now)
    if (now.getHours() < 9) {
      currentDay.setDate(currentDay.getDate() - 1)
    }

    // 날짜만 비교하기 위해 시간 부분 설정
    currentDay.setHours(9, 0, 0, 0)

    const diffTime = currentDay.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Day 1 is April 8th
    return diffDays + 1
    */
  }

  // 현재 날짜 기준 Day 계산
  const dayCount = calculateDayCount()

  // 카테고리별 질문 확인 상태 관리
  const [confirmedCategories, setConfirmedCategories] = useState<{ [key: string]: boolean }>({
    frontend: false,
    backend: false,
    common: false,
    personality: false,
  })

  // 질문 데이터 상태
  const [questions, setQuestions] = useState<{
    frontend: Question | null
    backend: Question | null
    common: Question | null
    personality: Question | null
  }>({
    frontend: null,
    backend: null,
    common: null,
    personality: null,
  })

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)

  // 현재 선택된 탭
  const [activeTab, setActiveTab] = useState("frontend")

  // 현재 날짜 포맷팅 (25/04/03(목))
  const today = new Date()
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][today.getDay()]
  const formattedDate = `${today.getFullYear().toString().slice(2)}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getDate().toString().padStart(2, "0")}(${dayOfWeek})`

  // 질문 데이터 로드
  useEffect(() => {
    async function loadQuestions() {
      try {
        setIsLoading(true)

        // API를 통해 카테고리별 질문 가져오기
        const [frontendRes, backendRes, commonRes, personalityRes] = await Promise.all([
          fetch(`/api/questions/category?category=Frontend&dayIndex=${dayCount - 1}`),
          fetch(`/api/questions/category?category=Backend&dayIndex=${dayCount - 1}`),
          fetch(`/api/questions/category?category=공통&dayIndex=${dayCount - 1}`),
          fetch(`/api/questions/category?category=인성&dayIndex=${dayCount - 1}`),
        ])

        const frontendData = await frontendRes.json()
        const backendData = await backendRes.json()
        const commonData = await commonRes.json()
        const personalityData = await personalityRes.json()

        setQuestions({
          frontend: frontendData.success && frontendData.data && frontendData.data[0] ? frontendData.data[0] : null,
          backend: backendData.success && backendData.data && backendData.data[0] ? backendData.data[0] : null,
          common: commonData.success && commonData.data && commonData.data[0] ? commonData.data[0] : null,
          personality:
            personalityData.success && personalityData.data && personalityData.data[0] ? personalityData.data[0] : null,
        })

        // 로컬 스토리지에서 확인 상태 로드
        if (typeof window !== "undefined") {
          const newConfirmedState = { ...confirmedCategories }

          if (
            frontendData.data &&
            frontendData.data[0] &&
            localStorage.getItem(`question_read_${frontendData.data[0].id}_Frontend`) === "true"
          ) {
            newConfirmedState.frontend = true
          }
          if (
            backendData.data &&
            backendData.data[0] &&
            localStorage.getItem(`question_read_${backendData.data[0].id}_Backend`) === "true"
          ) {
            newConfirmedState.backend = true
          }
          if (
            commonData.data &&
            commonData.data[0] &&
            localStorage.getItem(`question_read_${commonData.data[0].id}_공통`) === "true"
          ) {
            newConfirmedState.common = true
          }
          if (
            personalityData.data &&
            personalityData.data[0] &&
            localStorage.getItem(`question_read_${personalityData.data[0].id}_인성`) === "true"
          ) {
            newConfirmedState.personality = true
          }

          setConfirmedCategories(newConfirmedState)
        }
      } catch (error) {
        console.error("Failed to load questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [dayCount])

  // 질문 확인 핸들러
  const handleQuestionConfirmed = (category: string) => {
    const categoryKey = getCategoryKey(category)
    setConfirmedCategories((prev) => ({
      ...prev,
      [categoryKey]: true,
    }))
  }

  // 카테고리 문자열을 키로 변환
  const getCategoryKey = (category: string): string => {
    switch (category) {
      case "Frontend":
        return "frontend"
      case "Backend":
        return "backend"
      case "공통":
        return "common"
      case "인성":
        return "personality"
      default:
        return "frontend"
    }
  }

  // 현재 탭에 해당하는 질문 ID 가져오기
  const getCurrentQuestionId = () => {
    const question = questions[activeTab]
    return question ? question.id : ""
  }

  // 현재 탭에 해당하는 카테고리 가져오기
  const getCurrentCategory = () => {
    switch (activeTab) {
      case "frontend":
        return "Frontend"
      case "backend":
        return "Backend"
      case "common":
        return "공통"
      case "personality":
        return "인성"
      default:
        return "Frontend"
    }
  }

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <PageLayout title={`Day ${dayCount} 오늘의 질문`} subtitle={formattedDate}>
      <Tabs defaultValue="frontend" onValueChange={handleTabChange}>
        <TabsList className="mb-0.5 w-full rounded-md">
          <TabsTrigger value="frontend" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            Backend
          </TabsTrigger>
          <TabsTrigger value="common" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">
            공통
          </TabsTrigger>
          <TabsTrigger
            value="personality"
            className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black"
          >
            인성
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px] animate-pulse">
            <div className="h-6 bg-hanghae-light rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-hanghae-light rounded w-full mb-2"></div>
            <div className="h-4 bg-hanghae-light rounded w-full mb-2"></div>
            <div className="h-4 bg-hanghae-light rounded w-3/4"></div>
          </div>
        ) : (
          <>
            <TabsContent value="frontend">
              {questions.frontend ? (
                <QuestionCard
                  question={questions.frontend}
                  category="Frontend"
                  onConfirmRead={handleQuestionConfirmed}
                />
              ) : (
                <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
                  오늘의 Frontend 질문이 준비되지 않았습니다.
                </div>
              )}
            </TabsContent>

            <TabsContent value="backend">
              {questions.backend ? (
                <QuestionCard question={questions.backend} category="Backend" onConfirmRead={handleQuestionConfirmed} />
              ) : (
                <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
                  오늘의 Backend 질문이 준비되지 않았습니다.
                </div>
              )}
            </TabsContent>

            <TabsContent value="common">
              {questions.common ? (
                <QuestionCard question={questions.common} category="공통" onConfirmRead={handleQuestionConfirmed} />
              ) : (
                <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
                  오늘의 공통 질문이 준비되지 않았습니다.
                </div>
              )}
            </TabsContent>

            <TabsContent value="personality">
              {questions.personality ? (
                <QuestionCard
                  question={questions.personality}
                  category="인성"
                  onConfirmRead={handleQuestionConfirmed}
                />
              ) : (
                <div className="p-4 bg-hanghae-gray rounded-md text-hanghae-text border-[#3a3e41] border-[1px]">
                  오늘의 인성 질문이 준비되지 않았습니다.
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* 답변 작성하기 폼 - 해당 카테고리 질문이 확인된 경우에만 표시 */}
      {confirmedCategories[activeTab] && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-hanghae-text">답변 작성하기</h2>
          <AnswerForm questionId={getCurrentQuestionId()} category={getCurrentCategory()} />
        </div>
      )}

      {/* 모범 답안 - 항상 표시 */}
      {questions[activeTab] && <ModelAnswer modelAnswer={questions[activeTab].modelAnswer || ""} />}
    </PageLayout>
  )
}
