interface Quote {
  text: string
  author: string
}

const quotes: Quote[] = [
  {
    text: "처음에는 우리가 습관을 만들지만 나중에는 습관이 우리를 만든다.",
    author: "존 드라이든",
  },
  {
    text: "우리는 우리가 반복하는 것의 총합이다. 그러므로 탁월함은 행동이 아니라 습관이다.",
    author: "아리스토텔레스",
  },
  {
    text: "올바로 작동하지 않는다고 걱정하지 마라. 모든 게 잘 되었다면, 내가 할 일이 없어진다.",
    author: "모셔의 법칙",
  },
  {
    text: "지금 당장 시작하라. 완벽한 시간은 없다.",
    author: "나폴레온 힐",
  },
  {
    text: "오늘 걷지 않으면 내일은 뛰어야 한다.",
    author: "도스토예프스키",
  },
  {
    text: "위대한 일은 오직 끈기와 인내로 이루어진다.",
    author: "사무엘 존슨",
  },
  {
    text: "습관은 제2의 천성으로 제1의 천성을 파괴한다.",
    author: "파스칼",
  },
  {
    text: "항상 오늘만을 위해 일하는 습관을 만들어라. 내일은 저절로 찾아온다.",
    author: "칼 힐티",
  },
  {
    text: "실패하는 것은 죄가 아니다. 유일한 죄악은 시도하지 않는 것이다.",
    author: "수엘렌 프리드",
  },
  {
    text: "나는 천재가 아니다. 단지 조금 더 오래 생각할 뿐.",
    author: "아인슈타인",
  },
]

export function getDailyQuote(): Quote {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return quotes[dayOfYear % quotes.length]
}
