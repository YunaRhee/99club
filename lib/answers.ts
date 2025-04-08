export interface Answer {
  id: string
  questionId: string
  nickname: string
  phone: string
  content: string
  timestamp: string
  isPublic: boolean
  category?: string
}

// 특정 질문의 답변 목록 가져오기
export async function getAnswersByQuestionId(questionId: string, publicOnly = false): Promise<Answer[]> {
  try {
    const response = await fetch(`/api/answers?questionId=${questionId}&publicOnly=${publicOnly}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      // Sort answers by timestamp, most recent first
      return data.data.sort((a: Answer, b: Answer) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

    return []
  } catch (error) {
    console.error("답변 목록 가져오기 오류:", error)
    return []
  }
}

// 특정 사용자의 답변 목록 가져오기
export async function getAnswersByNickname(nickname: string): Promise<Answer[]> {
  try {
    const response = await fetch(`/api/answers?nickname=${encodeURIComponent(nickname)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error("답변 목록 가져오기 오류:", error)
    return []
  }
}
