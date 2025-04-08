"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimpleTest() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiPath, setApiPath] = useState("/api/hello")

  const testApi = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(apiPath)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
      console.error("API 호출 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>간단한 API 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">API 경로:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiPath}
                onChange={(e) => setApiPath(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md"
                placeholder="/api/hello"
              />
              <Button onClick={testApi} disabled={loading}>
                {loading ? "테스트 중..." : "테스트"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 font-medium">오류 발생:</p>
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 font-medium">응답 결과:</p>
              <pre className="mt-2 p-2 bg-white rounded overflow-auto text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-600 font-medium">테스트 방법:</p>
            <ol className="mt-2 list-decimal list-inside text-sm space-y-1">
              <li>
                기본 API 경로 <code>/api/hello</code>를 테스트해보세요.
              </li>
              <li>
                다른 API 경로도 테스트해볼 수 있습니다: <code>/api/test</code>
              </li>
              <li>응답이 오는지 확인하고, 오류가 있다면 메시지를 확인하세요.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
