"use client"

// 사용자 활동 기록을 관리하는 유틸리티 함수
import { v4 as uuidv4 } from "uuid"

interface UserActivity {
  answeredQuestions: { id: string; category: string; date: string }[] // 답변한 질문 정보
  readQuestions: { id: string; category: string; date: string }[] // 읽은 질문 정보
  lastActiveDate: string // 마지막 활동 날짜
  consecutiveDays: number // 연속 활동일
  profileIcon: string // 프로필 아이콘
  greetingIndex: number // 인사말 인덱스
}

// 로컬 스토리지에서 사용자 활동 정보 가져오기
export function getUserActivity(userId: string): UserActivity {
  if (typeof window === "undefined") {
    return getDefaultUserActivity()
  }

  const key = `user_activity_${userId}`
  const storedData = localStorage.getItem(key)

  if (storedData) {
    return JSON.parse(storedData)
  }

  // 기본값 반환
  return getDefaultUserActivity()
}

// 기본 사용자 활동 정보 생성
function getDefaultUserActivity(): UserActivity {
  return {
    answeredQuestions: [],
    readQuestions: [],
    lastActiveDate: new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }),
    consecutiveDays: 1,
    profileIcon: "🐦",
    greetingIndex: Math.floor(Math.random() * 5),
  }
}

// 사용자 활동 정보 저장하기
export function saveUserActivity(userId: string, activity: UserActivity): void {
  if (typeof window === "undefined") return

  const key = `user_activity_${userId}`
  localStorage.setItem(key, JSON.stringify(activity))
}

// 질문 읽음 표시
export function markQuestionAsRead(userId: string, questionId: string, category: string): void {
  if (!userId) return

  const activity = getUserActivity(userId)
  const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })

  // 이미 읽은 질문인지 확인
  const alreadyRead = activity.readQuestions.some((q) => q.id === questionId)

  if (!alreadyRead) {
    activity.readQuestions.push({
      id: questionId,
      category,
      date: today,
    })

    updateConsecutiveDays(activity)
    saveUserActivity(userId, activity)
  }
}

// 질문 답변 표시
export function markQuestionAsAnswered(userId: string, questionId: string, category: string): void {
  if (!userId) return

  const activity = getUserActivity(userId)
  const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })

  // 이미 답변한 질문인지 확인
  const alreadyAnswered = activity.answeredQuestions.some((q) => q.id === questionId && q.category === category)

  if (!alreadyAnswered) {
    activity.answeredQuestions.push({
      id: questionId,
      category,
      date: today,
    })

    // 읽은 질문에도 추가
    if (!activity.readQuestions.some((q) => q.id === questionId && q.category === category)) {
      activity.readQuestions.push({
        id: questionId,
        category,
        date: today,
      })
    }

    updateConsecutiveDays(activity)
    saveUserActivity(userId, activity)
  }
}

// 연속 활동일 업데이트
function updateConsecutiveDays(activity: UserActivity): void {
  const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
  const lastActive = activity.lastActiveDate

  if (today === lastActive) {
    // 오늘 이미 활동했음
    return
  }

  // 어제 활동했는지 확인
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })

  if (lastActive === yesterdayStr) {
    // 어제 활동했으면 연속일 증가
    activity.consecutiveDays += 1
  } else {
    // 어제 활동하지 않았으면 연속일 리셋
    activity.consecutiveDays = 1
  }

  activity.lastActiveDate = today
}

// 닉네임 기반으로 랜덤 프로필 아이콘 생성
export function getRandomProfileIcon(nickname: string): string {
  const PROFILE_ICONS = [
    "🐦",
    "🦃",
    "🕊️",
    "🦅",
    "🦆",
    "🦉",
    "🐦‍⬛",
    "🪿",
    "🐵",
    "🐶",
    "🐯",
    "🐱",
    "🦊",
    "🐺",
    "🐷",
    "🐮",
    "🐗",
    "🐭",
    "🐹",
    "🐻",
    "🐨",
    "🐰",
    "🐔",
    "🐸",
    "🐲",
    "🐟",
    "🐙",
    "🐡",
    "🐠",
    "🐋",
    "🐌",
    "🐛",
    "🐝",
    "🐞",
  ]

  // 닉네임을 기반으로 고정된 아이콘 선택
  const nameHash = nickname.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const iconIndex = nameHash % PROFILE_ICONS.length

  return PROFILE_ICONS[iconIndex]
}

// 고유 사용자 ID 생성
export function generateUserId(): string {
  return uuidv4()
}

// 사용자 정보를 스프레드시트에 저장
export async function saveUserToSpreadsheet(
  userId: string,
  nickname: string,
  phone: string,
  password: string,
): Promise<boolean> {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        nickname,
        phone,
        password,
        profileIcon: getRandomProfileIcon(nickname),
        createdAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
      }),
    })

    return response.ok
  } catch (error) {
    console.error("사용자 정보 저장 오류:", error)
    return false
  }
}

// 특정 카테고리의 질문을 읽었는지 확인
export function hasReadQuestion(userId: string, questionId: string, category: string): boolean {
  if (!userId) return false

  const activity = getUserActivity(userId)
  return activity.readQuestions.some((q) => q.id === questionId && q.category === category)
}

// 특정 카테고리의 질문에 답변했는지 확인
export function hasAnsweredQuestion(userId: string, questionId: string, category: string): boolean {
  if (!userId) return false

  const activity = getUserActivity(userId)
  return activity.answeredQuestions.some((q) => q.id === questionId && q.category === category)
}

// 오늘 활동한 카테고리 목록 가져오기
export function getTodayActivities(userId: string): { read: string[]; answered: string[] } {
  if (!userId) return { read: [], answered: [] }

  const activity = getUserActivity(userId)
  const today = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })

  const readToday = activity.readQuestions.filter((q) => q.date === today).map((q) => q.category)

  const answeredToday = activity.answeredQuestions.filter((q) => q.date === today).map((q) => q.category)

  return {
    read: [...new Set(readToday)],
    answered: [...new Set(answeredToday)],
  }
}

// 인사말 목록
export const GREETINGS = [
  "{name} 님, 반가워요!",
  "{name} 님, 오늘도 힘내봐요!",
  "{name} 님, 안녕하세요!",
  "{name} 님, 화이팅!",
  "{name} 님, 좋은 하루 보내세요 :)",
]

// 오늘의 인사말 가져오기
export function getGreeting(userId: string, name: string): string {
  if (!userId) return GREETINGS[0].replace("{name}", name)

  const activity = getUserActivity(userId)
  return GREETINGS[activity.greetingIndex].replace("{name}", name)
}

// 활동 캘린더 데이터 생성
export function generateCalendarData(
  userId: string,
): { date: string; hasActivity: boolean; day: number; isToday: boolean; isPast: boolean }[] {
  const activity = getUserActivity(userId)
  const today = new Date()
  const startDate = new Date(2024, 3, 8) // 2024년 4월 8일 시작

  const days = []
  const currentDate = new Date(startDate)

  // 10일간의 데이터 생성
  for (let i = 0; i < 10; i++) {
    const dateStr = currentDate.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" })
    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    const isPast = currentDate < today

    // 활동 여부 확인
    const hasActivity =
      activity.readQuestions.some((q) => q.date === dateStr) ||
      activity.answeredQuestions.some((q) => q.date === dateStr)

    days.push({
      date: dateStr,
      hasActivity,
      day: i + 1,
      isToday,
      isPast: isPast || isToday,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}
