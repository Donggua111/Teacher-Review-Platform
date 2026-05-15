"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppContext } from "@/lib/store"
import { Profile } from "@/types"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"

export default function Navbar() {
  const { currentUser, setCurrentUser, profiles } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      admin: "管理员",
      moderator: "审核员",
      student: "学生",
    }
    return roleLabels[role] || role
  }

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/courses", label: "课程" },
    { href: "/teachers", label: "老师" },
    { href: "/my-reviews", label: "我的评价" },
  ]

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            评价初中老师
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {currentUser && (currentUser.role === "admin" || currentUser.role === "moderator") && (
              <Link
                href="/admin"
                className="hover:text-accent transition-colors"
              >
                管理后台
              </Link>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-primary-foreground/20">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{currentUser ? getRoleLabel(currentUser.role) : ""}</span>
              </div>
              <select
                value={currentUser?.id || ""}
                onChange={(e) => {
                  const user = profiles.find((p: Profile) => p.id === e.target.value)
                  setCurrentUser(user || null)
                }}
                className="bg-primary-foreground/10 text-primary-foreground px-2 py-1 rounded text-sm border border-primary-foreground/20 focus:outline-none focus:ring-1 focus:ring-primary-foreground/50"
              >
                {profiles.map((profile: Profile) => (
                  <option key={profile.id} value={profile.id}>
                    {getRoleLabel(profile.role)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {currentUser && (currentUser.role === "admin" || currentUser.role === "moderator") && (
                <Link
                  href="/admin"
                  className="py-2 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  管理后台
                </Link>
              )}
              <div className="flex items-center gap-3 pt-4 border-t border-primary-foreground/20 mt-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{currentUser ? getRoleLabel(currentUser.role) : ""}</span>
                </div>
                <select
                  value={currentUser?.id || ""}
                  onChange={(e) => {
                    const user = profiles.find((p: Profile) => p.id === e.target.value)
                    setCurrentUser(user || null)
                  }}
                  className="bg-primary-foreground/10 text-primary-foreground px-2 py-1 rounded text-sm border border-primary-foreground/20 focus:outline-none"
                >
                  {profiles.map((profile: Profile) => (
                    <option key={profile.id} value={profile.id}>
                      {getRoleLabel(profile.role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
