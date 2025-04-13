import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Day 공개 시간을 배열로 정의 (모든 날짜는 KST 기준, 월: 0부터 시작)
const releaseTimes = [
  { day: 1, time: new Date(2025, 3, 9, 9, 0, 0) },   // 2025-04-09 오전 9시: Day 1
  { day: 2, time: new Date(2025, 3, 10, 9, 0, 0) },  // 2025-04-10 오전 9시: Day 2
  { day: 3, time: new Date(2025, 3, 11, 9, 0, 0) },  // 2025-04-11 오전 9시: Day 3
  { day: 4, time: new Date(2025, 3, 14, 9, 0, 0) },  // 2025-04-14 오전 9시: Day 4
  { day: 5, time: new Date(2025, 3, 15, 9, 0, 0) },  // 2025-04-15 오전 9시: Day 5
  { day: 6, time: new Date(2025, 3, 16, 9, 0, 0) },  // 2025-04-16 오전 9시: Day 6
  { day: 7, time: new Date(2025, 3, 17, 9, 0, 0) },  // 2025-04-17 오전 9시: Day 7
  { day: 8, time: new Date(2025, 3, 18, 9, 0, 0) },  // 2025-04-18 오전 9시: Day 8
  { day: 9, time: new Date(2025, 3, 21, 9, 0, 0) },  // 2025-04-21 오전 9시: Day 9
  { day: 10, time: new Date(2025, 3, 22, 9, 0, 0) }, // 2025-04-22 오전 9시: Day 10
]

// 현재 날짜 기준으로 Day 계산
export function getDayCount(): number {
  const now = new Date()
  let currentDay = 0
  for (const release of releaseTimes) {
    if (now >= release.time) {
      currentDay = release.day
    } else {
      break
    }
  }
  // 공개 전이라면 최소 Day 1로 설정 (필요에 따라 다르게 처리)
  return currentDay || 1
}

// 특정 날짜의 Day 번호 계산 함수
export function calculateDayNumber(dateString: string): number {
  const date = new Date(dateString)

  // 2025년 4월은 month 값이 3으로 처리됨
  if (date.getFullYear() === 2025 && date.getMonth() === 3) {
    // 날짜를 기반으로 Day 번호를 매핑
    switch (date.getDate()) {
      case 9:
        return 1
      case 10:
        return 2
      case 11:
        return 3
      case 14:
        return 4
      case 15:
        return 5
      case 16:
        return 6
      case 17:
        return 7
      case 18:
        return 8
      case 21:
        return 9
      case 22:
        return 10
      default:
        return 1 // 기본값 (필요시 수정)
    }
  }
  return 1 // 기본값
}

// 날짜를 MM/DD 형식으로 포맷팅
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
}

// formatDateTime 함수를 KST로 수정
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return "날짜 오류"
    }

    // KST로 변환 (UTC+9)
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)

    const year = kstDate.getFullYear().toString().slice(2)
    const month = (kstDate.getMonth() + 1).toString().padStart(2, "0")
    const day = kstDate.getDate().toString().padStart(2, "0")
    const hours = kstDate.getHours().toString().padStart(2, "0")
    const minutes = kstDate.getMinutes().toString().padStart(2, "0")

    return `${year}/${month}/${day} ${hours}:${minutes}`
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error)
    return "날짜 오류"
  }
}

// 모범 답변을 볼 수 있는지 확인 (오후 8시 이후)
export function canViewModelAnswer(): boolean {
  const now = new Date()
  return now.getHours() >= 20 // 저녁 8시 이후
}

// 모범 답변 공개까지 남은 시간 계산
export function getTimeRemainingForModelAnswer(): string {
  const now = new Date()
  const releaseHour = 20 // 저녁 8시

  if (now.getHours() >= releaseHour) {
    return "모범 답변이 공개되었습니다"
  }

  const hoursRemaining = releaseHour - now.getHours()
  return `모범 답변 공개까지 ${hoursRemaining}시간 남음`
}

// 답변 제출 마감 시간 계산 함수 수정 (예시)
// Day 3의 경우 금요일엔 다음 주 월요일, 그 외는 당일 또는 다음 날로 처리
function getAnswerDeadline(questionDay: number): Date {
  const now = new Date()
  const isDay3 = questionDay === 3

  const currentDayOfWeek = now.getDay()
  const isFriday = currentDayOfWeek === 5

  if (isDay3 && isFriday) {
    const nextMonday = new Date(now)
    nextMonday.setDate(now.getDate() + 3)
    nextMonday.setHours(9, 0, 0, 0)
    return nextMonday
  }

  if (isDay3) {
    const today = new Date(now)
    if (now.getHours() < 9) {
      today.setHours(9, 0, 0, 0)
      return today
    } else {
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow
    }
  }

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow
}

// 답변 제출 마감까지 남은 시간 계산 함수 - 일수 표시 수정
export function getTimeRemainingForSubmission(questionDay: number): string {
  const now = new Date()
  const deadline = getAnswerDeadline(questionDay)

  if (now >= deadline) {
    return "제출 마감"
  }

  const diffMs = deadline.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`
  }

  return `${diffHours}시간 ${diffMinutes}분 남음`
}
