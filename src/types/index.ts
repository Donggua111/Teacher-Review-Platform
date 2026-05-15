export type Role = "student" | "moderator" | "admin"

export type UserStatus = "active" | "banned"

export type ReviewStatus = "pending" | "approved" | "rejected"

export type ReportStatus = "pending" | "resolved"

export interface Profile {
  id: string
  role: Role
  status: UserStatus
  created_at: string
  banned_reason?: string
  invite_code_id?: string
}

export interface Teacher {
  id: string
  name: string
  title?: string
  department?: string
  is_active: boolean
}

export interface Course {
  id: string
  name: string
  code?: string
  department?: string
  subject?: string
  course_type?: string
  description?: string
  is_active: boolean
}

export interface CourseTeacher {
  id: string
  course_id: string
  teacher_id: string
  school_year?: string
  semester?: string
  grade_level?: string
  course_type?: string
  is_active: boolean
}

export interface Review {
  id: string
  user_id: string
  course_id: string
  teacher_id: string
  school_year?: string
  semester?: string
  overall_rating: number
  difficulty: number
  workload: number
  exam_pressure: number
  clarity: number
  helpfulness: number
  fairness: number
  recommendation: number
  tags?: string[]
  comment?: string
  status: ReviewStatus
  reject_reason?: string
  reviewed_by?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface Report {
  id: string
  review_id: string
  reporter_id: string
  reason: string
  description?: string
  status: ReportStatus
  handled_by?: string
  handled_at?: string
  created_at: string
}

export interface ModerationLog {
  id: string
  moderator_id: string
  target_type: "review" | "report" | "user"
  target_id: string
  action: "approve" | "reject" | "warn" | "ban"
  reason?: string
  created_at: string
}

export interface InviteCode {
  id: string
  code: string
  status: "unused" | "used" | "disabled"
  used_by?: string
  used_at?: string
  created_at: string
}
