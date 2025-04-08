"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ModelAnswerProps {
  modelAnswer: string
}

export default function ModelAnswer({ modelAnswer }: ModelAnswerProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [canView, setCanView] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const releaseHour = 20 // 저녁 8시

      if (now.getHours() >= releaseHour) {
        setCanView(true)
        setTimeRemaining("")
      } else {
        setCanView(false)

        // 남은 시간 계산 (hh:mm:ss 형식)
        const targetTime = new Date(now)
        targetTime.setHours(releaseHour, 0, 0, 0)

        const diffMs = targetTime.getTime() - now.getTime()
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        setTimeRemaining(
          `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`,
        )
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 1000) // 1초마다 체크

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-6">
      <div
        className="bg-[#3a3e41] rounded-[16px] p-4 flex justify-between items-center cursor-pointer h-[70px]"
        onClick={() => canView && setShowAnswer(!showAnswer)}
      >
        <div className="text-hanghae-text">
          {canView ? "모범 답변이 공개되었어요." : `모범 답변이 저녁 8시에 공개돼요.`}
        </div>
        <div className="text-hanghae-text/70 flex items-center">
          {canView ? (
            <>
              확인하기 <ChevronRight className="h-4 w-4 ml-1" />
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
              <p>{modelAnswer || "이 질문에 대한 모범 답변이 준비되지 않았습니다."}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
