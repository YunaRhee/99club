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
// 5. 관리자 버튼을 톱니바퀴 아이콘으로 변경
import { Settings } from "lucide-react"

export function AdminLoginDialog() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const { adminLogin } = useAuth()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      toast({
        title: "입력 오류",
        description: "비밀번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const success = adminLogin(password)

    if (success) {
      setOpen(false)
      toast({
        title: "관리자 로그인 성공",
        description: "관리자 권한으로 로그인되었습니다.",
      })
    } else {
      toast({
        title: "로그인 실패",
        description: "관리자 비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* DialogTrigger 부분 수정 */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
          <Settings className="h-4 w-4" />
          <span className="sr-only">관리자</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>관리자 로그인</DialogTitle>
            <DialogDescription>관리자 비밀번호를 입력하세요.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admin-password" className="text-right">
                비밀번호
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3 bg-hanghae-light border-0"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-main-red hover:bg-main-red/90">
              로그인
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
