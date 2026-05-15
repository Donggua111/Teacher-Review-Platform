"use client"

import { useAppContext } from "@/lib/store"
import AdminSidebar from "@/components/layout/AdminSidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { currentUser } = useAppContext()

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "moderator")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">您没有权限访问此页面</p>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  )
}
