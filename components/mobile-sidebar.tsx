"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // 모바일이 아닐 경우 렌더링하지 않음
  if (!isMobile) return null

  // 사이드바 토글
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // 사이드바 닫기
  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar} aria-label="메뉴 열기">
        <Menu className="h-6 w-6" />
      </Button>

      {/* 오버레이 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeSidebar} />}

      {/* 사이드바 */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-3/4 max-w-xs bg-hanghae-black border-l border-hanghae-light transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-hanghae-light">
          <h2 className="text-lg font-bold">메뉴</h2>
          <Button variant="ghost" size="icon" onClick={closeSidebar} aria-label="메뉴 닫기">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 사이드바 내용 */}
        <div className="p-4 space-y-6">
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center py-3 px-4 transition-colors hover:bg-hanghae-light ${pathname === "/" ? "border-l-4 border-main-red bg-hanghae-light" : ""}`}
              onClick={closeSidebar}
            >
              <span>오늘의 질문</span>
            </Link>

            <Link
              href="/questions"
              className={`flex items-center py-3 px-4 transition-colors hover:bg-hanghae-light ${pathname.startsWith("/questions") ? "border-l-4 border-main-red bg-hanghae-light" : ""}`}
              onClick={closeSidebar}
            >
              <span>지난 면접 질문</span>
            </Link>

            <Link
              href="/my-records"
              className={`flex items-center py-3 px-4 transition-colors hover:bg-hanghae-light ${pathname.startsWith("/my-records") ? "border-l-4 border-main-red bg-hanghae-light" : ""}`}
              onClick={closeSidebar}
            >
              <span>챌린지 기록 보기</span>
            </Link>

            <a
              href="https://99club-challenge-guide.oopy.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 px-4 hover:bg-hanghae-light transition-colors"
              onClick={closeSidebar}
            >
              <span>가이드 보기</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* 배너 - 링크 업데이트 */}
          <div className="mt-6">
            <a
              href="https://99clubarticle.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-[65px] rounded-[16px] border border-main-dark-red bg-hanghae-light/50 flex items-center justify-center transition-colors hover:bg-hanghae-light"
              onClick={closeSidebar}
            >
              <span className="text-sm font-medium">오늘의 아티클 보러 가기</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
