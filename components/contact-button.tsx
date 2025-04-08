"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactButton() {
  const handleClick = () => {
    window.open("https://open.kakao.com/o/sVhR8zhg", "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        size="icon"
        className="h-12 w-12 rounded-full bg-main-red hover:bg-main-red/90 shadow-lg shadow-main-red/30 transition-all duration-300 hover:scale-105"
        aria-label="문의하기"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </div>
  )
}
