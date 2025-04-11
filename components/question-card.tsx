"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Question } from "@/lib/questions"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: Question
  category: string
  onConfirmRead?: (category: string) => void
}

export default function QuestionCard({ question, category, onConfirmRead }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load the button state from local storage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageKey = `question_read_${question.id}_${category}`
      const storedState = localStorage.getItem(storageKey)
      if (storedState === "true") {
        setIsConfirmed(true)
        // 이미 확인된 질문이면 부모 컴포넌트에도 알림
        if (onConfirmRead) {
          onConfirmRead(category)
        }
      }
      setIsLoaded(true)
    }
  }, [question.id, category, onConfirmRead])

  // 카테고리별 배지 색상 설정
  const getBadgeClass = () => {
    switch (category) {
      case "Frontend":
        return "bg-[#4A6EB0] hover:bg-[#4A6EB0]/90 text-white"
      case "Backend":
        return "bg-[#6B8E23] hover:bg-[#6B8E23]/90 text-white"
      case "공통":
        return "bg-[#9370DB] hover:bg-[#9370DB]/90 text-white"
      case "인성":
        return "bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white"
      default:
        return "bg-hanghae-light hover:bg-hanghae-light/90 text-hanghae-text"
    }
  }

  // 질문을 읽었을 때 기록 - Save to local storage with animation
  const handleConfirmRead = () => {
    if (isConfirmed) return

    // Trigger animation
    setIsAnimating(true)

    // Set confirmed state after a short delay
    setTimeout(() => {
      setIsConfirmed(true)
      setIsAnimating(false)

      // Save to localStorage
      if (typeof window !== "undefined") {
        const storageKey = `question_read_${question.id}_${category}`
        localStorage.setItem(storageKey, "true")
      }

      // Notify parent component
      if (onConfirmRead) {
        onConfirmRead(category)
      }
    }, 600) // Animation duration
  }

  return (
    <Card className="mb-6 bg-hanghae-gray text-hanghae-text border-[#3a3e41] border-[1px]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{question.title}</CardTitle>
          <Badge className={getBadgeClass()}>{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none text-hanghae-text">
          <p>{question.content}</p>

          {question.hint && (
            <div className="mt-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center text-sm font-medium mb-1 text-[#87CEEB]/80 hover:text-[#87CEEB]"
              >
                {showHint ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                힌트 {showHint ? "접기" : "보기"}
              </button>

              {showHint && (
                <div className="p-4 bg-hanghae-light rounded-md">
                  <p className="text-sm text-hanghae-text">{question.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleConfirmRead}
          className={cn(
            "h-[52px] rounded-[999px] transition-all duration-500 relative overflow-hidden px-6",
            isLoaded && (isConfirmed ? "bg-white text-black hover:bg-white/90" : "bg-main-red hover:bg-main-red/90"),
            !isLoaded && "opacity-0",
            isAnimating && "scale-105",
          )}
          disabled={isConfirmed}
        >
          {isAnimating && <span className="absolute inset-0 bg-white/30 animate-pulse"></span>}
          <span className={cn("relative z-10", isAnimating && "animate-bounce")}>
            {isConfirmed ? "답변을 작성해 보세요!" : "질문을 확인했어요!"}
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}
