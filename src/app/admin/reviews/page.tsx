"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/store"
import { Review, Course, Teacher, Profile } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, Star, Tag, User } from "lucide-react"

export default function ReviewsAdminPage() {
  const {
    reviews,
    courses,
    teachers,
    profiles,
    currentUser,
    updateReviewStatus,
    addModerationLog,
  } = useAppContext()
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({})

  const pendingReviews = reviews.filter((r: Review) => r.status === "pending" && !r.is_deleted)

  const getUserInfo = (userId: string) => {
    return profiles.find((p: Profile) => p.id === userId)
  }

  const handleApprove = (reviewId: string) => {
    if (!currentUser) return
    updateReviewStatus(reviewId, "approved", undefined, currentUser.id)
    addModerationLog({
      moderator_id: currentUser.id,
      target_type: "review",
      target_id: reviewId,
      action: "approve",
    })
  }

  const handleReject = (reviewId: string) => {
    if (!currentUser) return
    const reason = rejectReasons[reviewId] || ""
    updateReviewStatus(reviewId, "rejected", reason, currentUser.id)
    addModerationLog({
      moderator_id: currentUser.id,
      target_type: "review",
      target_id: reviewId,
      action: "reject",
      reason,
    })
    setRejectReasons((prev) => {
      const { [reviewId]: _, ...rest } = prev
      return rest
    })
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
        <h1 className="text-3xl font-bold">评论审核</h1>
        <p className="text-muted-foreground mt-2">待审核评价: {pendingReviews.length} 条</p>
      </div>

      {pendingReviews.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">暂无待审核的评价</p>
            <p className="text-sm text-muted-foreground mt-2">所有评价均已处理完毕</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingReviews.map((review: Review) => {
            const course = courses.find((c: Course) => c.id === review.course_id)
            const teacher = teachers.find((t: Teacher) => t.id === review.teacher_id)
            const user = getUserInfo(review.user_id)
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
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {user?.role === "student" ? "匿名学生" : "管理员"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-xl font-bold text-yellow-500">
                          {review.overall_rating}
                        </span>
                      </div>
                    </div>
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
                    <div className="bg-background p-4 rounded-lg border border-border mb-6">
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  )}
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-sm font-medium mb-2">拒绝原因（选填）</label>
                      <Textarea
                        placeholder="请输入拒绝原因（如果拒绝）"
                        value={rejectReasons[review.id] || ""}
                        onChange={(e) =>
                          setRejectReasons((prev) => ({
                            ...prev,
                            [review.id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={() => handleApprove(review.id)} className="flex-1 gap-2">
                        <Check className="h-4 w-4" />
                        通过审核
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(review.id)}
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        拒绝
                      </Button>
                    </div>
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
