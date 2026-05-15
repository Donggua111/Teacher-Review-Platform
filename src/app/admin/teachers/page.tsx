"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/store"
import { Teacher } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeachersAdminPage() {
  const { teachers, addTeacher, toggleTeacherActive, currentUser } = useAppContext()
  const [newTeacherName, setNewTeacherName] = useState("")
  const [newTeacherTitle, setNewTeacherTitle] = useState("")
  const [newTeacherDepartment, setNewTeacherDepartment] = useState("")

  const handleAddTeacher = () => {
    if (!newTeacherName || !currentUser) return
    addTeacher({
      name: newTeacherName,
      title: newTeacherTitle || undefined,
      department: newTeacherDepartment || undefined,
      is_active: true,
    })
    setNewTeacherName("")
    setNewTeacherTitle("")
    setNewTeacherDepartment("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">教师管理</h1>

      <Card>
        <CardHeader>
          <CardTitle>添加教师</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="姓名"
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
            />
            <Input
              placeholder="职称（选填）"
              value={newTeacherTitle}
              onChange={(e) => setNewTeacherTitle(e.target.value)}
            />
            <Input
              placeholder="部门（选填）"
              value={newTeacherDepartment}
              onChange={(e) => setNewTeacherDepartment(e.target.value)}
            />
          </div>
          <Button className="mt-4" onClick={handleAddTeacher}>
            添加
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {teachers.map((teacher: Teacher) => (
          <Card key={teacher.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  {teacher.title && (
                    <p className="text-sm text-muted-foreground">{teacher.title}</p>
                  )}
                  {teacher.department && (
                    <p className="text-sm text-muted-foreground">{teacher.department}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {teacher.is_active ? "启用" : "禁用"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTeacherActive(teacher.id)}
                  >
                    {teacher.is_active ? "禁用" : "启用"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
