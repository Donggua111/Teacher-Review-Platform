# 待办事项

## P0: 高优先级

- [x] 完成 store-context 状态管理整理
- [x] npm run build 通过
- [x] 学生删除自己提交的评价（软删除）
- [x] 页面基础验收（按照 TEST_PLAN.md）
- [x] 修复选择教师下拉框问题
- [x] 角色切换器显示为中文
- [x] 扩展科目列表并去掉"初中"前缀
  - [x] 支持全部 16 个科目
  - [x] 所有课程名称去掉"初中"前缀
  - [x] 科目显示统一使用中文名称
  - [x] Mock 数据更新
  - [x] UI 页面更新
  - [x] 文档同步更新
- [x] 课程卡片移除星级评分
- [x] 写评价入口迁移到教师详情页
- [x] /review/new 支持 teacherId 参数预选教师
- [x] 全站回归验收
- [x] Phase 1 最终验收通过

## P2: 低优先级

- [ ] 组件拆分
  - [ ] 从 page.tsx 中拆分出业务组件
  - [ ] 提取 ReviewCard 组件
  - [ ] 提取评分展示组件
  - [ ] 提取评价表单组件
  - [ ] 提取审核操作组件
  - [ ] 整理 components 目录（courses/teachers/reviews/admin）
- [ ] UI 中文文案统一
  - [ ] 检查所有页面是否仍有英文显示
  - [ ] 统一按钮、提示、标签文案
- [ ] 后台页面样式统一
- [ ] 表单体验优化

---

## Phase 2: Supabase Backend

### P0: 数据模型和权限

- [x] 设计 Supabase 数据库表结构 ✅ Phase 2.1-A
  - [x] profiles 表
  - [x] teachers 表
  - [x] courses 表
  - [x] course_teachers 表
  - [x] reviews 表
  - [x] reports 表
- [x] 设计 RLS 权限策略 ✅ Phase 2.1-A
  - [x] profiles 权限
  - [x] teachers/courses 权限
  - [x] reviews 权限
  - [x] reports 权限
- [x] 创建 Supabase 项目（在 Supabase Dashboard 执行 schema.sql） ✅ Phase 2.1-B
- [x] 执行数据库 schema ✅ Phase 2.1-B
- [x] 验证 RLS 策略 ✅ Phase 2.1-B

**Phase 2.1-A 完成**：
- ✅ 已创建 supabase/schema.sql
- ✅ 已创建 supabase/seed_mock.sql
- ✅ 已创建 supabase/README.md

**Phase 2.1-B 完成**：
- ✅ 创建 Supabase 项目：Teacher Review Platform
- ✅ schema.sql 在 Supabase Dashboard 成功执行
- ✅ 6 张核心表已创建
- ✅ RLS policies 已创建并启用
- ⏳ seed_mock.sql 尚未执行
- ⏳ 前端尚未接入 Supabase

### P1: Supabase 接入

- [ ] 安装 @supabase/supabase-js
- [ ] 创建 src/lib/supabase.ts 客户端
- [ ] 创建 .env.local.example
- [ ] 接入 courses/teachers 只读
- [ ] 保留 Mock fallback

### P2: 审核流

- [ ] 接入 review 提交到 Supabase
- [ ] 接入审核操作（approve/reject）
- [ ] 审核状态流转逻辑
- [ ] 拒绝原因记录

### P3: 管理端真实化

- [ ] admin 管理教师数据
- [ ] admin 管理课程数据
- [ ] admin 管理 course_teachers 关联
- [ ] 邀请码注册机制

### P4: 部署与安全

- [ ] 环境变量配置
- [ ] .gitignore 检查
- [ ] RLS 策略测试
- [ ] 生产环境部署
- [ ] 监控和日志配置

---

## 版本规划

| 版本 | 内容 | 状态 |
|------|------|------|
| v1.0.0 | 初始 Mock 版 | 已完成 |
| v1.1.0 | 项目结构整理 | 已完成 |
| v1.2.0 | 状态管理整理和文档更新 | 已完成 |
| v1.3.0 | 科目扩展和 UI 优化 | 已完成 |
| v1.4.0 | Phase 1 最终验收通过 | 已完成 |
| v1.5.0 | Phase 2 技术方案设计 | 已完成 |
| v2.0.0 | Supabase 接入 | 待开始 |

---

## 备注

- 本阶段（v1.x）不接入后端，专注前端体验
- 不得把 Phase 2 功能提前做到 Phase 1
- 状态管理清理不与功能修复混在一起
- 后续 Supabase 接入时需重新评估所有 TODO 项
- 优先级可根据实际用户反馈调整
