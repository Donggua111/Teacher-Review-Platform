"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/store"
import { Course } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SUBJECTS, SUBJECT_LABELS } from "@/constants"

export default function CoursesAdminPage() {
  const { courses, addCourse, toggleCourseActive, currentUser } = useAppContext()
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseCode, setNewCourseCode] = useState("")
  const [newCourseDepartment, setNewCourseDepartment] = useState("")
  const [newCourseSubject, setNewCourseSubject] = useState("")
  const [newCourseType, setNewCourseType] = useState("")
  const [newCourseDescription, setNewCourseDescription] = useState("")

  const getSubjectLabel = (subjectId?: string) => {
    return subjectId && SUBJECT_LABELS[subjectId] ? SUBJECT_LABELS[subjectId] : subjectId
  }

  const handleAddCourse = () => {
    if (!newCourseName || !currentUser) return
    addCourse({
      name: newCourseName,
      code: newCourseCode || undefined,
      department: newCourseDepartment || undefined,
      subject: newCourseSubject || undefined,
      course_type: newCourseType || undefined,
      description: newCourseDescription || undefined,
      is_active: true,
    })
    setNewCourseName("")
    setNewCourseCode("")
    setNewCourseDepartment("")
    setNewCourseSubject("")
    setNewCourseType("")
    setNewCourseDescription("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">课程管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>添加课程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="课程名称"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <Input
              placeholder="课程代码（选填）"
              value={newCourseCode}
              onChange={(e) => setNewCourseCode(e.target.value)}
            />
            <Input
              placeholder="部门（选填）"
              value={newCourseDepartment}
              onChange={(e) => setNewCourseDepartment(e.target.value)}
            />
            <div className="space-y-2">
              <select
                value={newCourseSubject}
                onChange={(e) => setNewCourseSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">选择科目（选填）</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              placeholder="课程类型（选填）"
              value={newCourseType}
              onChange={(e) => setNewCourseType(e.target.value)}
            />
          </div>
          <Input
            placeholder="课程描述（选填）"
            className="mt-4"
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
          />
          <Button className="mt-4" onClick={handleAddCourse}>
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {courses.map((course: Course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  {course.code && (
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  )}
                  {course.department && (
                    <p className="text-sm text-muted-foreground">{course.department}</p>
                  )}
                  {course.subject && (
                    <span className="inline-block px-2 py-0.5 bg-secondary rounded-full text-xs mt-1">
                      {getSubjectLabel(course.subject)}
                    </span>
                  )}
                  {course.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {course.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {course.is_active ? "启用" : "禁用"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCourseActive(course.id)}
                  >
                    {course.is_active ? "禁用" : "启用"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}