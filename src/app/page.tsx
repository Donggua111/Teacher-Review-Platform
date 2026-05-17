"use client"

import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Review, Course, Teacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, User, PenLine, FileText, Shield, AlertCircle, Info, GraduationCap, CheckCircle2, Clock, Target } from "lucide-react"
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
    <div className="space-y-16">
      <section className="text-center py-16 md:py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-6 md:mb-8">
          <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-foreground">
          课程与教师评价平台
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
          面向学生的课程反馈平台，收集真实课堂体验，为学弟学妹提供客观参考
        </p>
        
        <div className="bg-muted/50 rounded-lg p-4 md:p-6 max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">当前阶段：Phase 1 Mock Frontend</span>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            本版本为前端原型，不含真实登录和数据库，所有数据均为模拟数据
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-lg mx-auto px-4">
          <Link href="/courses" className="flex-1">
            <Button size="lg" className="w-full h-11 md:h-12">
              <BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              浏览课程
            </Button>
          </Link>
          <Link href="/teachers" className="flex-1">
            <Button size="lg" className="w-full h-11 md:h-12">
              <User className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              浏览教师
            </Button>
          </Link>
          <Link href="/review/new" className="flex-1">
            <Button size="lg" variant="outline" className="w-full h-11 md:h-12">
              <PenLine className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              提交评价
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">平台功能模块</h2>
          <p className="text-sm text-muted-foreground mt-1">完整的评价与审核流程</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">课程浏览</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">16 个科目分类</p>
                <p className="mt-3 text-sm text-muted-foreground">浏览所有课程，查看已审核评价，了解课程详情</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">教师信息</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">查看教师详情</p>
                <p className="mt-3 text-sm text-muted-foreground">查看教师授课课程和学生评价，找到写评价入口</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <PenLine className="h-6 w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">提交评价</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">多维度评分</p>
                <p className="mt-3 text-sm text-muted-foreground">填写课程评分、标签和评价内容，提交后等待审核</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">我的评价</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">查看评价状态</p>
                <p className="mt-3 text-sm text-muted-foreground">查看自己提交的评价，支持删除自己的评价（软删除）</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">评价审核</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">审核员功能</p>
                <p className="mt-3 text-sm text-muted-foreground">审核待评价内容，通过或拒绝评价（需填写拒绝原因）</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                <AlertCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">举报处理</h3>
                <p className="mt-1 text-xs font-medium text-muted-foreground">处理用户举报</p>
                <p className="mt-3 text-sm text-muted-foreground">接收并处理用户举报，维护平台内容安全</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">已通过审核的评价</h2>
          <p className="text-sm text-muted-foreground mt-1">真实学生分享，为你提供参考</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentlyReviewedCourses.map((item: { course: Course | undefined; teacher: Teacher | undefined; review: Review }, index: number) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg font-semibold">{item.course?.name}</CardTitle>
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

      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">按科目浏览</h2>
          <p className="text-sm text-muted-foreground mt-1">选择科目查看对应课程</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SUBJECTS.map((subject) => (
            <Link key={subject.id} href={`/courses?subject=${subject.id}`}>
              <button className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:border-primary hover:bg-primary/5 hover:text-primary">
                {subject.label}
              </button>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">安全边界说明</h2>
          <p className="text-sm text-muted-foreground mt-1">本平台致力于构建健康的反馈环境</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="h-full rounded-2xl border bg-blue-50/50 border-blue-200 p-5 md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">非匿名攻击平台</h3>
                <p className="mt-3 text-sm text-muted-foreground">本平台不是匿名攻击教师的工具，评价需经过审核才能展示</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-green-50/50 border-green-200 p-5 md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">非排行榜系统</h3>
                <p className="mt-3 text-sm text-muted-foreground">不做教师排行榜、红黑榜，专注于提供客观反馈参考</p>
              </div>
            </div>
          </div>

          <div className="h-full rounded-2xl border bg-purple-50/50 border-purple-200 p-5 md:p-6">
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                <CheckCircle2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <h3 className="text-base font-semibold">结构化反馈</h3>
                <p className="mt-3 text-sm text-muted-foreground">评价采用多维度评分+标签+文本形式，便于审核和参考</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">下一阶段计划 (Phase 2)</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">真实用户登录</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">Supabase 数据库</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">邀请码注册机制</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">RLS 权限控制</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 rounded-xl p-6 md:p-8">
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
                <p className="text-sm text-muted-foreground">不泄露个人隐私信息</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-medium">4.</span>
                <p className="text-sm text-muted-foreground">评价需要审核后才会公开显示</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
