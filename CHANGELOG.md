# Changelog

所有重要的项目变更都会记录在此文档。

## [Unreleased] - Phase 2.1-B

### 新增

- Phase 2.1-A：创建本地 Supabase schema 文件
  - supabase/schema.sql：完整数据库 Schema（6 张表 + RLS + Helper Functions）
  - supabase/seed_mock.sql：开发用 Mock 数据
  - supabase/README.md：数据库文件说明文档

- Phase 2.1-B：Supabase 项目创建与 schema 执行
  - ✅ 创建 Supabase 项目：Teacher Review Platform
  - ✅ schema.sql 在 Supabase Dashboard 成功执行
  - ✅ 6 张核心表已创建（profiles, teachers, courses, course_teachers, reviews, reports）
  - ✅ RLS policies 已创建并启用
  - ✅ rowsecurity 已开启

### 变更

- TODO.md：更新 Phase 2 P0 任务状态（标记 Phase 2.1-B 完成）
- TEST_PLAN.md：增加 Phase 2.1-B 验收记录

### 已知限制

- 本版本仍为 Phase 1 前端 Mock 版
- seed_mock.sql 尚未执行（等待 Phase 2.1-C）
- 前端尚未接入 Supabase（等待 Phase 2.2）
- 无真实认证系统

---

## [v1.5.0] - 2026-05-16

### 新增

- Phase 2.0 backend planning docs added
- PHASE2_BACKEND_PLAN.md：完整的 Phase 2 技术方案文档
- Phase 2 技术架构草案（TECH_ARCH.md）
- Phase 2 产品目标章节（PRD.md）
- Phase 2 TODO 列表（TODO.md）
- Phase 2 测试计划（TEST_PLAN.md）

### Phase 2 技术方案内容

- 数据表设计：profiles, teachers, courses, course_teachers, reviews, reports
- 用户角色设计：student, moderator, admin 权限边界
- RLS 权限策略设计
- 审核流设计
- Mock 到 Supabase 六阶段迁移策略
- 风险清单
- 验收标准

### 已知限制

- 本版本仍为 Phase 1 前端 Mock 版，不包含真实后端
- 数据存储在内存中，页面刷新后重置
- 用户系统为模拟，无真实认证

---

## [v1.4.0] - 2026-05-15

### 新增

- Phase 1 前端 Mock Web App 全站最终验收通过
- 完整的最终验收记录（TEST_PLAN.md）

### 已完成功能

- ✅ 课程/教师浏览系统
- ✅ 提交评价流程（多维度评分、标签、文本评价）
- ✅ 审核评价流程（通过/拒绝，拒绝需填写原因）
- ✅ 举报处理流程
- ✅ 学生删除自己评价（软删除）
- ✅ 16 个科目支持（不带"初中"前缀）
- ✅ 角色权限模拟（学生/审核员/管理员）
- ✅ 角色与状态中文化显示
- ✅ 评价入口在教师详情页（不在课程详情页）
- ✅ /review/new 支持 teacherId 参数预选教师
- ✅ 课程卡片不显示星级评分

### 验收结果

- ✅ npm run build 通过
- ✅ 13 个页面路由正常
- ✅ 无 TypeScript 错误
- ✅ 无 import 路径错误
- ✅ Tailwind 样式正常加载
- ✅ 所有业务流程验收通过

### 已知限制

- 本版本为前端 Mock 版，不包含真实后端
- 数据存储在内存中，页面刷新后重置
- 用户系统为模拟，无真实认证

---

## [v1.3.0] - 2026-05-14

### 新增

- 扩展科目列表至 16 个科目：语文、数学、英语、物理、化学、政治、历史、地理、生物、体育、信息技术、音乐、美术、心理、综合实践、其他
- SUBJECTS 常量：包含科目 id 和 label 的完整定义
- SUBJECT_LABELS 常量：科目 id 到中文标签的映射
- 新增 12 门课程的 Mock 数据
- 新增 12 位教师的 Mock 数据
- 新增课程教师关联数据

### 变更

- 所有课程名称移除"初中"前缀，统一显示简洁名称
- 首页科目浏览区域显示全部 16 个科目
- 课程列表页面显示科目标签
- 课程详情页显示科目标签（使用 SUBJECT_LABELS 映射）
- 后台课程管理页面添加科目选择器，显示所有可选科目
- 科目显示统一使用中文名称，不出现"初中"前缀
- 修复路由链接问题

### 已知限制

- 本版本为前端 Mock 版，不包含真实后端
- 数据存储在内存中，页面刷新后重置
- 用户系统为模拟，无真实认证

---

## [v1.2.0] - 2026-05-14

### 新增

- Added AI_DEV_RULES.md
- Clarified Phase 1 / Phase 2 project scope
- Standardized Chinese role labels
- Planned state management cleanup
- Planned component structure cleanup
- Updated documentation to reflect current development rules
- 学生可以删除自己提交的评价（软删除）
- Review 类型增加 is_deleted、deleted_at、deleted_by 字段
- store-context.tsx 增加 deleteReview 方法
- 完成 Phase 1 基础页面验收
- 评价入口调整：评价入口从课程详情页移至教师详情页
- /review/new 支持通过 URL 参数 teacherId 自动预选教师

### 变更

- 角色切换器显示改为中文（admin→管理员、moderator→审核员、student→学生）
- 状态管理架构调整：新增 store-context.tsx 作为真实实现，store.ts 和 store.tsx 改为兼容重导出
- 文档全面更新，明确 Phase 1/Phase 2/Phase 3 边界
- npm run build 修复通过
- 课程详情页、教师详情页、后台审核页、我的评价页均过滤已删除评价
- 课程卡片移除星级评分显示
- 课程详情页移除「写评价」按钮
- 教师详情页「写评价」按钮改为带 teacherId 参数跳转
- 评价页面支持从 URL 参数接收 teacherId 并自动预选教师
- 评价页面课程选择器在选定教师后只显示该教师教授的课程

### 已知限制

- 本版本为前端 Mock 版，不包含真实后端
- 数据存储在内存中，页面刷新后重置
- 用户系统为模拟，无真实认证

---

## [v1.1.0] - 2026-05-12

### 新增

- 项目结构整理，添加完整文档体系
- README.md - 项目简介和运行指南
- PRD.md - 产品需求文档 v1.1
- TECH_ARCH.md - 技术架构文档
- CHANGELOG.md - 变更日志
- TEST_PLAN.md - 测试验收计划
- TODO.md - 待办事项列表

### 已知限制

- 本版本为前端 Mock 版，不包含真实后端
- 数据存储在内存中，页面刷新后重置
- 用户系统为模拟，无真实认证

---

## [v1.0.0] - 2026-05-11

### 新增

- 首页展示
- 课程列表和详情页
- 教师列表和详情页
- 评价提交表单
- 我的评价页面
- 后台审核功能
- 举报处理功能
- 角色切换器（学生/审核员/管理员）
- shadcn/ui 基础组件
- Tailwind CSS 样式
- Mock 数据系统
- React Context 状态管理
- Zustand 状态管理（备用）
