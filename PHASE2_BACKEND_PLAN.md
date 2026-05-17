# Phase 2 Backend Plan

> 本文档描述从 Phase 1 Mock Frontend 升级为具备真实身份、数据库、审核流和权限边界的可用系统的技术方案。

---

## A. Phase 2 目标

### 核心目标

Phase 2 的目标是从前端 mock 原型升级为具备真实身份、数据库、审核流和权限边界的可用系统。

### 具体目标

1. **真实用户身份**：用户需要注册和登录才能评价
2. **数据持久化**：评价数据需要长期保存
3. **真实审核流**：评价需要经过审核才能展示
4. **权限边界清晰**：不同角色有明确的权限边界
5. **反滥用机制**：防止匿名攻击、恶意评价

### Phase 2 vs Phase 1

| 方面 | Phase 1 | Phase 2 |
|------|---------|---------|
| 用户身份 | Mock（角色切换器） | 真实登录/注册 |
| 数据存储 | 内存（刷新丢失） | Supabase Postgres |
| 权限控制 | 前端模拟 | RLS (Row Level Security) |
| 评价审核 | 无（直接展示） | 需要审核 |
| 数据来源 | Mock data | 真实用户数据 |

---

## B. 技术路线

### 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 | 保持不变 |
| 后端服务 | Supabase | Auth + Database + RLS |
| 认证 | Supabase Auth | Email/Password + 邀请码 |
| 数据库 | Supabase Postgres | 关系型数据库 |
| 权限控制 | Row Level Security | 数据库级别权限 |
| 可选 | Supabase Realtime | 实时订阅（后续） |

### Supabase 接入策略

1. **不改变前端架构**：前端继续使用 Next.js App Router
2. **渐进式迁移**：分 6 个阶段逐步接入
3. **保留 Mock fallback**：在 Supabase 不可用时降级到 Mock
4. **环境变量隔离**：Supabase credentials 不进入 GitHub

---

## C. 用户角色设计

### 角色定义

| 角色 | 内部值 | 说明 | 典型用户 |
|------|--------|------|----------|
| 学生 | `student` | 提交评价、查看自己的评价 | 初中生 |
| 审核员 | `moderator` | 审核评价、处理举报 | 学校管理员 |
| 管理员 | `admin` | 管理教师/课程数据 | 超级管理员 |

### 角色权限矩阵

| 功能 | 未登录 | student | moderator | admin |
|------|--------|---------|-----------|-------|
| 浏览公开评价（approved） | ✓ | ✓ | ✓ | ✓ |
| 提交评价 | - | ✓ | ✓ | ✓ |
| 编辑自己的评价 | - | ✓ | ✓ | ✓ |
| 删除自己的评价 | - | ✓ | ✓ | ✓ |
| 举报评价 | - | ✓ | ✓ | ✓ |
| 审核评价 | - | - | ✓ | ✓ |
| 处理举报 | - | - | ✓ | ✓ |
| 管理教师数据 | - | - | - | ✓ |
| 管理课程数据 | - | - | - | ✓ |
| 访问管理后台 | - | - | ✓ | ✓ |

### 权限边界说明

**学生 (student) 能做的：**
- 注册并登录
- 浏览已通过审核的评价
- 提交新的评价（默认 pending）
- 编辑自己处于 pending 状态的评价
- 删除自己的评价（软删除）
- 举报不当评价
- 查看自己的评价记录及状态

**学生 (student) 不能做的：**
- 直接让自己的评价公开显示（必须经过审核）
- 编辑或删除他人的评价
- 审核他人的评价
- 访问管理后台
- 管理教师或课程数据

**审核员 (moderator) 能做的：**
- 所有学生能做的事
- 审核学生提交的评价（通过/拒绝）
- 处理学生提交的举报
- 查看所有待审核的评价

**审核员 (moderator) 不能做的：**
- 管理教师或课程的基础数据（名称、描述等）
- 删除已通过的评价（只能拒绝）
- 访问其他审核员的操作记录

**管理员 (admin) 能做的：**
- 所有审核员能做的事
- 添加/编辑/删除教师信息
- 添加/编辑/删除课程信息
- 管理课程-教师关联
- 分配审核员角色

---

## D. 数据表设计

### 1. profiles 表

用户配置表，存储用户基本信息。

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. teachers 表

