"use client"

import { useAppContext } from "@/lib/store"
import { Review, Report, Teacher, Course } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Flag, Users, BookOpen, LayoutDashboard } from "lucide-react"

export default function AdminHomePage() {
  const { reviews, reports, teachers, courses } = useAppContext()
  const pendingReviews = reviews.filter((r: Review) => r.status === "pending" && !r.is_deleted)
  const pendingReports = reports.filter((r: Report) => r.status === "pending")
  const approvedReviews = reviews.filter((r: Review) => r.status === "approved" && !r.is_deleted)

  const stats = [
    {
      title: "待审核评价",
      count: pendingReviews.length,
      icon: FileText,
      href: "/admin/reviews",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "待处理举报",
      count: pendingReports.length,
      icon: Flag,
      href: "/admin/reports",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "教师数量",
      count: teachers.filter((t: Teacher) => t.is_active).length,
      icon: Users,
      href: "/admin/teachers",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "课程数量",
      count: courses.filter((c: Course) => c.is_active).length,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "已通过评价",
      count: approvedReviews.length,
      icon: FileText,
      href: "/admin/reviews",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "总评价数",
      count: reviews.filter((r: Review) => !r.is_deleted).length,
      icon: LayoutDashboard,
      href: "/admin/reviews",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="text-muted-foreground mt-2">审核工作台</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.count}</p>
                </div>
              </div>
              <Link href={stat.href}>
                <Button variant="outline" className="mt-4 w-full">
                  查看详情
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
