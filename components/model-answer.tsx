"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ChevronDown } from "lucide-react"

interface ModelAnswerProps {
  modelAnswer: string
  questionDay?: number // 추가: 질문의 Day 번호
}

export default function ModelAnswer({ modelAnswer, questionDay = 1 }: ModelAnswerProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [canView, setCanView] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const releaseHour = 20 // 저녁 8시
      const isDay3 = questionDay === 3

      // 현재 요일 확인 (0: 일요일, 1: 월요일, ..., 5: 금요일, 6: 토요일)
      const currentDayOfWeek = now.getDay()
      const isFriday = currentDayOfWeek === 5

      // 오늘 오전 9시
      const today9AM = new Date(now)
      today9AM.setHours(9, 0, 0, 0)

      // 오늘 저녁 8시
      const today8PM = new Date(now)
      today8PM.setHours(releaseHour, 0, 0, 0)

      // 어제 저녁 8시
      const yesterday8PM = new Date(today8PM)
      yesterday8PM.setDate(yesterday8PM.getDate() - 1)

      // Day 3 질문이고 금요일이면 다음 주 월요일 오전 9시 이후에 공개
      if (isDay3 && isFriday) {
        // 다음 주 월요일 오전 9시
        const nextMonday9AM = new Date(now)
        nextMonday9AM.setDate(now.getDate() + ((8 - currentDayOfWeek) % 7)) // 다음 월요일로 설정
        nextMonday9AM.setHours(9, 0, 0, 0)

        if (now >= nextMonday9AM) {
          setCanView(true)
          setTimeRemaining("")
        } else {
          setCanView(false)

          // 남은 시간 계산
          const diffMs = nextMonday9AM.getTime() - now.getTime()
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

          if (days > 0) {
            setTimeRemaining(
              `${days}일 ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
            )
          } else {
            setTimeRemaining(
              `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
            )
          }
        }
        return
      }

      // 현재 시간이 오늘 오전 9시 이전이면 어제 저녁 8시와 비교, 아니면 오늘 저녁 8시와 비교
      const compareTime = now < today9AM ? yesterday8PM : today8PM

      if (now >= compareTime) {
        setCanView(true)
        setTimeRemaining("")
      } else {
        setCanView(false)

        // 남은 시간 계산 (hh:mm:ss 형식)
        const diffMs = compareTime.getTime() - now.getTime()
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 1000) // 1초마다 체크

    return () => clearInterval(interval)
  }, [questionDay])

  // HTML 문자열을 안전하게 렌더링하는 함수
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString }
  }

  return (
    <div className="mt-6">
      <div
        className="bg-[#3a3e41] rounded-[16px] p-4 flex justify-between items-center cursor-pointer h-[70px]"
        onClick={() => canView && setShowAnswer(!showAnswer)}
      >
        <div className="text-hanghae-text">
          {canView
            ? "모범 답변이 공개되었어요."
            : `모범 답변이 ${questionDay === 3 ? "월요일 오전 9시" : "저녁 8시"}에 공개돼요.`}
        </div>
        <div className="text-hanghae-text/70 flex items-center">
          {canView ? (
            <>
              확인하기{" "}
              {showAnswer ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
            </>
          ) : (
            timeRemaining
          )}
        </div>
      </div>

      {showAnswer && canView && (
        <Card className="mt-4 bg-hanghae-gray border-[#3a3e41] border-[1px]">
          <CardContent className="pt-4">
            <div className="prose dark:prose-invert max-w-none text-hanghae-text">
              {modelAnswer ? (
                <div dangerouslySetInnerHTML={renderHTML(modelAnswer)} />
              ) : (
                <p>이 질문에 대한 모범 답변이 준비되지 않았습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