教师信息表。

```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  bio TEXT,
  title TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active teachers" ON teachers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admin can manage teachers" ON teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 3. courses 表

课程信息表。

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  grade_level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active courses" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admin can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 4. course_teachers 表

课程-教师关联表。

```sql
CREATE TABLE course_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (course_id, teacher_id)
);

-- RLS Policy
ALTER TABLE course_teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view course-teacher relations" ON course_teachers
  FOR SELECT USING (true);

CREATE POLICY "Only admin can manage course-teacher relations" ON course_teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### 5. reviews 表

评价表，是核心业务表。

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

  -- 评分维度
  rating_overall INTEGER NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_clarity INTEGER CHECK (rating_clarity BETWEEN 1 AND 5),
  rating_workload INTEGER CHECK (rating_workload BETWEEN 1 AND 5),
  rating_fairness INTEGER CHECK (rating_fairness BETWEEN 1 AND 5),
  rating_difficulty INTEGER CHECK (rating_difficulty BETWEEN 1 AND 5),
  rating_recommendation INTEGER CHECK (rating_recommendation BETWEEN 1 AND 5),

  -- 内容
  content TEXT NOT NULL,
  tags TEXT[],

  -- 状态
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,

  -- 软删除
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES profiles(id),

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 公开查询：只显示 approved 且未删除的评价
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (
    status = 'approved'
    AND is_deleted = false
  );

-- 学生可以查看自己的评价（包括 pending/rejected）
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (author_id = auth.uid());

-- 学生可以提交评价
CREATE POLICY "Students can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('student', 'moderator', 'admin')
    )
  );

-- 学生可以更新自己的 pending 评价
CREATE POLICY "Users can update own pending reviews" ON reviews
  FOR UPDATE USING (
    author_id = auth.uid()
    AND status = 'pending'
  );

-- 学生可以软删除自己的评价
CREATE POLICY "Users can soft delete own reviews" ON reviews
  FOR UPDATE USING (
    author_id = auth.uid()
    AND is_deleted = false
  );

-- 审核员和管理员可以审核评价
CREATE POLICY "Moderators can approve/reject reviews" ON reviews
  FOR UPDATE USING (
    status = 'pending'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('moderator', 'admin')
    )
  );
```

### 6. reports 表

举报表。

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'misinformation', 'privacy', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 所有人都可以提交举报
CREATE POLICY "Anyone can create reports" ON reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- 举报者可以查看自己的举报
CREATE POLICY "Reporters can view own reports" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

-- 审核员和管理员可以查看和处理所有举报
CREATE POLICY "Moderators can manage reports" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('moderator', 'admin')
    )
  );
```

---

## E. 权限规则设计

### RLS 策略概述

Row Level Security (RLS) 是 Supabase 提供的数据库级别权限控制，确保即使前端代码有漏洞，数据库层也会强制执行权限。

### 权限层级

```
未登录用户（匿名）
    ↓
已登录用户（按 role 分组）
    ├── student
    ├── moderator
    └── admin
```

### 详细权限规则

#### 1. 公开可读资源

以下资源对所有人（包括未登录用户）可读：

- `teachers`：只读 is_active = true 的教师
- `courses`：只读 is_active = true 的课程
- `reviews`：只读 status = 'approved' AND is_deleted = false 的评价

#### 2. 学生 (student) 权限

| 操作 | 条件 |
|------|------|
| 创建 review | 必须登录 |
| 查看自己的 reviews | author_id = 当前用户 |
| 更新自己的 review | author_id = 当前用户 AND status = 'pending' |
| 软删除自己的 review | author_id = 当前用户 |
| 创建 report | 必须登录 |
| 查看自己的 reports | reporter_id = 当前用户 |

#### 3. 审核员 (moderator) 权限

| 操作 | 条件 |
|------|------|
| 审核 review | status = 'pending' |
| 通过 review | - |
| 拒绝 review | 必须提供 rejection_reason |
| 处理 report | status = 'pending' |

#### 4. 管理员 (admin) 权限

| 操作 | 条件 |
|------|------|
| 管理 teachers | 无条件 |
| 管理 courses | 无条件 |
| 管理 course_teachers | 无条件 |
| 分配角色 | 无条件 |

### 敏感操作防护

