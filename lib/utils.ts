import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 시작일(2024년 4월 8일 오전 9시)로부터 현재까지의 일수 계산
export function getDayCount(): number {
  // 테스트를 위해 현재 Day를 1로 고정
  return 1

  /* 실제 날짜 계산 로직은 아래와 같이 구현할 수 있습니다
  const startDate = new Date(2024, 3, 8) // April 8th, 2024 (month is 0-indexed)
  startDate.setHours(9, 0, 0, 0) // 오전 9시 KST

  const now = new Date()

  // 현재 시간이 오전 9시 이전이면 전날로 계산
  const currentDay = new Date(now)
  if (now.getHours() < 9) {
    currentDay.setDate(currentDay.getDate() - 1)
  }

  // 날짜만 비교하기 위해 시간 부분 설정
  currentDay.setHours(9, 0, 0, 0)

  const diffTime = currentDay.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays + 1 // 1일차부터 시작
  */
}

// 특정 날짜의 Day 번호 계산
export function calculateDayNumber(dateString: string): number {
  // 테스트를 위해 항상 1 반환
  return 1

  /* 실제 날짜 계산 로직은 아래와 같이 구현할 수 있습니다
  const startDate = new Date(2024, 3, 8) // April 8th, 2024 (month is 0-indexed)
  startDate.setHours(9, 0, 0, 0) // 오전 9시 KST

  const questionDate = new Date(dateString)
  questionDate.setHours(9, 0, 0, 0) // 오전 9시로 설정하여 날짜 비교

  // Calculate difference in days
  const diffTime = questionDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  // Day 1 is April 8th
  return diffDays + 1
  */
}

// 날짜를 MM/DD 형식으로 포맷팅
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
}

// 날짜를 yy/mm/dd hh:mm 형식으로 포맷팅
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear().toString().slice(2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${year}/${month}/${day} ${hours}:${minutes}`
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
