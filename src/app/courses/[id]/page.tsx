"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Course, Teacher, CourseTeacher, Review } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flag, Users, BookOpen } from "lucide-react"
import { SUBJECT_LABELS } from "@/constants"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const { courses, teachers, courseTeachers, reviews, addReport, currentUser } = useAppContext()

  const course = courses.find((c: Course) => c.id === courseId)
  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">课程不存在</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          返回列表
        </Button>
      </div>
    )
  }

  const getSubjectLabel = (subjectId?: string) => {
    return subjectId && SUBJECT_LABELS[subjectId] ? SUBJECT_LABELS[subjectId] : subjectId
  }

  const courseTeachersList = courseTeachers
    .filter((ct: CourseTeacher) => ct.course_id === courseId)
    .map((ct: CourseTeacher) => teachers.find((t: Teacher) => t.id === ct.teacher_id))
    .filter(Boolean)

  const approvedReviews = reviews.filter((r: Review) => r.course_id === courseId && r.status === "approved" && !r.is_deleted)

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
          返回课程列表
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{course.name}</CardTitle>
          {course.code && (
            <CardDescription>{course.code}</CardDescription>
          )}
          {course.subject && (
            <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm mt-2">
              {getSubjectLabel(course.subject)}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {course.description && (
            <p className="text-muted-foreground mb-6">{course.description}</p>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>授课教师</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {courseTeachersList.map((teacher: Teacher | undefined) => (
                <Link key={teacher?.id} href={`/teachers/${teacher?.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookOpen className="h-3 w-3" />
                    {teacher?.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">已审核评价</h2>
          <span className="text-sm text-muted-foreground">共 {approvedReviews.length} 条</span>
        </div>
        {approvedReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">暂无评价</p>
              <p className="text-sm text-muted-foreground mt-2">该课程还没有学生评价</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {approvedReviews.map((review: Review) => {
              const teacher = teachers.find((t: Teacher) => t.id === review.teacher_id)
              return (
                <Card key={review.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {teacher && (
                          <p className="text-sm text-muted-foreground mb-1">
                            授课教师: <Link href={`/teachers/${teacher.id}`} className="text-primary hover:underline">{teacher.name}</Link>
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