1. **评价不能立即公开**：必须经过审核员审核
2. **软删除保护**：数据不物理删除，只标记 is_deleted
3. **拒绝必须说明**：拒绝评价时必须提供原因
4. **举报有记录**：所有举报都有 reporter_id 追溯

---

## F. 审核流

### 评价状态流转

```
[创建] → pending → [审核通过] → approved → [公开展示]
                  ↓
            [审核拒绝] → rejected → [仅用户可见]
                  ↓
            [拒绝原因记录]
```

### 详细流程

#### 1. 学生提交评价

```
学生选择教师 → 选择课程 → 填写评分 → 选择标签 → 填写内容 → 提交
     ↓
review.status = 'pending'
review.author_id = 当前用户
review.created_at = 当前时间
```

#### 2. 审核员审核

```
审核员登录 → 进入审核列表（只看 pending） → 查看评价内容 → 做决定
                                                          ↓
                            ┌─────────────────────────────┴─────────────────────────────┐
                            ↓                                                       ↓
                    [通过]                                                   [拒绝]
                            ↓                                                       ↓
              review.status = 'approved'                              review.status = 'rejected'
              公开显示                                                      rejection_reason = xxx
```

#### 3. 学生查看结果

```
学生进入"我的评价" → 查看评价列表
                          ↓
        ┌─────────────────┬─────────────────┬─────────────────┐
        ↓                 ↓                 ↓                 ↓
    approved          pending           rejected          is_deleted
        ↓                 ↓                 ↓                 ↓
   [公开展示]      [等待审核]       [显示拒绝原因]       [已删除]
```

### 软删除流程

```
学生点击"删除" → 确认提示 → 确认删除
                              ↓
        review.is_deleted = true
        review.deleted_at = 当前时间
        review.deleted_by = 当前用户ID
                              ↓
        该评价从所有公开列表消失
        只在用户"我的评价"中显示为"已删除"状态
```

---

## G. Mock 到 Supabase 的迁移策略

### 迁移原则

1. **渐进式**：分阶段实施，每阶段可运行
2. **可回滚**：每阶段保留 Mock fallback
3. **不影响现有功能**：前端代码改动最小化
4. **环境隔离**：Supabase credentials 不进入 GitHub

### 六个阶段

#### Phase 2.1: 数据库 schema 创建

**目标**：创建 Supabase 数据库表结构，不修改前端

**任务**：
- 创建 Supabase 项目
- 执行数据库 schema（6张表）
- 配置 RLS 策略
- 创建邀请码表（可选）
- 验证数据库连接

**验收**：
- 数据库表创建成功
- RLS 策略生效
- 无数据泄露风险

---

#### Phase 2.2: Supabase Client 集成（只读）

**目标**：前端接入 Supabase client，只读取课程和教师数据

**任务**：
- 安装 @supabase/supabase-js
- 创建 src/lib/supabase.ts 客户端
- 创建 .env.local.example（环境变量模板）
- 修改 store-context.tsx，支持从 Supabase 读取 courses 和 teachers
- 保留 Mock data 作为 fallback

**验收**：
- 课程列表页面正常显示
- 教师列表页面正常显示
- 页面刷新不丢失数据

---

#### Phase 2.3: 评价提交接入 Supabase

**目标**：学生提交评价写入 Supabase

**任务**：
- 修改评价提交逻辑，写入 Supabase reviews 表
- 保持 Mock reviews 作为备份
- 添加提交成功的提示

**验收**：
- 学生可以提交评价
- 评价写入 Supabase
- 刷新页面后评价仍存在

---

#### Phase 2.4: 审核流接入 Supabase

**目标**：审核员审核操作使用 Supabase

**任务**：
- 修改审核页面，使用 Supabase 数据
- 审核操作写入 Supabase
- 同步更新 store-context.tsx

**验收**：
- 审核员可以查看待审核评价
- 审核通过/拒绝操作正常
- 状态更新实时反映

---

#### Phase 2.5: 权限控制和 RLS 启用

**目标**：启用完整的 RLS 策略

**任务**：
- 在 Supabase 启用 RLS
- 测试各角色权限边界
- 移除 Mock fallback（可选）
- 添加邀请码注册验证

**验收**：
- 未登录用户不能提交评价
- 学生不能审核评价
- admin 可以管理数据

---

#### Phase 2.6: Mock Fallback 清理

