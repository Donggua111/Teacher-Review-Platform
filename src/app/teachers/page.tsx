"use client"

import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Teacher, Course, CourseTeacher, Review } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, BookOpen, Briefcase } from "lucide-react"

export default function TeachersPage() {
  const { teachers, courses, courseTeachers, reviews } = useAppContext()
  const approvedReviews = reviews.filter((r: Review) => r.status === "approved")

  const getTeacherCourses = (teacherId: string) => {
    const cts = courseTeachers.filter((ct: CourseTeacher) => ct.teacher_id === teacherId)
    return cts.map((ct: CourseTeacher) => courses.find((c: Course) => c.id === ct.course_id)).filter(Boolean)
  }

  const getTeacherAverageRating = (teacherId: string) => {
    const teacherReviews = approvedReviews.filter((r: Review) => r.teacher_id === teacherId)
    if (teacherReviews.length === 0) return null
    const sum = teacherReviews.reduce((acc: number, r: Review) => acc + r.overall_rating, 0)
    return (sum / teacherReviews.length).toFixed(1)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">教师列表</h1>
        <p className="text-muted-foreground mt-2">共 {teachers.filter((t: Teacher) => t.is_active).length} 位教师</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.filter((t: Teacher) => t.is_active).map((teacher: Teacher) => {
          const teacherCourses = getTeacherCourses(teacher.id)
          const avgRating = getTeacherAverageRating(teacher.id)
          return (
            <Card key={teacher.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{teacher.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {teacher.title && <span>{teacher.title}</span>}
                  {teacher.title && teacher.department && <span>·</span>}
                  {teacher.department && <span>{teacher.department}</span>}
                </div>
              </CardHeader>
              <CardContent>
                {teacherCourses.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>教授课程: {teacherCourses.map((c: Course | undefined) => c?.name).join(", ")}</span>
                  </div>
                )}
                {avgRating && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">学生评价</span>
                    <span className="text-xl font-bold text-yellow-500 ml-auto">
                      ★ {avgRating}
                    </span>
                  </div>
                )}
                <Link href={`/teachers/${teacher.id}`}>
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    查看详情
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
