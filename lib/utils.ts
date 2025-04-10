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
