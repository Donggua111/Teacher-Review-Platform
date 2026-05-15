import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { AppProvider } from "@/lib/store"
import Navbar from "@/components/layout/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "评价初中老师",
  description: "初中教师与课程评价平台",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        <AppProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto p-4">{children}</main>
        </AppProvider>
      </body>
    </html>
  )
}
