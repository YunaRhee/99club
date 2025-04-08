import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PopularQuestions() {
  // 실제 구현에서는 API에서 데이터를 가져와야 합니다
  const popularQuestions = [
    { id: "q1", title: "자바스크립트 클로저란 무엇인가요?", day: 1 },
    { id: "q2", title: "React의 가상 DOM이 작동하는 방식은?", day: 2 },
    { id: "q3", title: "RESTful API 설계 원칙에 대해 설명해주세요.", day: 3 },
  ]

  return (
    <Card className="bg-hanghae-gray border-hanghae-light">
      <CardHeader className="bg-main-red text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          인기 질문
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-2">
          {popularQuestions.map((question) => (
            <li key={question.id}>
              <Link
                href={`/questions/${question.id}`}
                className="text-sm hover:text-main-red transition-colors block p-2 rounded-md hover:bg-hanghae-light"
              >
                <div className="flex justify-between">
                  <span>{question.title}</span>
                  <span className="text-xs text-hanghae-text/70">Day {question.day}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
