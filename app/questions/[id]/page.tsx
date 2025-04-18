import { getQuestionById } from "@/lib/questions"
import QuestionCard from "@/components/question-card"
import AnswerForm from "@/components/answer-form"
import { getAnswersByQuestionId } from "@/lib/answers"
import AnswerList from "@/components/answer-list"
import { notFound } from "next/navigation"
import PageLayout from "@/components/page-layout"

// 서버 컴포넌트로 변경하고 params를 Promise로 처리
export default async function QuestionPage({
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

  // 공개된 답변 가져오기
  const publicAnswers = await getAnswersByQuestionId(id, true)

  return (
    <PageLayout>
      <QuestionCard question={question} category={question.category} />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">답변 작성하기</h2>
        <AnswerForm questionId={question.id} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">공개된 답변</h2>
        <AnswerList answers={publicAnswers} />
      </div>
    </PageLayout>
  )
}
