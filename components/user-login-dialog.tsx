"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function UserLoginDialog() {
  const [open, setOpen] = useState(false)
  const [nickname, setNickname] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!nickname || !phone || !password) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!/^\d{4}$/.test(phone)) {
      toast({
        title: "입력 오류",
        description: "전화번호는 마지막 4자리 숫자만 입력해주세요.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // 중복 체크
      const response = await fetch(
        `/api/users/check?nickname=${encodeURIComponent(nickname)}&phone=${encodeURIComponent(phone)}`,
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "로그인 중 오류가 발생했습니다.")
      }

      if (data.exists) {
        // 이미 존재하는 사용자 - 로그인 처리
        const success = await login(nickname, phone, password)
        if (success) {
          setOpen(false)
          toast({
            title: "로그인 성공",
            description: `${nickname}님, 환영합니다!`,
            className: "bg-white border border-gray-200",
          })
        } else {
          toast({
            title: "로그인 실패",
            description: "비밀번호가 일치하지 않습니다.",
            variant: "destructive",
            className: "bg-white border border-gray-200",
          })
        }
      } else {
        // 새 사용자 - 회원가입 처리
        const success = await login(nickname, phone, password, true)
        if (success) {
          setOpen(false)
          toast({
            title: "회원가입 성공",
            description: `${nickname}님, 환영합니다!`,
            className: "bg-white border border-gray-200",
          })
        } else {
          toast({
            title: "회원가입 실패",
            description: "회원가입 중 오류가 발생했습니다.",
            variant: "destructive",
            className: "bg-white border border-gray-200",
          })
        }
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error.message || "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
        className: "bg-white border border-gray-200",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-main-red text-main-red hover:bg-main-red/10">
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>사용자 로그인</DialogTitle>
            <DialogDescription>닉네임, 전화번호 마지막 4자리, 비밀번호를 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickname" className="text-right">
                닉네임
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="col-span-3 bg-hanghae-light border-0"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                전화번호
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="col-span-3 bg-hanghae-light border-0"
                placeholder="마지막 4자리"
                maxLength={4}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3 bg-hanghae-light border-0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-main-red hover:bg-main-red/90" disabled={isLoading}>
              {isLoading ? "처리 중..." : "로그인"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
