"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CheckCircle, Flag, Users, BookOpen } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "首页", icon: Home },
    { href: "/admin/reviews", label: "评论审核", icon: CheckCircle },
    { href: "/admin/reports", label: "举报处理", icon: Flag },
    { href: "/admin/teachers", label: "教师管理", icon: Users },
    { href: "/admin/courses", label: "课程管理", icon: BookOpen },
  ]

  return (
    <div className="w-64 bg-muted p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">管理后台</h2>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
