"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import {
  Profile,
  Teacher,
  Course,
  CourseTeacher,
  Review,
  Report,
  ModerationLog,
  InviteCode,
} from "@/types"
import {
  mockProfiles,
  mockTeachers,
  mockCourses,
  mockCourseTeachers,
  mockReviews,
  mockReports,
  mockModerationLogs,
  mockInviteCodes,
} from "./mock/mockData"

interface AppContextType {
  currentUser: Profile | null
  profiles: Profile[]
  teachers: Teacher[]
  courses: Course[]
  courseTeachers: CourseTeacher[]
  reviews: Review[]
  reports: Report[]
  moderationLogs: ModerationLog[]
  inviteCodes: InviteCode[]

  setCurrentUser: (user: Profile | null) => void
  addReview: (review: Omit<Review, "id" | "created_at" | "updated_at">) => void
  updateReviewStatus: (reviewId: string, status: "approved" | "rejected", rejectReason?: string, moderatorId?: string) => void
  deleteReview: (reviewId: string) => void
  addReport: (report: Omit<Report, "id" | "created_at">) => void
  updateReportStatus: (reportId: string, status: "resolved", handledBy?: string) => void
  addTeacher: (teacher: Omit<Teacher, "id">) => void
  addCourse: (course: Omit<Course, "id">) => void
  toggleTeacherActive: (teacherId: string) => void
  toggleCourseActive: (courseId: string) => void
  addModerationLog: (log: Omit<ModerationLog, "id" | "created_at">) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<Profile | null>(mockProfiles[2])
  const [profiles] = useState<Profile[]>(mockProfiles)
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [courseTeachers] = useState<CourseTeacher[]>(mockCourseTeachers)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(mockModerationLogs)
  const [inviteCodes] = useState<InviteCode[]>(mockInviteCodes)

  const setCurrentUser = useCallback((user: Profile | null) => {
    setCurrentUserState(user)
  }, [])

  const addReview = useCallback((review: Omit<Review, "id" | "created_at" | "updated_at">) => {
    setReviews((prev) => [...prev, {
      ...review,
      id: `review-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
  }, [])

  const updateReviewStatus = useCallback((reviewId: string, status: "approved" | "rejected", rejectReason?: string, moderatorId?: string) => {
    setReviews((prev) => prev.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            status,
            reject_reason: rejectReason,
            reviewed_by: moderatorId,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        : r
    ))
  }, [])

  const deleteReview = useCallback((reviewId: string) => {
    setReviews((prev) => prev.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_by: currentUser?.id,
            updated_at: new Date().toISOString(),
          }
        : r
    ))
  }, [currentUser])

  const addReport = useCallback((report: Omit<Report, "id" | "created_at">) => {
    setReports((prev) => [...prev, {
      ...report,
      id: `report-${Date.now()}`,
      created_at: new Date().toISOString(),
    }])
  }, [])

  const updateReportStatus = useCallback((reportId: string, status: "resolved", handledBy?: string) => {
    setReports((prev) => prev.map((r) =>
      r.id === reportId
        ? {
            ...r,
            status,
            handled_by: handledBy,
            handled_at: new Date().toISOString(),
          }
        : r
    ))
  }, [])

  const addTeacher = useCallback((teacher: Omit<Teacher, "id">) => {
    setTeachers((prev) => [...prev, {
      ...teacher,
      id: `teacher-${Date.now()}`,
    }])
  }, [])

  const addCourse = useCallback((course: Omit<Course, "id">) => {
    setCourses((prev) => [...prev, {
      ...course,
      id: `course-${Date.now()}`,
    }])
  }, [])

  const toggleTeacherActive = useCallback((teacherId: string) => {
    setTeachers((prev) => prev.map((t) =>
      t.id === teacherId ? { ...t, is_active: !t.is_active } : t
    ))
  }, [])

  const toggleCourseActive = useCallback((courseId: string) => {
    setCourses((prev) => prev.map((c) =>
      c.id === courseId ? { ...c, is_active: !c.is_active } : c
    ))
  }, [])

  const addModerationLog = useCallback((log: Omit<ModerationLog, "id" | "created_at">) => {
    setModerationLogs((prev) => [...prev, {
      ...log,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString(),
    }])
  }, [])

  return (
    <AppContext.Provider value={{
      currentUser,
      profiles,
      teachers,
      courses,
      courseTeachers,
      reviews,
      reports,
      moderationLogs,
      inviteCodes,
      setCurrentUser,
      addReview,
      updateReviewStatus,
      deleteReview,
      addReport,
      updateReportStatus,
      addTeacher,
      addCourse,
      toggleTeacherActive,
      toggleCourseActive,
      addModerationLog,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
