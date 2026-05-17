# Tasks

## Phase 2 技术方案设计任务

### Task 1: 创建 PHASE2_BACKEND_PLAN.md

创建 Phase 2 完整技术方案文档，包含：

- [ ] A. Phase 2 目标：说明 Phase 2 是从 mock 原型升级为具备真实身份、数据库、审核流和权限边界的可用系统
- [ ] B. 技术路线：Supabase Auth、Postgres、RLS、前端仍用 Next.js
- [ ] C. 用户角色设计：student/moderator/admin 各自权限
- [ ] D. 数据表设计：profiles, teachers, courses, course_teachers, reviews, reports
- [ ] E. 权限规则设计：未登录/学生/审核员/管理员权限边界
- [ ] F. 审核流：学生提交 -> pending -> 审核 -> approved/rejected
- [ ] G. Mock 到 Supabase 迁移策略：Phase 2.1 到 2.6 六阶段
- [ ] H. 风险清单：隐私、攻击、权限配置、RLS、环境变量、GitHub
- [ ] I. 验收标准：登录、评价提交、审核、权限等

### Task 2: 更新 TECH_ARCH.md

在 TECH_ARCH.md 末尾新增 Phase 2 backend architecture 章节：

- [ ] 新增 Phase 2 技术架构概述
- [ ] 新增 Supabase 技术栈说明
- [ ] 新增数据库表结构草案
- [ ] 新增 RLS 策略草案

### Task 3: 更新 PRD.md

在 PRD.md 的 Phase 2 章节补充详细内容：

- [ ] 补充真实登录目标
- [ ] 补充真实评价审核流目标
- [ ] 补充真实权限系统目标
- [ ] 补充反滥用原则（不做匿名攻击、不做排行榜）
- [ ] 补充 Phase 2 vs Phase 1 差异对比

### Task 4: 更新 TODO.md

增加 Phase 2 TODO 列表，按优先级分类：

- [ ] P0: 数据模型和权限（数据库设计、RLS 设计）
- [ ] P1: Supabase 接入（SDK 集成、认证）
- [ ] P2: 审核流（审核页面、状态流转）
- [ ] P3: 管理端真实化（数据管理、用户管理）
- [ ] P4: 部署与安全检查（环境变量、GitHub 安全）

### Task 5: 更新 TEST_PLAN.md

增加 Phase 2 测试计划章节：

- [ ] 登录测试（注册、登录、登出、邀请码）
- [ ] 权限测试（student/moderator/admin 边界）
- [ ] 评价提交流程测试
- [ ] 审核流程测试（approve/reject）
- [ ] 删除评价测试
- [ ] RLS 测试
- [ ] 环境变量泄露检查

### Task 6: 更新 CHANGELOG.md

在 CHANGELOG.md 顶部新增 v1.5.0 条目：

- [ ] 记录 Phase 2.0 backend planning docs added
- [ ] 更新版本规划表

### Task 7: 验证

- [ ] 运行 npm run build 确认无错误
- [ ] 确认未修改禁止的文件（UI 文件、store 文件等）
