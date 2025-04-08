import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import ContactButton from "@/components/contact-button"

// 11. 페이지 이름 변경
export const metadata: Metadata = {
  title: "항해99 - 1일 1면접 챌린지",
  description: "매일 하나의 개발자 면접 질문에 답변하고 성장하세요",
  icons: {
    icon: "https://static.spartacodingclub.kr/hanghae99/product/payment%20thumb.png?v=1734962169000",
    shortcut: "https://static.spartacodingclub.kr/hanghae99/product/payment%20thumb.png?v=1734962169000",
    apple: "https://static.spartacodingclub.kr/hanghae99/product/payment%20thumb.png?v=1734962169000",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-hanghae-black">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Toaster />
              <ContactButton />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'