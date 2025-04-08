interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  {
    text: "성공의 비결은 단 한 가지, 잘할 수 있는 일에 광적으로 집중하는 것이다.",
    author: "톰 모나건",
  },
  {
    text: "매일 해야 할 일을 하는 사람이 성공한다.",
    author: "앙드레 모루아",
  },
  {
    text: "습관은 인간의 제2의 천성이다.",
    author: "프랑스 속담",
  },
  {
    text: "작은 일을 크게 하라. 큰 일은 작게 시작한다.",
    author: "래리 페이지",
  },
  {
    text: "꾸준함은 모든 것을 이긴다.",
    author: "퍼블릴리우스 시루스",
  },
  {
    text: "오늘 할 수 있는 일을 내일로 미루지 마라.",
    author: "벤자민 프랭클린",
  },
  {
    text: "배움에는 끝이 없다.",
    author: "로버트 슈만",
  },
  {
    text: "지식은 힘이다.",
    author: "프랜시스 베이컨",
  },
  {
    text: "실패는 성공의 어머니이다.",
    author: "토마스 에디슨",
  },
  {
    text: "천천히 그러나 꾸준히 가는 자가 경주에서 승리한다.",
    author: "이솝",
  },
]

export function getDailyQuote(): Quote {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return quotes[dayOfYear % quotes.length]
}
