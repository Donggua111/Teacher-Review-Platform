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
      <section className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">评价初中老师</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          基于真实课堂体验，为学弟学妹提供客观参考
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
          <Link href="/courses" className="flex-1">
            <Button className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              浏览课程
            </Button>
          </Link>
          <Link href="/teachers" className="flex-1">
            <Button className="w-full">
              <User className="mr-2 h-4 w-4" />
              浏览老师
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">最近评价的课程</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentlyReviewedCourses.map((item: { course: Course | undefined; teacher: Teacher | undefined; review: Review }, index: number) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{item.course?.name}</CardTitle>
                {item.course?.code && (
                  <p className="text-xs text-muted-foreground">{item.course.code}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  授课教师: {item.teacher?.name}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.review.comment || "暂无评价内容"}
                </p>
                {item.review.tags && item.review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.review.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-secondary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link href={`/courses/${item.course?.id}`}>
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