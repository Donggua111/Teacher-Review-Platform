"use client"

import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Review, Course, Teacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Info, GraduationCap } from "lucide-react"
import { SUBJECTS } from "@/constants"

export default function HomePage() {
  const { courses, teachers, reviews } = useAppContext()
  const approvedReviews = reviews.filter((r: Review) => r.status === "approved")
  const recentlyReviewedCourses = approvedReviews
    .map((review: Review) => ({
      course: courses.find((c: Course) => c.id === review.course_id),
      teacher: teachers.find((t: Teacher) => t.id === review.teacher_id),
      review,
    }))
    .filter((item: { course: Course | undefined; teacher: Teacher | undefined; review: Review }) => item.course && item.teacher)
    .slice(0, 6)

  return (
    <div className="space-y-12">
      <section className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
          评价初中老师
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          基于真实课堂体验，为学弟学妹提供客观参考
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link href="/courses" className="flex-1">
            <Button size="lg" className="w-full h-12">
              <BookOpen className="mr-2 h-5 w-5" />
              浏览课程
            </Button>
          </Link>
          <Link href="/teachers" className="flex-1">
            <Button size="lg" className="w-full h-12">
              <User className="mr-2 h-5 w-5" />
              浏览老师
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          评价需审核后展示，确保内容真实可信
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">最近评价的课程</h2>
          <p className="text-sm text-muted-foreground mt-1">真实学生分享，为你提供参考</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentlyReviewedCourses.map((item: { course: Course | undefined; teacher: Teacher | undefined; review: Review }, index: number) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">{item.course?.name}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.course?.code} | {item.teacher?.name}
                </p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {item.review.comment || "暂无评价内容"}
                  </p>
                  {item.review.tags && item.review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.review.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 bg-secondary/70 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Link href={`/courses/${item.course?.id}`} className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    查看详情
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">按科目浏览</h2>
        <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
          {SUBJECTS.map((subject) => (
            <Link key={subject.id} href={`/courses?subject=${subject.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <p className="font-medium group-hover:text-primary transition-colors">{subject.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 rounded-xl p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">平台规则</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="text-primary font-medium">1.</span>
                <p className="text-sm text-muted-foreground">只可以对您真实上过的课程和老师进行评价</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-medium">2.</span>
                <p className="text-sm text-muted-foreground">请保持文明，不发表攻击性言论</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-medium">3.</span>
                <p className="text-sm text-muted-foreground">不泄露个人隐私</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-medium">4.</span>
                <p className="text-sm text-muted-foreground">评价需要审核后才会显示</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}