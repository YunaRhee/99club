"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Link
          href="/"
          className={`flex items-center py-3 px-4 transition-colors hover:bg-hanghae-light ${pathname === "/" ? "border-l-4 border-main-red bg-hanghae-light" : ""}`}
        >
          <span>오늘의 질문</span>
        </Link>

        <Link
          href="/questions"
          className={`flex items-center py-3 px-4 transition-colors hover:bg-hanghae-light ${pathname.startsWith("/questions") ? "border-l-4 border-main-red bg-hanghae-light" : ""}`}
        >
          <span>지난 면접 질문</span>
        </Link>

        <a
          href="https://99club-challenge-guide.oopy.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-3 px-4 hover:bg-hanghae-light transition-colors"
        >
          <span>가이드 보기</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Separated banner with specific height and margin */}
      <div className="mt-20">
        <a
          href="#"
          className="block w-full h-[65px] rounded-[16px] border border-main-dark-red bg-hanghae-light/50 flex items-center justify-center transition-colors hover:bg-hanghae-light"
        >
          <span className="text-sm font-medium">오늘의 아티클 보러 가기</span>
        </a>
      </div>
    </div>
  )
}
