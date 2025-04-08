"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Event {
  title: string
  date: string
  location: string
  locationUrl?: string
  description: string
}

export default function EventSection() {
  const { isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [event, setEvent] = useState<Event>({
    title: "항해99 개발자 네트워킹 데이",
    date: "2025년 4월 15일 오후 7시",
    location: "강남 코워킹 스페이스",
    locationUrl: "https://map.naver.com",
    description:
      "현업 개발자와 함께하는 네트워킹 이벤트에 참여하세요. 다양한 경험과 인사이트를 나눌 수 있는 기회입니다.",
  })
  const [editForm, setEditForm] = useState<Event>(event)

  const handleEdit = () => {
    setEditForm({ ...event })
    setIsEditing(true)
  }

  const handleSave = () => {
    // 실제 구현에서는 API 호출로 저장
    setEvent({ ...editForm })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card className="bg-hanghae-gray border-hanghae-light">
      <CardHeader className="bg-main-red text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">99클럽 이벤트 소식</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-hanghae-text">이벤트 제목</label>
              <Input
                name="title"
                value={editForm.title}
                onChange={handleChange}
                className="bg-hanghae-light border-0 text-hanghae-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-hanghae-text">일시</label>
              <Input
                name="date"
                value={editForm.date}
                onChange={handleChange}
                className="bg-hanghae-light border-0 text-hanghae-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-hanghae-text">장소</label>
              <Input
                name="location"
                value={editForm.location}
                onChange={handleChange}
                className="bg-hanghae-light border-0 text-hanghae-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-hanghae-text">장소 링크 (선택)</label>
              <Input
                name="locationUrl"
                value={editForm.locationUrl}
                onChange={handleChange}
                className="bg-hanghae-light border-0 text-hanghae-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-hanghae-text">내용</label>
              <Textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                rows={4}
                className="bg-hanghae-light border-0 text-hanghae-text"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button className="bg-main-red hover:bg-main-red/90" onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-hanghae-text">{event.title}</h3>

            <div className="flex gap-3">
              <div className="bg-main-red rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-hanghae-text">일시</h3>
                <p className="text-xs text-hanghae-text/70">{event.date}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-main-red rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-hanghae-text">장소</h3>
                <p className="text-xs text-hanghae-text/70">
                  {event.locationUrl ? (
                    <a
                      href={event.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline"
                    >
                      {event.location}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    event.location
                  )}
                </p>
              </div>
            </div>

            <p className="text-sm text-hanghae-text">{event.description}</p>

            {isAdmin && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  수정
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
