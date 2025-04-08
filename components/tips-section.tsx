import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Coffee, Lightbulb } from "lucide-react"

export default function TipsSection() {
  return (
    <Card>
      <CardHeader className="bg-main-red text-white">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          면접 준비 팁
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="bg-main-red rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm">꾸준한 학습</h3>
              <p className="text-xs text-muted-foreground">매일 조금씩이라도 학습하는 습관을 들이세요.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-main-red rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
              <Coffee className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-sm">실전 연습</h3>
              <p className="text-xs text-muted-foreground">모의 면접을 통해 실전 감각을 키우세요.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
