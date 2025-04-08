"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getUserActivity, getGreeting } from "@/lib/user-activity"

export function UserStats() {
  const { user } = useAuth()
  const [profileIcon, setProfileIcon] = useState("🐦")
  const [greeting, setGreeting] = useState("")
  const [stats, setStats] = useState({
    answeredQuestions: 0,
    readQuestions: 0,
    consecutiveDays: 0,
  })

  useEffect(() => {
    if (!user?.userId) return

    // 사용자 활동 정보 가져오기
    const activity = getUserActivity(user.userId)
    setProfileIcon(activity.profileIcon || "🐦")

    // 인사말 설정
    setGreeting(getGreeting(user.userId, user.nickname))

    setStats({
      answeredQuestions: activity.answeredQuestions.length,
      readQuestions: activity.readQuestions.length,
      consecutiveDays: activity.consecutiveDays,
    })
  }, [user?.userId, user?.nickname])

  if (!user) return null

  return (
    <Card className="bg-hanghae-light border-[#3a3e41] border-[1px]">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-main-red rounded-full p-2 flex items-center justify-center w-10 h-10">
            <span className="text-lg">{profileIcon}</span>
          </div>
          <div>
            <p className="font-medium">{greeting}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="font-bold text-white">{stats.answeredQuestions}</p>
            <p className="text-xs text-hanghae-text/70">답변한 질문</p>
          </div>
          <div>
            <p className="font-bold text-white">{stats.readQuestions}</p>
            <p className="text-xs text-hanghae-text/70">읽은 질문</p>
          </div>
          <div>
            <p className="font-bold text-white">{stats.consecutiveDays}</p>
            <p className="text-xs text-hanghae-text/70">연속 활동일</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
