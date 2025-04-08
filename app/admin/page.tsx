"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AdminLoginDialog } from "@/components/admin-login-dialog"
import { useState } from "react"
import PageLayout from "@/components/page-layout"

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const [activeQuestion, setActiveQuestion] = useState<any>(null)

  // 관리자가 아니면 로그인 화면 표시
  if (!user || !isAdmin) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>
          <Card>
            <CardContent className="py-8">
              <p className="mb-4 text-muted-foreground">관리자 권한이 필요합니다.</p>
              <AdminLoginDialog />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <PageLayout title="관리자 페이지">
      <Tabs defaultValue="questions" className="max-w-4xl">
        <TabsList className="mb-4">
          <TabsTrigger value="questions">질문 관리</TabsTrigger>
          <TabsTrigger value="answers">답변 관리</TabsTrigger>
          <TabsTrigger value="users">사용자 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>질문 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button>새 질문 추가</Button>
                </div>

                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">제목</th>
                        <th className="p-2 text-left">날짜</th>
                        <th className="p-2 text-left">카테고리</th>
                        <th className="p-2 text-left">난이도</th>
                        <th className="p-2 text-left">작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 샘플 데이터 */}
                      <tr className="border-b">
                        <td className="p-2">q1</td>
                        <td className="p-2">자바스크립트 클로저란?</td>
                        <td className="p-2">2023-12-01</td>
                        <td className="p-2">JavaScript</td>
                        <td className="p-2">보통</td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              수정
                            </Button>
                            <Button variant="destructive" size="sm">
                              삭제
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card>
            <CardHeader>
              <CardTitle>답변 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">ID</th>
                      <th className="p-2 text-left">질문</th>
                      <th className="p-2 text-left">사용자</th>
                      <th className="p-2 text-left">날짜</th>
                      <th className="p-2 text-left">공개여부</th>
                      <th className="p-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 샘플 데이터 */}
                    <tr className="border-b">
                      <td className="p-2">a1</td>
                      <td className="p-2">자바스크립트 클로저란?</td>
                      <td className="p-2">사용자1</td>
                      <td className="p-2">2023-12-01</td>
                      <td className="p-2">공개</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            보기
                          </Button>
                          <Button variant="destructive" size="sm">
                            삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>사용자 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">닉네임</th>
                      <th className="p-2 text-left">전화번호</th>
                      <th className="p-2 text-left">답변 수</th>
                      <th className="p-2 text-left">가입일</th>
                      <th className="p-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 샘플 데이터 */}
                    <tr className="border-b">
                      <td className="p-2">사용자1</td>
                      <td className="p-2">1234</td>
                      <td className="p-2">5</td>
                      <td className="p-2">2023-12-01</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            상세
                          </Button>
                          <Button variant="destructive" size="sm">
                            차단
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
