"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Bug, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

export default function DebugTool() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [apiPath, setApiPath] = useState("/api/debug")

  const checkApiConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(apiPath)
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      setDebugInfo({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiSubmission = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: "test_question",
          content: "테스트 답변입니다. 시간: " + new Date().toISOString(),
          nickname: "디버그 사용자",
          phone: "1234",
          isPublic: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setTestResult({
          success: true,
          message: "API 호출 성공! 답변이 스프레드시트에 저장되었습니다.",
          details: data,
        })
      } else {
        setTestResult({
          success: false,
          message: "API 호출은 되었지만 오류가 발생했습니다.",
          details: data,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "API 호출 실패: " + error.message,
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testApiRetrieval = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/answers?publicOnly=true")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setTestResult({
          success: true,
          message: `API 호출 성공! ${data.data.length}개의 답변을 가져왔습니다.`,
          details: data,
        })
      } else {
        setTestResult({
          success: false,
          message: "API 호출은 되었지만 오류가 발생했습니다.",
          details: data,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "API 호출 실패: " + error.message,
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 구글 시트 테스트 함수 추가
  const testGoogleSheets = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/debug-sheets")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()

      setTestResult({
        success: data.success,
        message: data.success ? "구글 시트 연결 테스트 성공" : "구글 시트 연결 테스트 실패",
        details: data,
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "구글 시트 연결 테스트 실패: " + error.message,
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSimpleSheet = async () => {
    setIsLoading(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/test-sheet")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`)
      }

      const data = await response.json()

      setTestResult({
        success: data.success,
        message: data.success ? "간단한 시트 테스트 성공" : "간단한 시트 테스트 실패",
        details: data,
      })
    } catch (error) {
      setTestResult({
        success: false,
        message: "간단한 시트 테스트 실패: " + error.message,
        error: error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-80">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-md">
            <Bug className="h-4 w-4" />
            디버그 도구
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Google Sheets API 연결 테스트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="mb-2">
                <label className="block text-xs mb-1">API 경로 테스트:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiPath}
                    onChange={(e) => setApiPath(e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border rounded"
                    placeholder="/api/debug"
                  />
                  <Button size="sm" variant="outline" onClick={checkApiConnection} disabled={isLoading}>
                    {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "테스트"}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={testApiSubmission} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "답변 저장 테스트"}
                </Button>
                <Button size="sm" variant="outline" onClick={testApiRetrieval} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "답변 조회 테스트"}
                </Button>
                <Button size="sm" variant="outline" onClick={testGoogleSheets} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "구글 시트 테스트"}
                </Button>
                <Button size="sm" variant="outline" onClick={testSimpleSheet} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "간단한 시트 테스트"}
                </Button>
              </div>

              {testResult && (
                <div
                  className={`mt-3 p-2 rounded-md ${testResult.success ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="font-medium">{testResult.message}</span>
                  </div>
                  {testResult.details && (
                    <div className="mt-1 p-1 bg-white/50 dark:bg-black/20 rounded overflow-auto max-h-32">
                      <pre className="text-xs">{JSON.stringify(testResult.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {debugInfo && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto max-h-40">
                  <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}

              <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md">
                <p className="text-xs font-medium mb-1">404 오류 해결 방법:</p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Next.js 서버가 실행 중인지 확인</li>
                  <li>API 경로가 올바른지 확인 (app/api/[route]/route.ts)</li>
                  <li>파일 이름이 정확히 'route.ts'인지 확인</li>
                  <li>서버를 재시작해보세요</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
