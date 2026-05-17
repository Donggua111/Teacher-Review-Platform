# Phase 2 技术方案设计 Checklist

## 文档创建/更新

- [ ] PHASE2_BACKEND_PLAN.md 已创建，包含完整技术方案
- [ ] TECH_ARCH.md 已更新，包含 Phase 2 backend architecture 章节
- [ ] PRD.md 已更新，包含 Phase 2 详细内容
- [ ] TODO.md 已更新，包含 Phase 2 TODO 列表
- [ ] TEST_PLAN.md 已更新，包含 Phase 2 测试计划
- [ ] CHANGELOG.md 已更新，记录 v1.5.0

## PHASE2_BACKEND_PLAN.md 内容检查

- [ ] A. Phase 2 目标已说明
- [ ] B. 技术路线：Supabase Auth、Postgres、RLS、Next.js 已说明
- [ ] C. 用户角色设计：student/moderator/admin 权限已定义
- [ ] D. 数据表设计：6张表（profiles, teachers, courses, course_teachers, reviews, reports）已完整设计
- [ ] E. 权限规则设计：已明确各角色权限边界
- [ ] F. 审核流：已清晰描述状态流转
- [ ] G. 迁移策略：6个阶段（2.1-2.6）已规划
- [ ] H. 风险清单：至少6项风险已列出
- [ ] I. 验收标准：Phase 2 完成后应满足的条件已定义

## 数据表设计检查

- [ ] profiles 表：id, email, display_name, role, created_at
- [ ] teachers 表：id, name, subject, bio, is_active, created_at, updated_at
- [ ] courses 表：id, name, subject, description, grade_level, is_active, created_at, updated_at
- [ ] course_teachers 表：id, course_id, teacher_id, created_at
- [ ] reviews 表：id, author_id, teacher_id, course_id, rating_*, tags, content, status, rejection_reason, is_deleted, timestamps
- [ ] reports 表：id, review_id, reporter_id, reason, status, created_at, resolved_at

## 权限规则检查

- [ ] 未登录用户：只能看 approved reviews
- [ ] 学生：可提交 review（pending），只能编辑/删除自己的 review
- [ ] moderator：可审核（approve/reject）reviews
- [ ] admin：可管理 teacher/course 数据
- [ ] deleted review 不公开展示

## 迁移策略检查

- [ ] Phase 2.1：只创建 Supabase schema，不改前端
- [ ] Phase 2.2：接入 Supabase client，只读课程和教师
- [ ] Phase 2.3：接入 review 提交流程
- [ ] Phase 2.4：接入审核流
- [ ] Phase 2.5：接入权限控制和 RLS
- [ ] Phase 2.6：清理 mock fallback

## 风险清单检查

- [ ] 真实学生隐私风险已列出
- [ ] 教师评价内容风险已列出
- [ ] 匿名攻击风险已列出
- [ ] 权限配置错误风险已列出
- [ ] RLS 配置错误风险已列出
- [ ] 环境变量泄露风险已列出
- [ ] 真实数据误入 GitHub 风险已列出

## 禁止文件检查

- [ ] 未修改 src/lib/store-context.tsx
- [ ] 未修改 src/lib/store.ts
- [ ] 未修改 src/lib/store.tsx
- [ ] 未修改 package.json
- [ ] 未修改任何页面 UI 样式
- [ ] 未安装新依赖
- [ ] 未接入 Supabase SDK

## 构建检查

- [ ] npm run build 通过
