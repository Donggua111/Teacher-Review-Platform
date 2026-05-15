import { Review, ReviewStatus } from "@/types"

export function getReviewStatusLabel(status: ReviewStatus): string {
  const labels: Record<ReviewStatus, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
  }
  return labels[status]
}

export function getReviewStatusColor(status: ReviewStatus): string {
  const colors: Record<ReviewStatus, string> = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
  }
  return colors[status]
}

export function getAverageRating(review: Review): number {
  const ratings = [
    review.overall_rating,
    review.difficulty,
    review.workload,
    review.exam_pressure,
    review.clarity,
    review.helpfulness,
    review.fairness,
  ]
  const sum = ratings.reduce((acc, r) => acc + r, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export const RATING_LABELS = {
  overall_rating: "综合评分",
  difficulty: "难度",
  workload: "作业量",
  exam_pressure: "考试压力",
  clarity: "讲解清晰",
  helpfulness: "有帮助",
  fairness: "公平性",
  recommendation: "推荐指数",
} as const

export const RATING_RANGE = {
  min: 1,
  max: 5,
} as const

export const REVIEW_TAGS = [
  "讲得清楚",
  "有耐心",
  "作业少",
  "作业多",
  "课堂生动",
  "有挑战",
  "有收获",
  "考试难",
  "给分高",
  "给分低",
] as const
