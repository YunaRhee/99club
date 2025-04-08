"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getDailyQuote } from "@/lib/quotes"
import MobileSidebar from "@/components/mobile-sidebar"

export default function Navigation() {
  const pathname = usePathname()
  const [quote, setQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    setQuote(getDailyQuote())
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hanghae-light bg-hanghae-black">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center">
            <Image
              src="https://hanghae99.spartacodingclub.kr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.6f8c4c39.png&w=96&q=75"
              alt="항해99"
              width={96}
              height={24}
            />
          </Link>
          <span className="hidden md:block text-sm text-hanghae-text">
            "{quote.text}" - {quote.author}
          </span>
        </div>

        {/* 모바일 햄버거 메뉴 */}
        <MobileSidebar />
      </div>
    </header>
  )
}
