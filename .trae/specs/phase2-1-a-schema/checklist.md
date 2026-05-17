# Phase 2.1-A Schema 创建 Checklist

## 文件创建检查

- [ ] supabase/schema.sql 已创建
- [ ] supabase/seed_mock.sql 已创建
- [ ] supabase/README.md 已创建

## schema.sql 内容检查

### 扩展
- [ ] uuid-ossp 扩展已启用

### 表结构
- [ ] profiles 表存在，包含所有必要字段
- [ ] teachers 表存在，包含所有必要字段
- [ ] courses 表存在，包含所有必要字段
- [ ] course_teachers 表存在，包含 UNIQUE(course_id, teacher_id)
- [ ] reviews 表存在，包含所有必要字段和 CHECK 约束
- [ ] reports 表存在，包含所有必要字段和 CHECK 约束

### Trigger
- [ ] handle_updated_at() function 已创建
- [ ] profiles 表应用了 updated_at trigger
- [ ] teachers 表应用了 updated_at trigger
- [ ] courses 表应用了 updated_at trigger
- [ ] reviews 表应用了 updated_at trigger

### RLS
- [ ] profiles 表已开启 RLS
- [ ] teachers 表已开启 RLS
- [ ] courses 表已开启 RLS
- [ ] course_teachers 表已开启 RLS
- [ ] reviews 表已开启 RLS
- [ ] reports 表已开启 RLS

### RLS Policies
- [ ] profiles: 允许查看所有 profiles
- [ ] profiles: 允许用户更新自己的 profile
- [ ] profiles: 允许 admin 管理所有 profiles
- [ ] teachers: 允许所有人查看 is_active=true
- [ ] teachers: 允许 admin 管理
- [ ] courses: 允许所有人查看 is_active=true
- [ ] courses: 允许 admin 管理
- [ ] course_teachers: 允许所有人查看
- [ ] course_teachers: 允许 admin 管理
- [ ] reviews: 允许查看 approved 且未删除
- [ ] reviews: 允许用户查看自己的 reviews
- [ ] reviews: 允许登录用户创建（status=pending）
- [ ] reviews: 允许用户更新自己的 pending reviews
- [ ] reviews: 允许用户软删除自己的 reviews
- [ ] reviews: 允许 moderator/admin 审核
- [ ] reports: 允许登录用户创建
- [ ] reports: 允许用户查看自己的 reports
- [ ] reports: 允许 moderator/admin 处理

### Helper Functions
- [ ] get_current_user_role() function 存在
- [ ] is_admin() function 存在
- [ ] is_moderator_or_admin() function 存在

## seed_mock.sql 内容检查

- [ ] 顶部注释说明仅用于本地开发
- [ ] 不包含真实学校名称
- [ ] 不包含真实教师姓名
- [ ] 不包含真实学生姓名
- [ ] 使用虚构数据（如：测试教师A、数学课程B）

## README.md 内容检查

- [ ] 本目录用途已说明
- [ ] schema.sql 用途已说明
- [ ] seed_mock.sql 用途已说明
- [ ] 安全提示已包含

## 文档更新检查

- [ ] TODO.md 已更新
- [ ] TEST_PLAN.md 已更新
- [ ] CHANGELOG.md 已更新

## 禁止文件检查

- [ ] 未修改 src/ 目录
- [ ] 未修改 package.json
- [ ] 未修改 store-context.tsx/store.ts/store.tsx
- [ ] 未安装 @supabase/supabase-js
- [ ] 未创建 .env.local

## 构建检查

- [ ] npm run build 通过
