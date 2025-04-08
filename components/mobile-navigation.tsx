"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function MobileNavigation() {
  const pathname = usePathname()
  const isMobile = useMobile()

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">오늘의 질문</span>
        </Link>
        <Link
          href="/questions"
          className={`flex flex-col items-center justify-center w-full h-full ${pathname === "/questions" || pathname.startsWith("/questions/") ? "text-primary" : "text-muted-foreground"}`}
        >
          <List className="h-5 w-5" />
          <span className="text-xs mt-1">질문 모음</span>
        </Link>
      </div>
    </div>
  )
}
