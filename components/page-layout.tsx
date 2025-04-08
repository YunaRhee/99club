import type React from "react"
import Sidebar from "@/components/sidebar"

interface PageLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: React.ReactNode
}

export default function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row gap-12">
        {/* 사이드바 - 모바일에서는 숨김, 데스크톱에서만 표시 */}
        <div className="hidden md:block md:w-64 lg:w-72 shrink-0">
          <Sidebar />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 max-w-3xl">
          {(title || subtitle) && (
            <div className="flex justify-between items-center mb-6">
              {title && <h1 className="text-2xl md:text-3xl font-bold text-hanghae-text">{title}</h1>}
              {subtitle && <div className="text-sm text-hanghae-text/70">{subtitle}</div>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
