"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Teacher, Course, CourseTeacher, Review } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flag, BookOpen, GraduationCap } from "lucide-react"

export default function TeacherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = params.id as string
  const { teachers, courses, courseTeachers, reviews, addReport, currentUser } = useAppContext()

  const teacher = teachers.find((t: Teacher) => t.id === teacherId)
  if (!teacher) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">教师不存在</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          返回列表
        </Button>
      </div>
    )
  }

  const teacherCourses = courseTeachers
    .filter((ct: CourseTeacher) => ct.teacher_id === teacherId)
    .map((ct: CourseTeacher) => courses.find((c: Course) => c.id === ct.course_id))
    .filter(Boolean)

  const approvedReviews = reviews.filter((r: Review) => r.teacher_id === teacherId && r.status === "approved" && !r.is_deleted)

  const handleReport = (reviewId: string) => {
    if (!currentUser) return
    addReport({
      review_id: reviewId,
      reporter_id: currentUser.id,
      reason: "其他",
      description: "模拟举报",
      status: "pending",
    })
    alert("举报已提交")
  }

  const renderRating = (label: string, value: number) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-base ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm font-medium">{value}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回教师列表
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{teacher.name}</CardTitle>
          {teacher.title && (
            <CardDescription>{teacher.title}</CardDescription>
          )}
          {teacher.department && (
            <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm mt-2">
              {teacher.department}
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>教授课程</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teacherCourses.map((course: Course | undefined) => (
                  <Link key={course?.id} href={`/courses/${course?.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookOpen className="h-3 w-3" />
                      {course?.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Link href={`/review/new?teacherId=${teacherId}`}>
                <Button className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  写评价
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground text-center mt-2">
                评价需要审核后才会显示
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">学生评价</h2>
          <span className="text-sm text-muted-foreground">共 {approvedReviews.length} 条</span>
        </div>
        {approvedReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无评价</p>
              <p className="text-sm text-muted-foreground mt-2">快来写下第一条评价吧</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {approvedReviews.map((review: Review) => {
              const course = courses.find((c: Course) => c.id === review.course_id)
              return (
                <Card key={review.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {course && (
                          <p className="text-sm text-muted-foreground mb-1">
                            课程: <Link href={`/courses/${course.id}`} className="text-primary hover:underline">{course.name}</Link>
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-yellow-500">
                            ★ {review.overall_rating}
                          </span>
                          <span className="text-sm text-muted-foreground">综合评分</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReport(review.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-4 bg-muted/50 rounded-lg">
                      {renderRating("课程难度", review.difficulty)}
                      {renderRating("作业量", review.workload)}
                      {renderRating("考试压力", review.exam_pressure)}
                      {renderRating("讲课清晰度", review.clarity)}
                      {renderRating("答疑帮助", review.helpfulness)}
                      {renderRating("评分公平性", review.fairness)}
                      {renderRating("推荐程度", review.recommendation)}
                    </div>
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-secondary rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {review.comment && (
                      <div className="bg-background p-4 rounded-lg border border-border">
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