**目标**：移除 Mock data 依赖

**任务**：
- 删除 src/lib/mock/ 目录（或保留作为开发模式）
- 更新 store-context.tsx 移除 Mock fallback
- 清理无用的 Mock 相关代码
- 添加 .gitignore 规则

**验收**：
- 所有数据来自 Supabase
- .env.local 不进入 GitHub
- 无敏感信息泄露

---

## H. 风险清单

### 1. 真实学生隐私

**风险**：真实学生的评价和身份信息可能泄露。

**缓解措施**：
- 评价不显示学生真实姓名，只显示"匿名学生"或昵称
- 用户邮箱不可公开查询
- RLS 策略限制数据访问

### 2. 教师评价内容风险

**风险**：学生可能发表攻击性、侮辱性评价。

**缓解措施**：
- 评价需要审核才能展示
- 审核员有权拒绝不当内容
- 平台明确规则，禁止人身攻击
- 举报机制处理已发布的违规内容

### 3. 匿名攻击风险

**风险**：平台可能被用于匿名攻击教师。

**缓解措施**：
- 需要登录才能评价（可追溯）
- 评价需审核
- 明确"不做匿名攻击平台"原则
- 举报机制

### 4. 权限配置错误

**风险**：RLS 配置不当可能导致未授权访问。

**缓解措施**：
- 阶段 2.5 专门进行权限测试
- 使用 Supabase 提供的 RLS 模拟器测试
- 代码审查确保策略正确
- 最小权限原则

### 5. RLS 配置错误

**风险**：RLS 策略写错可能导致：
- 用户能看到他人数据
- 审核员无法审核
- admin 无法管理数据

**缓解措施**：
- 每个策略单独测试
- 使用 Supabase Dashboard 的 RLS 检查工具
- 记录所有策略变更

### 6. 环境变量泄露

**风险**：Supabase URL 和 anon key 可能泄露。

**缓解措施**：
- 环境变量存储在 .env.local
- .env.local 加入 .gitignore
- 不在 GitHub 上分享 credentials
- 使用不同的 key 用于开发和生产

### 7. 真实数据误入 GitHub

**风险**：开发过程中可能不小心提交真实数据或 credentials。

**缓解措施**：
- .gitignore 排除 .env.local
- 定期检查 GitHub 安全警告
- 使用 Supabase 的数据屏蔽功能进行开发
- 不在代码中硬编码任何 credentials

---

## I. 验收标准

### Phase 2 完成后应满足

#### 1. 用户认证

- [ ] 用户可以使用邮箱注册账号
- [ ] 用户可以登录和登出
- [ ] 邀请码机制生效（可选）
- [ ] 登录状态持久化

#### 2. 评价提交

- [ ] 学生可以提交评价
- [ ] 评价默认状态为 pending
- [ ] 提交后进入"我的评价"列表
- [ ] 未登录用户不能提交评价

#### 3. 评价展示

- [ ] 只有 approved 评价公开展示
- [ ] pending/rejected 评价不公开展示
- [ ] is_deleted 评价不公开展示
- [ ] 课程详情页只显示 approved 评价
- [ ] 教师详情页只显示 approved 评价

#### 4. 审核流程

- [ ] 审核员可以查看待审核评价列表
- [ ] 审核员可以批准评价
- [ ] 审核员可以拒绝评价（需填写原因）
- [ ] 拒绝原因记录并展示给用户

#### 5. 权限控制

- [ ] 普通学生不能访问 /admin
- [ ] 普通学生不能审核评价
- [ ] admin 可以管理教师和课程
- [ ] RLS 策略正确执行

#### 6. 管理后台

- [ ] admin 可以添加/编辑/删除教师
- [ ] admin 可以添加/编辑/删除课程
- [ ] admin 可以管理课程-教师关联

#### 7. 安全检查

- [ ] .env.local 不进入 GitHub
- [ ] 无 credentials 硬编码
- [ ] RLS 策略经过测试
- [ ] 无 SQL 注入风险

---

## 附录

### A. 参考资料

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Database](https://supabase.com/docs/guides/database)

### B. 后续规划

Phase 2 完成后的 Phase 3 目标：
- 生产环境部署
- 邮件通知集成
- 实时订阅（Realtime）
- 监控和日志
- 小范围真实用户测试
