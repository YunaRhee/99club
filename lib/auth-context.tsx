"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { generateUserId, getUserActivity, saveUserToSpreadsheet, getRandomProfileIcon } from "@/lib/user-activity"
import { useRouter } from "next/navigation"

type User = {
  userId: string
  nickname: string
  phone?: string
  password?: string
}

type AuthContextType = {
  user: User | null
  isAdmin: boolean
  login: (nickname: string, phone: string, password: string, isNewUser?: boolean) => Promise<boolean>
  adminLogin: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedUser = localStorage.getItem("user")
    const storedIsAdmin = localStorage.getItem("isAdmin")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedIsAdmin === "true") {
      setIsAdmin(true)
      // Only redirect if this is the initial page load, not a refresh
      const isInitialLoad = !sessionStorage.getItem("initialLoadComplete")
      if (window.location.pathname === "/" && isInitialLoad) {
        sessionStorage.setItem("initialLoadComplete", "true")
        router.push("/admin")
      }
    }
  }, [router])

  const login = async (nickname: string, phone: string, password: string, isNewUser = false): Promise<boolean> => {
    try {
      if (isNewUser) {
        // 새 사용자 등록
        const userId = generateUserId()
        const profileIcon = getRandomProfileIcon(nickname)

        // 사용자 정보를 스프레드시트에 저장
        const success = await saveUserToSpreadsheet(userId, nickname, phone, password, profileIcon)

        if (!success) {
          return false
        }

        const newUser = { userId, nickname, phone, password }
        setUser(newUser)
        setIsAdmin(false)
        localStorage.setItem("user", JSON.stringify(newUser))
        localStorage.setItem("isAdmin", "false")

        // 사용자 활동 정보 초기화
        getUserActivity(userId)

        return true
      } else {
        // 기존 사용자 로그인 - 비밀번호 확인
        const response = await fetch(`/api/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickname, phone, password }),
        })

        if (!response.ok) {
          return false
        }

        const data = await response.json()

        if (!data.success) {
          return false
        }

        const loggedInUser = {
          userId: data.user.userId,
          nickname,
          phone,
        }

        setUser(loggedInUser)
        setIsAdmin(false)
        localStorage.setItem("user", JSON.stringify(loggedInUser))
        localStorage.setItem("isAdmin", "false")

        return true
      }
    } catch (error) {
      console.error("로그인 오류:", error)
      return false
    }
  }

  const adminLogin = (password: string) => {
    // 실제 구현에서는 서버에서 검증해야 합니다
    if (password === "admin1234") {
      const adminUserId = "admin_" + Date.now()
      setUser({ userId: adminUserId, nickname: "관리자" })
      setIsAdmin(true)
      localStorage.setItem("user", JSON.stringify({ userId: adminUserId, nickname: "관리자" }))
      localStorage.setItem("isAdmin", "true")

      // 관리자 페이지로 리다이렉트
      router.push("/admin")
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem("user")
    localStorage.removeItem("isAdmin")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isAdmin, login, adminLogin, logout }}>{children}</AuthContext.Provider>
}

// useAuth 훅 추가 및 export
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
