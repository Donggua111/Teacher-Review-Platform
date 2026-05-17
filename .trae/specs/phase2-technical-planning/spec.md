# Phase 2.0 技术方案设计 Spec

## Why

Phase 1 Mock Frontend 已完成验收，当前需要设计从 Mock 原型升级为具备真实身份、数据库、审核流和权限边界的可用系统的技术方案。

## What Changes

- 新增 PHASE2_BACKEND_PLAN.md（Phase 2 完整技术方案文档）
- 更新 TECH_ARCH.md（增加 Phase 2 backend architecture 章节）
- 更新 PRD.md（增加 Phase 2 产品目标章节）
- 更新 TODO.md（增加 Phase 2 TODO 列表）
- 更新 TEST_PLAN.md（增加 Phase 2 测试计划）
- 更新 CHANGELOG.md（记录 Phase 2 规划文档添加）

## Impact

- Affected specs: Phase 2 backend planning
- Affected code: 无（仅文档修改）

## ADDED Requirements

### Requirement: Phase 2 技术方案文档

系统应提供完整的 Phase 2 技术方案文档，包括：

#### Scenario: 技术方案完整性
- **WHEN** 需要进行 Phase 2 开发
- **THEN** 应有完整的数据表设计、权限规则、审核流程、迁移策略

#### Scenario: 数据表设计
- **WHEN** 设计 Supabase 数据库
- **THEN** 应包含 profiles, teachers, courses, course_teachers, reviews, reports 表

#### Scenario: 权限规则设计
- **WHEN** 设计 RLS 策略
- **THEN** 应明确未登录用户、学生、审核员、管理员各自的权限边界

#### Scenario: 分阶段实施
- **WHEN** 制定迁移策略
- **THEN** 应分为 6 个阶段逐步从 Mock 迁移到 Supabase

## MODIFIED Requirements

### Requirement: TECH_ARCH.md

**变更**：增加 Phase 2 backend architecture 草案章节，不修改原有 Phase 1 内容。

### Requirement: PRD.md

**变更**：增加 Phase 2 产品目标章节，包括真实登录、真实审核流、权限系统、反滥用原则。

### Requirement: TODO.md

**变更**：增加 Phase 2 TODO 列表，按优先级分类（P0-P4）。

### Requirement: TEST_PLAN.md

**变更**：增加 Phase 2 测试计划，包括登录测试、权限测试、审核流程测试等。

## REMOVED Requirements

无

---

## 文档输出清单

### 1. PHASE2_BACKEND_PLAN.md 内容大纲

```
A. Phase 2 目标
B. 技术路线（Supabase）
C. 用户角色设计
D. 数据表设计（6张表）
E. 权限规则设计
F. 审核流
G. Mock 到 Supabase 迁移策略（6个阶段）
H. 风险清单
I. 验收标准
```

### 2. 更新文档清单

- TECH_ARCH.md - 增加 Phase 2 章节
- PRD.md - 增加 Phase 2 章节
- TODO.md - 增加 Phase 2 TODO
- TEST_PLAN.md - 增加 Phase 2 测试
- CHANGELOG.md - 记录变更
