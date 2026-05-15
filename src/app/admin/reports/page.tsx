"use client"

import { useAppContext } from "@/lib/store"
import { Report, Review, Course, Teacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReportsAdminPage() {
  const {
    reports,
    reviews,
    courses,
    teachers,
    currentUser,
    updateReportStatus,
    addModerationLog,
  } = useAppContext()

  const pendingReports = reports.filter((r: Report) => r.status === "pending")

  const handleResolve = (reportId: string) => {
    if (!currentUser) return
    updateReportStatus(reportId, "resolved", currentUser.id)
    addModerationLog({
      moderator_id: currentUser.id,
      target_type: "report",
      target_id: reportId,
      action: "approve",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">举报处理</h1>

      {pendingReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            没有待处理的举报
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingReports.map((report: Report) => {
            const review = reviews.find((r: Review) => r.id === report.review_id)
            const course = review ? courses.find((c: Course) => c.id === review.course_id) : null
            const teacher = review ? teachers.find((t: Teacher) => t.id === review.teacher_id) : null
            return (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle>举报 #{report.id.slice(-8)}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    举报原因: {report.reason}
                  </p>
                </CardHeader>
                <CardContent>
                  {report.description && (
                    <p className="mb-4">{report.description}</p>
                  )}
                  {review && (
                    <div className="bg-muted p-4 rounded-md mb-4">
                      <h4 className="font-medium mb-2">被举报的评价:</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course?.name} - {teacher?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        评分: ★ {review.overall_rating}
                      </p>
                      {review.comment && <p>{review.comment}</p>}
                    </div>
                  )}
                  <Button onClick={() => handleResolve(report.id)}>
                    标记已处理
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
