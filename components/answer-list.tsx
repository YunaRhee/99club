import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Answer } from "@/lib/answers"

interface AnswerListProps {
  answers: Answer[]
}

export default function AnswerList({ answers }: AnswerListProps) {
  if (answers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">아직 공개된 답변이 없습니다</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">첫 번째 답변을 작성해보세요!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {answers.map((answer) => (
        <Card key={answer.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{answer.nickname}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(answer.timestamp).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{answer.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
