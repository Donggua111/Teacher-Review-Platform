# Supabase Schema

本目录包含 Phase 2 后端数据库相关的 SQL 文件。

## 目录结构

```
supabase/
├── schema.sql       # 完整数据库 Schema 定义
├── seed_mock.sql    # 开发用 Mock 数据
└── README.md        # 本文件
```

## 文件说明

### schema.sql

完整的 Supabase 数据库 Schema 定义文件，包含：

- **扩展**：uuid-ossp（UUID 生成）
- **6 张核心表**：
  - `profiles`：用户表
  - `teachers`：教师表
  - `courses`：课程表
  - `course_teachers`：课程-教师关联表
  - `reviews`：评价表
  - `reports`：举报表
- **Trigger**：`handle_updated_at()` 自动更新时间戳
- **RLS Policies**：6 张表的 Row Level Security 策略
- **Helper Functions**：角色判断辅助函数
- **索引优化**：常用查询字段的索引

### seed_mock.sql

开发用 Mock 数据文件，包含：

- 4 位虚构教师
- 5 门虚构课程
- 课程-教师关联
- 4 个用户（student/moderator/admin 各一）
- 3 条评价（approved/pending/rejected 各一）
- 1 条已处理的举报

**⚠️ 重要**：本文件仅用于本地开发，所有数据均为虚构，不包含任何真实学校、真实教师、真实学生信息。

## 当前阶段

**Phase 2.1-A：数据库 Schema 创建**

本目录的文件目前仅用于：
1. 本地开发参考
2. 在 Supabase Dashboard 中执行
3. 团队共享数据库结构

**尚未接入前端**，前端仍使用 Mock Data。

## 如何在 Supabase 中执行

### 方法一：Supabase Dashboard

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 **SQL Editor**
4. 复制 `schema.sql` 内容并执行
5. 复制 `seed_mock.sql` 内容并执行（可选，仅开发环境）

### 方法二：Supabase CLI

```bash
# 登录 Supabase CLI
npx supabase login

# 链接本地项目
npx supabase link --project-ref <your-project-ref>

# 执行 schema
npx supabase db execute -f supabase/schema.sql

# 插入 mock 数据（可选）
npx supabase db execute -f supabase/seed_mock.sql
```

## 安全提示

### ⚠️ 禁止事项

1. **不要提交真实 credentials**
   - 不要将 `.env.local` 或 `.env` 提交到 GitHub
   - 不要在代码中硬编码 Supabase URL 或 anon key

2. **不要使用真实数据**
   - `seed_mock.sql` 中的数据均为虚构
   - 如需真实数据，必须获得授权

3. **保护用户隐私**
   - 真实用户的邮箱、姓名等信息需要加密存储
   - 评价内容不应显示用户真实身份

### ✅ 推荐做法

1. 使用 `.env.local.example` 作为环境变量模板
2. 在 `.gitignore` 中添加：
   ```
   .env.local
   .env
   ```
3. 定期检查 GitHub 安全警告

## 后续步骤

Phase 2.1 后续任务：

| 阶段 | 任务 |
|------|------|
| 2.1-B | 创建 Supabase 项目并执行 Schema |
| 2.2 | 接入 Supabase Client（只读） |
| 2.3 | 接入评价提交 |
| 2.4 | 接入审核流 |
| 2.5 | 启用 RLS |
| 2.6 | 清理 Mock Fallback |

## 参考文档

- [Supabase Schema](https://supabase.com/docs/guides/database/schema)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Postgres](https://supabase.com/docs/guides/database/postgres)
