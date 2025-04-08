"use client"

import { useState, useEffect } from "react"

export default function ActivityCalendar() {
  const [calendar, setCalendar] = useState<{ date: Date; hasActivity: boolean }[]>([])

  useEffect(() => {
    // 10일간의 챌린지 데이터 생성
    const today = new Date()
    const startDate = new Date(2024, 3, 8) // 2024년 4월 8일 시작

    const days: { date: Date; hasActivity: boolean }[] = []
    const currentDate = new Date(startDate)

    // 10일간의 데이터만 생성
    for (let i = 0; i < 10; i++) {
      // 임의의 활동 데이터 생성 (실제로는 API에서 가져와야 함)
      const hasActivity = Math.random() > 0.3
      days.push({
        date: new Date(currentDate),
        hasActivity,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setCalendar(days)
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-10 gap-2">
        {calendar.map((day, index) => (
          <div key={day.date.toISOString()} className="text-center">
            <div
              className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full
                ${day.hasActivity ? "bg-main-red text-white" : "bg-muted/50"}`}
              title={day.date.toLocaleDateString()}
            >
              {index + 1}
            </div>
            <div className="text-xs mt-1">
              {day.date.getMonth() + 1}/{day.date.getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-main-red"></div>
          <span>활동함</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-muted/50"></div>
          <span>활동 없음</span>
        </div>
      </div>
    </div>
  )
}
