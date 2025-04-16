"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import PageLayout from "@/components/page-layout"
import { formatDateShort } from "@/lib/utils"
import { getAnswersByQuestionId } from "@/lib/answers"
import AnswerList from "@/components/answer-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function QuestionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [publicAnswers, setPublicAnswers] = useState<any[]>([])
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  // 하드코딩된 질문들 사용
  const questions = [
    {
      id: "q1",
      title: "자바스크립트에서 클로저(Closure)란 무엇인가요?",
      content:
        "자바스크립트의 클로저(Closure)에 대해 설명하고, 이것이 어떻게 활용될 수 있는지 예제와 함께 설명해주세요.",
      date: "2024-04-08",
      category: "Frontend",
      hint: "함수와 그 함수가 선언된 렉시컬 환경과의 조합을 생각해보세요.",
      modelAnswer:
        "클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합입니다. 내부함수가 외부함수의 변수에 접근할 수 있는 것을 말합니다. 이를 통해 데이터 은닉, 캡슐화, 팩토리 함수 등을 구현할 수 있습니다. 예를 들어, 카운터 함수를 만들 때 클로저를 활용하면 내부 상태를 외부에서 직접 접근하지 못하게 보호할 수 있습니다.",
      days: 1,
    },
    {
      id: "q2",
      title: "RESTful API의 설계 원칙은 무엇인가요?",
      content: "RESTful API를 설계할 때 고려해야 할 주요 원칙들에 대해 설명하고, 좋은 RESTful API의 예시를 들어주세요.",
      date: "2024-04-09",
      category: "Backend",
      hint: "자원(Resource), 행위(Verb), 표현(Representation)의 개념을 고려해보세요.",
      modelAnswer:
        "RESTful API 설계의 주요 원칙은 1) 자원 기반 구조(URI로 자원 표현), 2) HTTP 메서드를 통한 행위 표현(GET, POST, PUT, DELETE), 3) 무상태성(Stateless), 4) 캐시 가능성, 5) 계층화된 시스템, 6) 통일된 인터페이스입니다. 좋은 예시로는 GitHub API가 있으며, 자원을 명확히 표현하고 적절한 HTTP 메서드를 사용합니다.",
      days: 2,
    },
    // 다른 질문들은 간략화를 위해 생략합니다...
  ]

  // 카테고리별 필터링된 질문 목록
  const filteredQuestions =
    selectedCategory === "all" ? questions : questions.filter((q) => q.category === selectedCategory)

  // 질문 클릭 핸들러
  const handleQuestionClick = async (question: any) => {
    setSelectedQuestion(question)
    setIsModalOpen(true)
    setShowModelAnswer(false) // 모달 열 때마다 모범 답변 상태 초기화

    // 공개된 답변 가져오기
    setIsLoadingAnswers(true)
    try {
      const answers = await getAnswersByQuestionId(question.id, true)
      setPublicAnswers(answers)
    } catch (error) {
      console.error("답변 가져오기 오류:", error)
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  // 모범 답변 표시 가능 여부 확인
  const canShowModelAnswer = (questionDay: number) => {
    // Day 6 질문은 오늘 저녁 8시 이후에만 공개
    if (questionDay === 7) {
      const now = new Date()
      const today8PM = new Date()
      today8PM.setHours(20, 0, 0, 0) // 오늘 저녁 8시

      return now >= today8PM
    }

    // Day 1~5 질문은 항상 모범 답변 표시 가능
    return questionDay >= 1 && questionDay <= 6
  }

  // HTML 문자열을 안전하게 렌더링하는 함수
  const renderHTML = (htmlString: string) => {
    return { __html: htmlString || "" }
  }

  // 모범 답변 공개까지 남은 시간 계산
  const getRemainingTimeText = () => {
    const now = new Date()
    const today8PM = new Date()
    today8PM.setHours(20, 0, 0, 0) // 오늘 저녁 8시

    if (now >= today8PM) {
      return "곧 공개됩니다"
    }

    const diffMs = today8PM.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHours}시간 ${diffMinutes}분 후 공개`
  }

  return (
    <PageLayout
      title="지난 면접 질문"
      subtitle={
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-hanghae-gray text-hanghae-text border-hanghae-light hover:cursor-pointer">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent className="bg-hanghae-gray text-hanghae-text border-hanghae-light">
            <SelectItem value="all" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              전체
            </SelectItem>
            <SelectItem value="공통" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              공통
            </SelectItem>
            <SelectItem value="Backend" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              Backend
            </SelectItem>
            <SelectItem value="Frontend" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              Frontend
            </SelectItem>
            <SelectItem value="인성" className="hover:cursor-pointer hover:bg-hanghae-light/80">
              인성
            </SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card
            key={question.id}
            className="bg-hanghae-gray border-[#3a3e41] border-[1px] cursor-pointer hover:border-main-red transition-colors"
            onClick={() => handleQuestionClick(question)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{question.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text">
                  Day {question.days || 1}
                </Badge>
                <Badge
                  className={
                    question.category === "Frontend"
                      ? "bg-[#4A6EB0] hover:bg-[#4A6EB0]/90 text-white"
                      : question.category === "Backend"
                        ? "bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
                        : question.category === "공통"
                          ? "bg-[#9370DB] hover:bg-[#9370DB]/90 text-white"
                          : "bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
                  }
                >
                  {question.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(question.date)}</p>
              <p className="text-hanghae-text line-clamp-2">{question.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 질문 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" style={{ wordBreak: "break-all" }}>
          {selectedQuestion && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedQuestion.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-hanghae-light text-hanghae-text">Day {selectedQuestion.days || 1}</Badge>
                  <Badge
                    className={
                      selectedQuestion.category === "Frontend"
                        ? "bg-[#4A6EB0] text-white"
                        : selectedQuestion.category === "Backend"
                          ? "bg-[#6B8E23] text-white"
                          : selectedQuestion.category === "공통"
                            ? "bg-[#9370DB] text-white"
                            : "bg-[#FF8C00] text-white"
                    }
                  >
                    {selectedQuestion.category}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="mt-4">
                <p className="text-sm text-hanghae-text/70 mb-2">{formatDateShort(selectedQuestion.date)}</p>
                <p className="text-hanghae-text whitespace-pre-wrap break-all">{selectedQuestion.content}</p>

                {selectedQuestion.hint && (
                  <div className="mt-4 p-4 bg-hanghae-light rounded-md">
                    <h3 className="text-sm font-medium mb-1">힌트</h3>
                    <p className="text-sm text-hanghae-text/70 whitespace-pre-wrap break-all">
                      {selectedQuestion.hint}
                    </p>
                  </div>
                )}
              </div>

              {/* 모범 답변 토글 */}
              {selectedQuestion.modelAnswer && (
                <div className="mt-6">
                  <div
                    className={`bg-[#3a3e41] rounded-[16px] p-4 flex justify-between items-center cursor-pointer h-[70px] ${
                      !canShowModelAnswer(selectedQuestion.days) ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (canShowModelAnswer(selectedQuestion.days)) {
                        setShowModelAnswer(!showModelAnswer)
                      }
                    }}
                  >
                    <div className="text-hanghae-text">
                      {canShowModelAnswer(selectedQuestion.days)
                        ? "모범 답변이 공개되었어요."
                        : "모범 답변이 저녁 8시에 공개돼요."}
                    </div>
                    <div className="text-hanghae-text/70 flex items-center">
                      {canShowModelAnswer(selectedQuestion.days) ? (
                        <>
                          확인하기{" "}
                          {showModelAnswer ? (
                            <ChevronDown className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronRight className="h-4 w-4 ml-1" />
                          )}
                        </>
                      ) : (
                        getRemainingTimeText()
                      )}
                    </div>
                  </div>

                  {/* 모범 답변 내용 */}
                  {showModelAnswer && canShowModelAnswer(selectedQuestion.days) && (
                    <Card className="mt-4 bg-hanghae-gray border-[#3a3e41] border-[1px]">
                      <CardContent className="pt-4">
                        <div className="prose dark:prose-invert max-w-none text-hanghae-text">
                          <div dangerouslySetInnerHTML={renderHTML(selectedQuestion.modelAnswer)} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">공개된 답변</h2>
                {isLoadingAnswers ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-pulse text-hanghae-text">답변을 불러오는 중...</div>
                  </div>
                ) : (
                  <AnswerList answers={publicAnswers} />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
