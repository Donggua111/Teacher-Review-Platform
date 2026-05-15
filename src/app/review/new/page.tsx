"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/lib/store"
import { Course, Teacher, CourseTeacher, Review } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, Tag, MessageSquare } from "lucide-react"

const tagOptions = ["讲得清楚", "有耐心", "作业少", "作业多", "有挑战", "有收获", "课堂生动"]

export default function NewReviewPage({ searchParams }: { searchParams?: { teacherId?: string } }) {
  const router = useRouter()
  const { courses, teachers, courseTeachers, reviews, addReview, currentUser } = useAppContext()

  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState(searchParams?.teacherId || "")
  const [overallRating, setOverallRating] = useState(5)
  const [difficulty, setDifficulty] = useState(3)
  const [workload, setWorkload] = useState(3)
  const [examPressure, setExamPressure] = useState(3)
  const [clarity, setClarity] = useState(5)
  const [helpfulness, setHelpfulness] = useState(5)
  const [fairness, setFairness] = useState(5)
  const [recommendation, setRecommendation] = useState(5)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [comment, setComment] = useState("")

  const teacherCourses = selectedTeacherId
    ? courseTeachers
        .filter((ct: CourseTeacher) => ct.teacher_id === selectedTeacherId)
        .map((ct: CourseTeacher) => courses.find((c: Course) => c.id === ct.course_id))
        .filter((c: Course | undefined): c is Course => c !== undefined)
    : []

  const availableTeachers = selectedCourseId
    ? courseTeachers
        .filter((ct: CourseTeacher) => ct.course_id === selectedCourseId)
        .map((ct: CourseTeacher) => teachers.find((t: Teacher) => t.id === ct.teacher_id))
        .filter((t: Teacher | undefined): t is Teacher => t !== undefined)
    : selectedTeacherId
    ? teachers.filter((t: Teacher) => t.id === selectedTeacherId)
    : []

  const hasNoTeachers = selectedCourseId && availableTeachers.length === 0

  const hasNoCourses = !!selectedTeacherId && teacherCourses.length === 0

  const hasAlreadyReviewed = selectedCourseId && selectedTeacherId && currentUser
    ? reviews.some(
        (r: Review) =>
          r.user_id === currentUser.id &&
          r.course_id === selectedCourseId &&
          r.teacher_id === selectedTeacherId
      )
    : false

  const isTeacherPreselected = !!searchParams?.teacherId
  const preselectedTeacher = isTeacherPreselected 
    ? teachers.find((t: Teacher) => t.id === searchParams.teacherId)
    : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      alert("请先选择用户角色")
      return
    }
    if (!selectedCourseId) {
      alert("请选择课程")
      return
    }
    if (!selectedTeacherId) {
      alert("请选择教师")
      return
    }
    if (hasAlreadyReviewed) {
      alert("您已经对该课程和教师进行过评价了")
      return
    }

    addReview({
      user_id: currentUser.id,
      course_id: selectedCourseId,
      teacher_id: selectedTeacherId,
      school_year: "2024-2025",
      semester: "秋",
      overall_rating: overallRating,
      difficulty,
      workload,
      exam_pressure: examPressure,
      clarity,
      helpfulness,
      fairness,
      recommendation,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      comment: comment || undefined,
      status: "pending",
    })

    alert("评价已提交，等待审核")
    router.push("/my-reviews")
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const renderRatingInput = (label: string, value: number, onChange: (val: number) => void) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 flex items-center justify-center text-xl transition-colors cursor-pointer focus:outline-none ${star <= value ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
          >
            <Star className="w-5 h-5" />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium w-6 text-center">{value}</span>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">写评价</CardTitle>
          <CardDescription>请根据您的真实课堂体验进行评价</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                选择课程和教师
              </h3>
              
              {isTeacherPreselected && preselectedTeacher && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-primary">已预选教师：{preselectedTeacher.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">请选择该教师教授的课程</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">课程 *</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value)
                      if (!selectedTeacherId) {
                        const course = courses.find((c: Course) => c.id === e.target.value)
                        if (course) {
                          const ct = courseTeachers.find((ct: CourseTeacher) => ct.course_id === course.id)
                          if (ct) {
                            setSelectedTeacherId(ct.teacher_id)
                          }
                        }
                      }
                    }}
                    className="w-full h-11 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  >
                    <option value="">请选择课程</option>
                    {selectedTeacherId
                      ? teacherCourses.filter((c: Course) => c.is_active).map((course: Course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))
                      : courses.filter((c: Course) => c.is_active).map((course: Course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                  </select>
                  {hasNoCourses && (
                    <p className="text-sm text-destructive">该教师暂无教授的课程</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">教师 *</label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => {
                      setSelectedTeacherId(e.target.value)
                      setSelectedCourseId("")
                    }}
                    className={`w-full h-11 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${hasNoCourses ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={hasNoCourses}
                    required
                  >
                    {!selectedTeacherId && <option value="">请选择教师</option>}
                    {availableTeachers.filter((t: Teacher) => t.is_active).map((teacher: Teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  {hasNoTeachers && (
                    <p className="text-sm text-destructive">该课程暂无授课教师</p>
                  )}
                </div>
              </div>
            </div>

            {hasAlreadyReviewed && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                <p className="font-medium">您已经对该课程和教师进行过评价了</p>
                <p className="text-sm mt-1">每位学生只能对同一课程和教师评价一次</p>
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                评分
              </h3>
              
              <div className="space-y-4">
                {renderRatingInput("综合评分", overallRating, setOverallRating)}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-4">详细评分</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {renderRatingInput("课程难度", difficulty, setDifficulty)}
                    {renderRatingInput("作业量", workload, setWorkload)}
                    {renderRatingInput("考试压力", examPressure, setExamPressure)}
                    {renderRatingInput("讲课清晰度", clarity, setClarity)}
                    {renderRatingInput("答疑帮助", helpfulness, setHelpfulness)}
                    {renderRatingInput("评分公平性", fairness, setFairness)}
                    {renderRatingInput("推荐程度", recommendation, setRecommendation)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                标签（可选）
              </h3>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                评论（可选）
              </h3>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="请输入您的评价，分享您的课堂体验..."
                rows={5}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={!selectedCourseId || !selectedTeacherId || hasAlreadyReviewed || hasNoCourses}
            >
              提交评价
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              提交后评价将进入审核队列，审核通过后才会显示
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
