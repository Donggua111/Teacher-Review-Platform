export const APP_NAME = "评价初中老师"

export const APP_DESCRIPTION = "初中教师与课程评价平台"

export const ROUTES = {
  home: "/",
  courses: "/courses",
  teachers: "/teachers",
  reviewNew: "/review/new",
  myReviews: "/my-reviews",
  admin: "/admin",
  adminReviews: "/admin/reviews",
  adminReports: "/admin/reports",
  adminTeachers: "/admin/teachers",
  adminCourses: "/admin/courses",
} as const

export const REPORT_REASONS = [
  { value: "人身攻击", label: "人身攻击" },
  { value: "不实信息", label: "不实信息" },
  { value: "泄露隐私", label: "泄露隐私" },
  { value: "其他", label: "其他" },
] as const

export const SCHOOL_YEARS = [
  "2024-2025",
  "2023-2024",
  "2022-2023",
] as const

export const SEMESTERS = [
  { value: "秋", label: "秋季" },
  { value: "春", label: "春季" },
] as const

export const GRADE_LEVELS = [
  { value: "初一", label: "初一" },
  { value: "初二", label: "初二" },
  { value: "初三", label: "初三" },
] as const

export const COURSE_TYPES = [
  { value: "必修", label: "必修" },
  { value: "选修", label: "选修" },
] as const

export const SUBJECTS = [
  { id: "chinese", label: "语文" },
  { id: "math", label: "数学" },
  { id: "english", label: "英语" },
  { id: "physics", label: "物理" },
  { id: "chemistry", label: "化学" },
  { id: "politics", label: "政治" },
  { id: "history", label: "历史" },
  { id: "geography", label: "地理" },
  { id: "biology", label: "生物" },
  { id: "pe", label: "体育" },
  { id: "information_technology", label: "信息技术" },
  { id: "music", label: "音乐" },
  { id: "art", label: "美术" },
  { id: "psychology", label: "心理" },
  { id: "comprehensive_practice", label: "综合实践" },
  { id: "other", label: "其他" },
] as const

export const SUBJECT_LABELS = SUBJECTS.reduce((acc, s) => {
  acc[s.id] = s.label
  return acc
}, {} as Record<string, string>)