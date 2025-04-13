import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Replace the getDayCount and calculateDayNumber functions with time-based versions

// 테스트를 위해 시간에 따라 Day 3를 반환하도록 수정
export function getDayCount(): number {
  const now = new Date()

  // 2025년 4월 11일 오전 9시 (Day 3 공개 시간)
  const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0) // 월은 0부터 시작하므로 4월은 3

  // 현재 시간이 2025년 4월 11일 오전 9시 이후인지 확인
  if (now >= day3ReleaseTime) {
    return 3 // Day 3 표시
  }

  return 2 // 그 전에는 Day 2 표시
}

// 특정 날짜의 Day 번호 계산 함수도 수정
export function calculateDayNumber(dateString: string): number {
  const now = new Date()
  const date = new Date(dateString)

  // 2025년 4월 11일 오전 9시 (Day 3 공개 시간)
  const day3ReleaseTime = new Date(2025, 3, 11, 9, 0, 0)

  // 현재 시간이 2025년 4월 11일 오전 9시 이후이고, 날짜가 4월 11일이면 Day 3
  if (now >= day3ReleaseTime && date.getDate() === 11 && date.getMonth() === 3 && date.getFullYear() === 2025) {
    return 3
  }

  // 날짜가 4월 10일이면 Day 2
  if (date.getDate() === 10 && date.getMonth() === 3 && date.getFullYear() === 2025) {
    return 2
  }

  // 날짜가 4월 9일이면 Day 1
  if (date.getDate() === 9 && date.getMonth() === 3 && date.getFullYear() === 2025) {
    return 1
  }

  return 2 // 기본값
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

// 답변 제출 마감 시간 계산 함수를 수정합니다
// Day 3 질문은 금요일에만 다음 주 월요일로 설정하고, 다른 날짜에는 다음 날이 아닌 당일 기준으로 계산하도록 변경

function getAnswerDeadline(questionDay: number): Date {
  const now = new Date()
  const isDay3 = questionDay === 3

  // 현재 요일 확인 (0: 일요일, 1: 월요일, ..., 5: 금요일, 6: 토요일)
  const currentDayOfWeek = now.getDay()
  const isFriday = currentDayOfWeek === 5

  // Day 3 질문이고 금요일이면 다음 주 월요일 오전 9시까지
  if (isDay3 && isFriday) {
    const nextMonday = new Date(now)
    // 현재 요일이 금요일(5)이면 +3일 하면 월요일
    nextMonday.setDate(now.getDate() + 3)
    nextMonday.setHours(9, 0, 0, 0)
    return nextMonday
  }

  // Day 3 질문이지만 금요일이 아닌 경우, 당일 기준으로 계산
  // 현재 시간이 오전 9시 이전이면 당일 오전 9시, 이후면 다음 날 오전 9시
  if (isDay3) {
    const today = new Date(now)
    if (now.getHours() < 9) {
      // 오전 9시 이전이면 당일 오전 9시
      today.setHours(9, 0, 0, 0)
      return today
    } else {
      // 오전 9시 이후면 다음 날 오전 9시
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      return tomorrow
    }
  }

  // 그 외의 경우 다음 날 오전 9시까지
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow
}

// 답변 제출 마감까지 남은 시간 계산 함수 - 일수 표시 수정
export function getTimeRemainingForSubmission(questionDay: number): string {
  const now = new Date()
  const deadline = getAnswerDeadline(questionDay)

  // 이미 마감된 경우
  if (now >= deadline) {
    return "제출 마감"
  }

  // 남은 시간 계산
  const diffMs = deadline.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  // 항상 일수 포함하여 표시
  if (diffDays > 0) {
    return `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 남음`
  }

  return `${diffHours}시간 ${diffMinutes}분 남음`
}
