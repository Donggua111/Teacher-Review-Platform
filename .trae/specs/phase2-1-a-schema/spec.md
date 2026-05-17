# Phase 2.1-A: Supabase Schema Creation Spec

## Why

Phase 2 需要从 Mock Frontend 升级为真实后端系统，第一步是创建 Supabase 数据库 Schema。

## What Changes

- 新增 supabase/schema.sql（完整数据库 Schema）
- 新增 supabase/seed_mock.sql（开发用 Mock 数据）
- 新增 supabase/README.md（说明文档）
- 更新 TODO.md
- 更新 TEST_PLAN.md
- 更新 CHANGELOG.md

## Impact

- Affected specs: Phase 2 backend development
- Affected code: 无（仅 SQL 文件）

## ADDED Requirements

### Requirement: schema.sql

系统应提供完整的 Supabase 数据库 Schema，包含：

- 6 张核心表（profiles, teachers, courses, course_teachers, reviews, reports）
- updated_at 自动更新 trigger
- RLS (Row Level Security) 策略
- Helper functions（角色判断）

### Requirement: seed_mock.sql

系统应提供开发用 Mock 数据，包含：

- 虚构的 teachers、courses、course_teachers
- 虚构的用户 profiles
- 少量 approved/pending/rejected reviews

## MODIFIED Requirements

无

## REMOVED Requirements

无

---

## 文件清单

### 1. supabase/schema.sql

- 扩展：uuid-ossp
- 表：profiles, teachers, courses, course_teachers, reviews, reports
- Trigger：handle_updated_at()
- RLS：6 张表均开启 RLS
- Helper functions：get_current_user_role(), is_admin(), is_moderator_or_admin()

### 2. supabase/seed_mock.sql

- 虚构的 3-4 位教师
- 虚构的 4-5 门课程
- 课程-教师关联
- 虚构的 2-3 个用户
- 少量评价（approved/pending/rejected 状态）

### 3. supabase/README.md

- 目录用途说明
- schema.sql 说明
- seed_mock.sql 说明
- 安全提示
