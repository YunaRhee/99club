import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  addDays,
  format,
  isAfter,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
} from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function getQuestionDay(): number {
  const today = new Date()
  const day = today.getDay()

  // 월요일(1), 수요일(3), 금요일(5)에는 각각 1, 2, 3일차 문제 출제
  if (isMonday(today)) return 1
  if (isWednesday(today)) return 2
  if (isFriday(today)) return 3

  // 화요일은 월요일(1일차) 문제
  if (isTuesday(today)) return 1

  // 목요일은 수요일(2일차) 문제
  if (isThursday(today)) return 2

  // 토요일과 일요일은 금요일(3일차) 문제
  if (isSaturday(today) || isSunday(today)) return 3

  return 0 // 기본값
}

export function getAnswerDeadline(questionDay: number): Date {
  const now = new Date()
  let deadline = new Date()

  // 오늘이 금요일이고 3일차 문제인 경우 (금요일 문제)
  if (isFriday(now) && questionDay === 3) {
    // 현재 시간이 오전 9시 이전이면 오늘 오전 9시가 마감
    if (now.getHours() < 9) {
      deadline.setHours(9, 0, 0, 0)
    } else {
      // 그렇지 않으면 다음 월요일 오전 9시가 마감
      deadline = addDays(now, (1 + 2) % 7) // 토요일 + 2일 = 월요일
      deadline.setHours(9, 0, 0, 0)
    }
    return deadline
  }

  // 3일차 문제이지만 금요일이 아닌 경우 (토요일, 일요일)
  if (questionDay === 3 && !isFriday(now)) {
    // 현재 시간이 오전 9시 이전이면 오늘 오전 9시가 마감
    if (now.getHours() < 9) {
      deadline.setHours(9, 0, 0, 0)
    } else {
      // 그렇지 않으면 다음날 오전 9시가 마감
      deadline = addDays(now, 1)
      deadline.setHours(9, 0, 0, 0)
    }
    return deadline
  }

  // 1일차, 2일차 문제는 다음날 오전 9시가 마감
  deadline = addDays(now, 1)
  deadline.setHours(9, 0, 0, 0)

  return deadline
}

export function getTimeRemainingForSubmission(questionDay: number): string {
  const now = new Date()
  const deadline = getAnswerDeadline(questionDay)

  if (isAfter(now, deadline)) {
    return "마감됨"
  }

  const diffMs = deadline.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  let result = ""
  if (diffDays > 0) {
    result += `${diffDays}일 `
  }
  if (diffHours > 0 || diffDays > 0) {
    result += `${diffHours}시간 `
  }
  result += `${diffMinutes}분 남음`

  return result
}
