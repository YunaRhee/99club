"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserLoginDialog } from "@/components/user-login-dialog"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getUserActivity } from "@/lib/user-activity"
import PageLayout from "@/components/page-layout"

export default function MyRecordsPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    answeredQuestions: 0,
    readQuestions: 0,
    consecutiveDays: 0,
  })

  // 실제 사용자 활동 데이터 가져오기
  useEffect(() => {
    if (!user?.nickname || !user?.phone) return

    const activity = getUserActivity(user.nickname, user.phone)
    setStats({
      answeredQuestions: activity.answeredQuestions.length,
      readQuestions: activity.readQuestions.length,
      consecutiveDays: activity.consecutiveDays,
    })
  }, [user?.nickname, user?.phone])

  // 샘플 캘린더 데이터
  const calendarData = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(2025, 3, i + 1)
    return {
      date: date.toISOString().split("T")[0],
      hasActivity: Math.random() > 0.3,
      day: i + 1,
    }
  })

  // 샘플 질문 데이터
  const sampleQuestion = {
    id: "q1",
    title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
    content: "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
    category: "Frontend",
    hint: "함수와 그 함수가 선언된 렉시컬 환경과의 조합을 생각해보세요.",
  }

  // 샘플 답변 데이터
  const sampleAnswer = {
    content:
      "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부함수가 외부함수의 변수에 접근할 수 있는 것을 말합니다.",
    timestamp: "2025-04-01T12:00:00Z",
    isPublic: true,
  }

  const handleDateClick = (date: string, day: number) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  if (!user) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-hanghae-text">나의 기록</h1>
          <Card className="bg-hanghae-gray border-[#3a3e41] border-[1px]">
            <CardContent className="py-8">
              <p className="mb-4 text-hanghae-text/70">기록을 확인하려면 로그인이 필요합니다.</p>
              <UserLoginDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <PageLayout title="나의 기록">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-hanghae-gray border-[#3a3e41] border-[1px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-hanghae-text">답변한 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.answeredQuestions}개</p>
          </CardContent>
        </Card>

        <Card className="bg-hanghae-gray border-[#3a3e41] border-[1px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-hanghae-text">읽은 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.readQuestions}개</p>
          </CardContent>
        </Card>

        <Card className="bg-hanghae-gray border-[#3a3e41] border-[1px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-hanghae-text">연속 활동일</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.consecutiveDays}일</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-hanghae-gray border-[#3a3e41] border-[1px]">
        <CardHeader>
          <CardTitle className="text-hanghae-text">활동 캘린더</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-10 gap-2">
              {calendarData.map((day) => (
                <div key={day.date} className="text-center">
                  <button
                    onClick={() => handleDateClick(day.date, day.day)}
                    className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full
                      ${day.hasActivity ? "bg-main-red text-white" : "bg-hanghae-light text-hanghae-text/70"}`}
                    title={day.date}
                  >
                    {day.day}
                  </button>
                  <div className="text-xs mt-1 text-hanghae-text/70">
                    {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-main-red"></div>
                <span className="text-hanghae-text">활동함</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-hanghae-light"></div>
                <span className="text-hanghae-text/70">활동 없음</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 날짜 클릭 시 모달 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Day {selectedDate ? new Date(selectedDate).getDate() : ""} -
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
                : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="prose dark:prose-invert max-w-none text-hanghae-text">
              <h3 className="text-lg font-medium">{sampleQuestion.title}</h3>
              <p>{sampleQuestion.content}</p>
            </div>

            {/* 내 답변 */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">내 답변</h3>
              <div className="bg-hanghae-light p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{user.nickname}</span>
                  <span className="text-xs text-hanghae-text/70">
                    {new Date(sampleAnswer.timestamp).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-sm">{sampleAnswer.content}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
