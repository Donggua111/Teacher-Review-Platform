-- =====================================================
-- Teacher Review Platform - Supabase Database Schema
-- Phase 2.1-A: Database Schema Definition
-- =====================================================
--
-- 本文件包含完整的数据库 Schema 定义，包括：
-- - 6 张核心表
-- - updated_at 自动更新 Trigger
-- - Row Level Security (RLS) 策略
-- - Helper Functions
--
-- 注意：本文件仅定义结构，不包含任何真实数据
-- =====================================================

-- =====================================================
-- A. 必要扩展
-- =====================================================

-- 启用 UUID 生成扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- B. 用户表 (profiles)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (
        role IN ('student', 'moderator', 'admin')
    ),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- C. 教师表 (teachers)
-- =====================================================

CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    bio TEXT,
    title TEXT,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- D. 课程表 (courses)
-- =====================================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    grade_level TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- E. 课程-教师关联表 (course_teachers)
-- =====================================================

CREATE TABLE IF NOT EXISTS course_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (course_id, teacher_id)
);

-- =====================================================
-- F. 评价表 (reviews)
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 关联信息
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- 多维度评分 (1-5)
    rating_overall INTEGER NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
    rating_clarity INTEGER CHECK (rating_clarity BETWEEN 1 AND 5),
    rating_workload INTEGER CHECK (rating_workload BETWEEN 1 AND 5),
    rating_fairness INTEGER CHECK (rating_fairness BETWEEN 1 AND 5),
    rating_difficulty INTEGER CHECK (rating_difficulty BETWEEN 1 AND 5),
    rating_recommendation INTEGER CHECK (rating_recommendation BETWEEN 1 AND 5),

    -- 内容
    content TEXT NOT NULL CHECK (char_length(content) >= 10),
    tags TEXT[],

    -- 状态
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'approved', 'rejected')
    ),
    rejection_reason TEXT,

    -- 软删除
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES profiles(id),

    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- G. 举报表 (reports)
-- =====================================================

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- 关联信息
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- 举报原因
    reason TEXT NOT NULL CHECK (
        reason IN ('harassment', 'misinformation', 'privacy', 'spam', 'other')
    ),
    description TEXT,

    -- 状态
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'resolved', 'dismissed')
    ),

    -- 处理信息
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),

    -- 时间戳
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- H. updated_at 自动更新 Trigger
-- =====================================================

-- 创建 trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到需要自动更新 updated_at 的表
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================
-- I. Helper Functions (RLS 权限判断辅助)
-- =====================================================

-- 获取当前用户角色
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role
        FROM profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 判断是否为 admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 判断是否为 moderator 或 admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM profiles
        WHERE id = auth.uid()
        AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- J. Row Level Security (RLS) 配置
-- =====================================================

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- K. RLS Policies: profiles
-- =====================================================

-- 所有人可以查看 profiles 基础信息
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT
    USING (true);

-- 用户可以更新自己的 profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- admin 可以管理所有 profiles
CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL
    USING (is_admin());

-- 允许创建 profiles（通过 Auth 触发）
CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- L. RLS Policies: teachers
-- =====================================================

-- 所有人可以查看 is_active = true 的 teachers
CREATE POLICY "teachers_select_active" ON teachers
    FOR SELECT
    USING (is_active = true);

-- admin 可以管理所有 teachers
CREATE POLICY "teachers_admin_all" ON teachers
    FOR ALL
    USING (is_admin());

-- =====================================================
-- M. RLS Policies: courses
-- =====================================================

-- 所有人可以查看 is_active = true 的 courses
CREATE POLICY "courses_select_active" ON courses
    FOR SELECT
    USING (is_active = true);

-- admin 可以管理所有 courses
CREATE POLICY "courses_admin_all" ON courses
    FOR ALL
    USING (is_admin());

-- =====================================================
-- N. RLS Policies: course_teachers
-- =====================================================

-- 所有人可以查看 course_teachers 关联
CREATE POLICY "course_teachers_select_all" ON course_teachers
    FOR SELECT
    USING (true);

-- admin 可以管理 course_teachers
CREATE POLICY "course_teachers_admin_all" ON course_teachers
    FOR ALL
    USING (is_admin());

-- =====================================================
-- O. RLS Policies: reviews
-- =====================================================

-- 公开查询：只显示 approved 且未删除的评价
CREATE POLICY "reviews_select_public" ON reviews
    FOR SELECT
    USING (
        status = 'approved'
        AND is_deleted = false
    );

-- 用户可以查看自己的所有评价（包括 pending/rejected）
CREATE POLICY "reviews_select_own" ON reviews
    FOR SELECT
    USING (author_id = auth.uid());

-- 登录用户可以提交评价（默认 pending）
CREATE POLICY "reviews_insert" ON reviews
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
            AND role IN ('student', 'moderator', 'admin')
        )
        AND status = 'pending'
    );

-- 用户可以更新自己的 pending 评价
CREATE POLICY "reviews_update_own_pending" ON reviews
    FOR UPDATE
    USING (
        author_id = auth.uid()
        AND status = 'pending'
    );

-- 用户可以软删除自己的评价
CREATE POLICY "reviews_soft_delete_own" ON reviews
    FOR UPDATE
    USING (
        author_id = auth.uid()
        AND is_deleted = false
    );

-- moderator 或 admin 可以审核 pending 评价
CREATE POLICY "reviews_moderate" ON reviews
    FOR UPDATE
    USING (
        status = 'pending'
        AND is_moderator_or_admin()
    );

-- =====================================================
-- P. RLS Policies: reports
-- =====================================================

-- 登录用户可以提交举报
CREATE POLICY "reports_insert" ON reports
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM profiles
            WHERE id = auth.uid()
        )
    );

-- 举报者可以查看自己的举报
CREATE POLICY "reports_select_own" ON reports
    FOR SELECT
    USING (reporter_id = auth.uid());

-- moderator 或 admin 可以查看和处理所有举报
CREATE POLICY "reports_moderate" ON reports
    FOR ALL
    USING (is_moderator_or_admin());

-- =====================================================
-- 索引优化
-- =====================================================

-- reviews 表索引
CREATE INDEX idx_reviews_author_id ON reviews(author_id);
CREATE INDEX idx_reviews_teacher_id ON reviews(teacher_id);
CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_is_deleted ON reviews(is_deleted);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- reports 表索引
CREATE INDEX idx_reports_review_id ON reports(review_id);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);

-- course_teachers 表索引
CREATE INDEX idx_course_teachers_course_id ON course_teachers(course_id);
CREATE INDEX idx_course_teachers_teacher_id ON course_teachers(teacher_id);

-- =====================================================
-- 完成
-- =====================================================
