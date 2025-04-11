import { getQuestionById } from "@/lib/questions"
import AnswerForm from "@/components/answer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"

// 서버 컴포넌트로 변경하고 params를 Promise로 처리
export default async function AnswerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // params를 await로 처리
  const { id } = await params

  const question = await getQuestionById(id)

  if (!question) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-6 px-4 md:py-10">
      <Link href={`/questions/${id}`} className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        ← 질문으로 돌아가기
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{question.title}</CardTitle>
              <CardDescription>
                {new Date(question.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Badge>{question.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert">
            <p>{question.content}</p>
            {question.hint && (
              <div className="mt-4 p-4 bg-muted/50 rounded-md">
                <h3 className="text-sm font-medium mb-1">힌트</h3>
                <p className="text-sm text-muted-foreground">{question.hint}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">답변 작성하기</h2>
      <AnswerForm questionId={id} />
    </div>
  )
}
