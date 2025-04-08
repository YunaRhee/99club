"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Check, X, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface AnswerFormProps {
  questionId: string
  category?: string // Add category prop
}

export default function AnswerForm({ questionId, category = "Frontend" }: AnswerFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("frontend")

  // Current answer state
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [savedAnswer, setSavedAnswer] = useState<any>(null)

  // Helper function to map category to tab
  const mapCategoryToTab = (category: string) => {
    switch (category) {
      case "Frontend":
        return "frontend"
      case "Backend":
        return "backend"
      case "공통":
        return "common"
      case "인성":
        return "personality"
      default:
        return "frontend"
    }
  }

  // Helper function to map tab to category
  const mapTabToCategory = (tab: string) => {
    switch (tab) {
      case "frontend":
        return "Frontend"
      case "backend":
        return "Backend"
      case "common":
        return "공통"
      case "personality":
        return "인성"
      default:
        return "Frontend"
    }
  }

  // Set active tab based on category prop
  useEffect(() => {
    if (category) {
      setActiveTab(mapCategoryToTab(category))
    }
  }, [category])

  // 로컬 스토리지 관련 함수 추가
  const saveAnswerToLocalStorage = (questionId: string, category: string, answerData: any) => {
    if (typeof window === "undefined") return

    const storageKey = `answer_${questionId}_${category}`

    // Add timestamp for 24-hour expiration
    const dataWithExpiry = {
      ...answerData,
      timestamp: new Date().getTime(),
      expiryTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 24 hours
    }

    localStorage.setItem(storageKey, JSON.stringify(dataWithExpiry))
  }

  const getAnswerFromLocalStorage = (questionId: string, category: string) => {
    if (typeof window === "undefined") return null

    const storageKey = `answer_${questionId}_${category}`
    const savedData = localStorage.getItem(storageKey)

    if (!savedData) return null

    const parsedData = JSON.parse(savedData)

    // Check if the data has expired (24 hours)
    if (parsedData.expiryTime && parsedData.expiryTime < new Date().getTime()) {
      // Data has expired, remove it
      localStorage.removeItem(storageKey)
      return null
    }

    return parsedData
  }

  // Load user info from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserInfo = localStorage.getItem("user_info")
      if (savedUserInfo) {
        const userInfo = JSON.parse(savedUserInfo)
        setNickname(userInfo.nickname || "")
        setPhone(userInfo.password || "")
      }
    }
  }, [])

  // Monitor tab changes from parent component
  useEffect(() => {
    // 현재 활성화된 탭 찾기
    const tabLinks = document.querySelectorAll('[data-state="active"][role="tab"]')
    if (tabLinks.length > 0) {
      const activeTabValue = tabLinks[0].getAttribute("data-value") || "frontend"
      if (activeTabValue !== activeTab) {
        setActiveTab(activeTabValue)
      }
    }

    // 탭 변경 이벤트 리스너 추가
    const handleTabChange = () => {
      const activeTabElement = document.querySelector('[data-state="active"][role="tab"]')
      if (activeTabElement) {
        const newActiveTab = activeTabElement.getAttribute("data-value") || "frontend"
        if (newActiveTab !== activeTab) {
          setActiveTab(newActiveTab)
        }
      }
    }

    // MutationObserver를 사용하여 DOM 변경 감지
    const observer = new MutationObserver(handleTabChange)
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    })

    return () => observer.disconnect()
  }, [activeTab])

  // Load answer when tab/category changes
  useEffect(() => {
    const fetchSavedAnswer = async () => {
      if (!questionId) return

      // Get current category
      const currentCategory = mapTabToCategory(activeTab)

      // Reset state for new category
      setContent("")
      setIsPublic(true)
      setSavedAnswer(null)

      // Try to load from local storage first
      const localAnswer = getAnswerFromLocalStorage(questionId, currentCategory)
      if (localAnswer) {
        setContent(localAnswer.content || "")
        setIsPublic(localAnswer.isPublic !== false)
        setSavedAnswer(localAnswer)
        return
      }

      // If not in local storage and user is logged in, try API
      if (nickname) {
        try {
          const response = await fetch(
            `/api/answers?questionId=${questionId}&nickname=${encodeURIComponent(nickname)}`,
            {
              cache: "no-store",
              next: { revalidate: 0 },
            },
          )

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.data && data.data.length > 0) {
              // Find answer for current category
              const matchingAnswer = data.data.find((answer) => {
                return currentCategory === answer.category
              })

              if (matchingAnswer) {
                setContent(matchingAnswer.content || "")
                setIsPublic(matchingAnswer.isPublic !== false)
                setSavedAnswer(matchingAnswer)

                // Save to local storage
                saveAnswerToLocalStorage(questionId, currentCategory, matchingAnswer)
              }
            }
          }
        } catch (error) {
          console.error("답변 가져오기 오류:", error)
        }
      }
    }

    fetchSavedAnswer()
  }, [questionId, nickname, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      toast({
        title: "입력 오류",
        description: "이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!phone.trim()) {
      toast({
        title: "입력 오류",
        description: "전화번호 뒤 4자리를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "입력 오류",
        description: "답변 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save user info to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_info", JSON.stringify({ nickname, password: phone }))
      }

      // Map category - 현재 선택된 탭에 따라 카테고리 결정
      const currentCategory = mapTabToCategory(activeTab)

      // API call
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: `user_${Date.now()}`,
          questionId,
          category: currentCategory, // 선택된 카테고리 전달
          nickname,
          password: phone,
          content,
          isPublic,
          answerId: savedAnswer?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "답변 저장 중 오류가 발생했습니다.")
      }

      toast({
        title: savedAnswer ? "답변 수정 완료" : "답변 제출 완료",
        description: "답변이 성공적으로 저장되었습니다.",
      })

      const updatedAnswer = {
        id: savedAnswer?.id || data.answerId,
        content,
        isPublic,
        timestamp: new Date().toISOString(),
        category: currentCategory,
        nickname,
      }

      // Save to local storage
      saveAnswerToLocalStorage(questionId, currentCategory, updatedAnswer)

      // Update state
      setSavedAnswer(updatedAnswer)
      setIsEditing(false)
    } catch (error) {
      console.error("답변 제출 오류:", error)
      toast({
        title: "오류 발생",
        description: error.message || "답변 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Content change handler
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  // isPublic change handler
  const handleIsPublicChange = (checked: boolean) => {
    setIsPublic(checked)
  }

  // 렌더링
  return (
    <div className="bg-hanghae-gray border-[#3a3e41] border-[1px] rounded-lg p-4 text-hanghae-text">
      {savedAnswer && !isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">내 답변</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 rounded-full">
              <Edit2 className="h-4 w-4" />
              <span className="sr-only">수정하기</span>
            </Button>
          </div>
          <div className="bg-hanghae-light p-4 rounded-md whitespace-pre-wrap">{savedAnswer.content}</div>
          <div className="flex items-center text-sm text-hanghae-text/70">
            <span className="mr-2">공개 여부:</span>
            <span>{savedAnswer.isPublic ? "공개" : "비공개"}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">이름 *실명으로 작성해 주세요.</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-hanghae-light border-0 text-hanghae-text"
              placeholder="이름을 입력해 주세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">전화번호 뒤 4자리</Label>
            <Input
              id="password"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-hanghae-light border-0 text-hanghae-text"
              placeholder="전화번호 뒤 4자리를 입력해 주세요"
              required
            />
          </div>

          <Textarea
            placeholder="나는 이 질문에 어떻게 답변할 수 있을까요? 답변 키워드나 구조만 메모해도 좋아요."
            value={content}
            onChange={handleContentChange}
            className="min-h-[150px] bg-hanghae-light border-0 text-hanghae-text"
            required
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="public-answer"
              checked={isPublic}
              onCheckedChange={handleIsPublicChange}
              className={isPublic ? "bg-[#8AE65C]" : "bg-[#555555]"}
            />
            <Label htmlFor="public-answer">내 답변 공개하기</Label>
          </div>

          {isEditing ? (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  setIsEditing(false)
                  // Reset to saved content
                  if (savedAnswer) {
                    setContent(savedAnswer.content || "")
                    setIsPublic(savedAnswer.isPublic !== false)
                  }
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">취소</span>
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 text-white" />
                <span className="sr-only">저장</span>
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              className="w-full h-[52px] bg-main-red hover:bg-main-red/90 rounded-[999px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "답변 제출하기"}
            </Button>
          )}
        </form>
      )}
    </div>
  )
}
