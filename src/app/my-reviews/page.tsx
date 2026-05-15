"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Review, Course, Teacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Star, Tag, Trash2 } from "lucide-react"

export default function MyReviewsPage() {
  const router = useRouter()
  const { courses, teachers, reviews, currentUser, deleteReview } = useAppContext()

  const myReviews = currentUser ? reviews.filter((r: Review) => r.user_id === currentUser.id && !r.is_deleted) : []

  const handleDelete = (reviewId: string) => {
    if (confirm("确定要删除这条评价吗？删除后将无法恢复。")) {
      deleteReview(reviewId)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    const labels: Record<string, string> = {
      pending: "待审核",
      approved: "已通过",
      rejected: "已拒绝",
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <Link href="/review/new">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            写评价
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">我的评价</h1>
        <p className="text-muted-foreground mt-2">共 {myReviews.length} 条评价</p>
      </div>

      {myReviews.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">暂无评价</p>
            <Link href="/review/new" className="inline-block mt-4">
              <Button variant="outline">
                写第一条评价
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {myReviews.map((review: Review) => {
            const course = courses.find((c: Course) => c.id === review.course_id)
            const teacher = teachers.find((t: Teacher) => t.id === review.teacher_id)
            return (
              <Card key={review.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        教师: {teacher?.name}
                      </p>
                    </div>
                    {getStatusBadge(review.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-xl font-bold text-yellow-500">
                      {review.overall_rating}
                    </span>
                    <span className="text-sm text-muted-foreground">综合评分</span>
                  </div>
                  
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-4 w-4 text-muted-foreground" />
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
                    <div className="bg-muted/50 p-4 rounded-lg mb-4">
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  )}
                  
                  {review.status === "rejected" && review.reject_reason && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                      <p className="text-sm font-medium text-red-800">拒绝原因</p>
                      <p className="text-sm text-red-700 mt-1">{review.reject_reason}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link href={`/courses/${course?.id}`}>
                      <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-3 w-3" />
                        查看课程
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(review.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
