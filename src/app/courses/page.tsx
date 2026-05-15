"use client"

import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Course, Teacher, CourseTeacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users } from "lucide-react"
import { SUBJECT_LABELS } from "@/constants"

export default function CoursesPage() {
  const { courses, teachers, courseTeachers } = useAppContext()

  const getCourseTeachers = (courseId: string) => {
    const cts = courseTeachers.filter((ct: CourseTeacher) => ct.course_id === courseId)
    return cts.map((ct: CourseTeacher) => teachers.find((t: Teacher) => t.id === ct.teacher_id)).filter(Boolean)
  }

  const getSubjectLabel = (subjectId?: string) => {
    return subjectId && SUBJECT_LABELS[subjectId] ? SUBJECT_LABELS[subjectId] : subjectId
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">课程列表</h1>
        <p className="text-muted-foreground mt-2">共 {courses.filter((c: Course) => c.is_active).length} 门课程</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.filter((c: Course) => c.is_active).map((course: Course) => {
          const courseTeachersList = getCourseTeachers(course.id)
          return (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                {course.code && (
                  <p className="text-xs text-muted-foreground">{course.code}</p>
                )}
                {course.subject && (
                  <span className="inline-block px-2 py-0.5 bg-secondary rounded-full text-xs mt-1">
                    {getSubjectLabel(course.subject)}
                  </span>
                )}
              </CardHeader>
              <CardContent>
                {course.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                )}
                {courseTeachersList.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>授课教师: {courseTeachersList.map((t: Teacher | undefined) => t?.name).join(", ")}</span>
                  </div>
                )}
                <Link href={`/courses/${course.id}`}>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
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