"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nickname: "",
    phone: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 필수 필드 검증
      if (!formData.nickname || !formData.phone || !formData.password) {
        throw new Error("모든 필수 항목을 입력해주세요.")
      }

      // 전화번호 마지막 4자리 검증
      if (!/^\d{4}$/.test(formData.phone)) {
        throw new Error("전화번호 마지막 4자리를 입력해주세요.")
      }

      // 실제로는 API 호출을 통해 로그인 처리
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 성공 시 홈페이지로 리다이렉트
      router.push("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-10 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>닉네임과 전화번호 마지막 4자리, 비밀번호를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">전화번호 마지막 4자리</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="전화번호 마지막 4자리"
                maxLength={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">아직 계정이 없으신가요?</p>
          <Link href="/register" className="text-sm text-primary hover:underline">
            회원가입
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
