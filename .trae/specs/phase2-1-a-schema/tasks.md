# Tasks

## Phase 2.1-A: Supabase Schema 创建

### Task 1: 创建 supabase/schema.sql

创建完整数据库 Schema 文件：

- [ ] A. 必要扩展（uuid-ossp）
- [ ] B. 创建 profiles 表（含 role CHECK 约束）
- [ ] C. 创建 teachers 表
- [ ] D. 创建 courses 表
- [ ] E. 创建 course_teachers 表（含 UNIQUE 约束）
- [ ] F. 创建 reviews 表（含多项 CHECK 约束）
- [ ] G. 创建 reports 表（含 reason/status CHECK 约束）
- [ ] H. 创建 handle_updated_at() trigger function
- [ ] I. 为 profiles/teachers/courses/reviews 应用 trigger
- [ ] J. 为 6 张表开启 RLS
- [ ] K. 创建基础 RLS policies（至少 15+ policies）
- [ ] L. 创建 helper functions（角色判断）

### Task 2: 创建 supabase/seed_mock.sql

创建开发用 Mock 数据文件：

- [ ] A. 顶部注释说明（仅用于本地开发）
- [ ] B. 插入虚构的 3-4 位教师
- [ ] C. 插入虚构的 4-5 门课程
- [ ] D. 插入课程-教师关联
- [ ] E. 插入 2-3 个虚构用户（student/moderator/admin）
- [ ] F. 插入少量评价（approved/pending/rejected）
- [ ] G. 文件不包含任何真实学校/教师/学生数据

### Task 3: 创建 supabase/README.md

创建说明文档：

- [ ] A. 本目录用途
- [ ] B. schema.sql 用途说明
- [ ] C. seed_mock.sql 用途说明
- [ ] D. 安全提示（不提交 .env、不放真实数据）
- [ ] E. 后续执行步骤说明

### Task 4: 更新 TODO.md

- [ ] 标记"设计 Supabase 数据库表结构"为部分完成
- [ ] 说明已生成本地 schema.sql

### Task 5: 更新 TEST_PLAN.md

- [ ] 增加 Phase 2.1-A 验收项

### Task 6: 更新 CHANGELOG.md

- [ ] 新增 v1.5.1 或 Unreleased 条目

### Task 7: 验证

- [ ] 运行 npm run build
- [ ] 确认未修改禁止文件
