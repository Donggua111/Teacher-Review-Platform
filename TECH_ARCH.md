# 技术架构文档

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 14 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.x |
| 组件库 | shadcn/ui | latest |
| 图标 | Lucide React | latest |
| 状态管理 | React Context | - |
| 打包 | Next.js 内置 | - |

## 目录结构

```
评价初中老师/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── admin/              # 后台管理页面
│   │   │   ├── courses/
│   │   │   ├── reports/
│   │   │   ├── reviews/
│   │   │   ├── teachers/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── courses/            # 课程相关页面
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── teachers/           # 教师相关页面
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── my-reviews/         # 我的评价
│   │   ├── review/new/         # 提交评价
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css
│   ├── components/             # React 组件
│   │   ├── layout/             # 布局组件
│   │   │   ├── Navbar.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── textarea.tsx
│   │   ├── courses/            # 课程相关组件（待拆分）
│   │   ├── teachers/           # 教师相关组件（待拆分）
│   │   ├── reviews/            # 评价相关组件（待拆分）
│   │   └── admin/              # 后台管理组件（待拆分）
│   ├── lib/                    # 工具函数和业务逻辑
│   │   ├── mock/               # Mock 数据
│   │   │   └── mockData.ts
│   │   ├── store-context.tsx   # React Context 状态管理（真实实现）
│   │   ├── store.ts            # 兼容 re-export 入口
│   │   ├── store.tsx           # 兼容 re-export 入口
│   │   ├── permissions.ts      # 权限判断工具
│   │   ├── review-utils.ts     # 评价相关工具
│   │   └── utils.ts            # 通用工具函数
│   ├── types/                  # TypeScript 类型定义
│   │   └── index.ts
│   └── constants/              # 常量定义
│       └── index.ts
├── README.md                   # 项目说明
├── PRD.md                      # 产品需求文档
├── TECH_ARCH.md                # 技术架构文档
├── CHANGELOG.md                # 变更日志
├── TEST_PLAN.md                # 测试验收计划
├── TODO.md                     # 待办事项
├── AI_DEV_RULES.md             # AI 开发规则
├── next.config.js              # Next.js 配置
├── tailwind.config.ts          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
└── package.json
```

## 状态管理整理方案

### 当前状态

| 文件 | 职责 |
|------|------|
| `store-context.tsx` | 真实的 React Context 状态管理实现 |
| `store.ts` | 兼容 re-export 入口，从 store-context 导出 |
| `store.tsx` | 兼容 re-export 入口，从 store-context 导出 |

### 设计说明

- `store-context.tsx` 是唯一的真实实现
- `store.ts` 和 `store.tsx` 保留为兼容入口，不包含重复逻辑
- 所有页面可保持从 `@/lib/store` 导入，无需修改
- 后续 Phase 2 时可统一调整入口文件

## Mock Data 设计

### 数据模型

位于 `src/lib/mock/mockData.ts`，包含以下 Mock 数据：

| 数据 | 类型 | 说明 |
|------|------|------|
| mockProfiles | Profile[] | 用户配置（admin/moderator/student） |
| mockTeachers | Teacher[] | 教师列表 |
| mockCourses | Course[] | 课程列表 |
| mockCourseTeachers | CourseTeacher[] | 课程-教师关联 |
| mockReviews | Review[] | 评价列表 |
| mockReports | Report[] | 举报列表 |
| mockModerationLogs | ModerationLog[] | 审核日志 |
| mockInviteCodes | InviteCode[] | 邀请码 |

### 数据关系

```
Profile (用户)
    └── Role: student | moderator | admin

Course (课程) 1:n CourseTeacher n:1 Teacher (教师)
                              │
                              ↓
                    Review (评价) 1:1 Report (举报)
```

### 初始数据状态

- 3 个用户：admin（管理员）、moderator（审核员）、student（学生）
- 4 位教师：数学、语文、英语、物理各一
- 4 门课程：对应上述教师
- 4 条评价：1 approved、1 pending、1 rejected、1 不同状态的举报

## 软删除机制

### Review 软删除字段

| 字段 | 类型 | 说明 |
|------|------|------|
| is_deleted | boolean? | 是否已删除，true 表示软删除 |
| deleted_at | string? | 删除时间（ISO 格式） |
| deleted_by | string? | 删除者用户 ID |

### 软删除过滤规则

以下页面会过滤 `is_deleted === true` 的评价：

| 页面 | 过滤条件 |
|------|----------|
| /courses/[id] | 只显示 `status === "approved" && !is_deleted` |
| /teachers/[id] | 只显示 `status === "approved" && !is_deleted` |
| /admin/reviews | 只显示 `status === "pending" && !is_deleted` |
| /my-reviews | 只显示 `user_id === currentUser.id && !is_deleted` |

### deleteReview 方法

位于 `store-context.tsx`，实现软删除：

```typescript
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
```

## 角色显示文案

| 内部值 | 显示文案 |
|------|------|
| admin | 管理员 |
| moderator | 审核员 |
| student | 学生 |

显示逻辑位于 `src/components/layout/Navbar.tsx`，内部逻辑仍使用英文值。

## 为什么当前阶段不接后端

### 原因

1. **快速迭代**: 前端 Mock 可以快速验证产品方向
2. **降低风险**: 在确认产品价值前不投入后端资源
3. **专注体验**: 先行验证核心用户流程和交互体验
4. **阶段清晰**: 分离「验证想法」和「实现规模」两个阶段

### 后续 Supabase 接入点

Phase 2 接入时需要：

1. 创建 Supabase 项目
2. 配置 Auth 认证（Email/Password）
3. 创建数据库表结构
4. 配置 RLS (Row Level Security) 策略
5. 替换 Mock Data 为 API 调用
6. 实现邀请码注册机制
7. 添加实时订阅（可选）

详见 [PRD.md](./PRD.md) Phase 2 规划。
