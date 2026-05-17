-- =====================================================
-- Teacher Review Platform - Mock Seed Data
-- Phase 2.1-A: Development Mock Data
-- =====================================================
--
-- ⚠️ 重要声明 ⚠️
--
-- 本文件仅用于本地开发环境！
--
-- 1. 本文件中的所有数据均为虚构
-- 2. 不包含任何真实学校、真实教师、真实学生信息
-- 3. 不包含任何可识别个人身份的信息
-- 4. 仅用于开发、测试和演示目的
--
-- 如需在真实环境中使用，请替换为真实数据
-- =====================================================

-- =====================================================
-- 1. 插入虚构的教师 (teachers)
-- =====================================================

INSERT INTO teachers (id, name, subject, bio, title, department, is_active) VALUES
    (
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        '张数学',
        'math',
        '热爱数学教学，注重培养学生的逻辑思维能力。',
        '高级教师',
        '数学组',
        true
    ),
    (
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        '李语文',
        'chinese',
        '从事语文教学多年，擅长阅读理解和写作指导。',
        '一级教师',
        '语文组',
        true
    ),
    (
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        '王英语',
        'english',
        '英语专业八级，注重口语和听力训练。',
        '高级教师',
        '外语组',
        true
    ),
    (
        'd4e5f6a7-b8c9-0123-defa-234567890123',
        '刘物理',
        'physics',
        '实验教学专家，善于用实验演示抽象概念。',
        '特级教师',
        '理综组',
        true
    );

-- =====================================================
-- 2. 插入虚构的课程 (courses)
-- =====================================================

INSERT INTO courses (id, name, subject, description, grade_level, is_active) VALUES
    (
        '11111111-2222-3333-4444-555555555551',
        '七年级数学',
        'math',
        '七年级数学基础课程，涵盖代数和几何入门知识。',
        '七年级',
        true
    ),
    (
        '11111111-2222-3333-4444-555555555552',
        '八年级数学',
        'math',
        '八年级数学进阶课程，包含一次函数和三角形等内容。',
        '八年级',
        true
    ),
    (
        '22222222-3333-4444-5555-666666666661',
        '七年级语文',
        'chinese',
        '七年级语文课程，注重阅读理解和作文基础训练。',
        '七年级',
        true
    ),
    (
        '33333333-4444-5555-6666-777777777771',
        '八年级英语',
        'english',
        '八年级英语课程，包括语法、阅读和写作提升。',
        '八年级',
        true
    ),
    (
        '44444444-5555-6666-7777-888888888881',
        '八年级物理',
        'physics',
        '八年级物理入门课程，学习力学的初步知识。',
        '八年级',
        true
    );

-- =====================================================
-- 3. 插入课程-教师关联 (course_teachers)
-- =====================================================

INSERT INTO course_teachers (course_id, teacher_id) VALUES
    -- 张数学老师教授的课程
    ('11111111-2222-3333-4444-555555555551', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
    ('11111111-2222-3333-4444-555555555552', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
    -- 李语文老师教授的课程
    ('22222222-3333-4444-5555-666666666661', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
    -- 王英语老师教授的课程
    ('33333333-4444-5555-6666-777777777771', 'c3d4e5f6-a7b8-9012-cdef-123456789012'),
    -- 刘物理老师教授的课程
    ('44444444-5555-6666-7777-888888888881', 'd4e5f6a7-b8c9-0123-defa-234567890123');

-- =====================================================
-- 4. 插入虚构的用户 (profiles)
-- =====================================================

INSERT INTO profiles (id, email, display_name, role, is_active) VALUES
    (
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0001',
        'student1@example.com',
        '学生小明',
        'student',
        true
    ),
    (
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0002',
        'student2@example.com',
        '学生小红',
        'student',
        true
    ),
    (
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0003',
        'moderator@example.com',
        '审核员小王',
        'moderator',
        true
    ),
    (
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0004',
        'admin@example.com',
        '管理员小李',
        'admin',
        true
    );

-- =====================================================
-- 5. 插入虚构的评价 (reviews)
-- =====================================================

-- 已通过的评价 (approved)
INSERT INTO reviews (
    id, author_id, teacher_id, course_id,
    rating_overall, rating_clarity, rating_workload, rating_fairness, rating_difficulty, rating_recommendation,
    content, tags, status
) VALUES
    (
        'rrrr1111-2222-3333-4444-555566667771',
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0001',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        '11111111-2222-3333-4444-555555555551',
        5, 5, 4, 5, 3, 5,
        '张老师讲课非常清晰，总是能把复杂的数学问题讲解得简单易懂。课堂氛围很好，作业量适中，推荐！',
        ARRAY['讲课清晰', '作业适中', '负责任'],
        'approved'
    ),
    (
        'rrrr1111-2222-3333-4444-555566667772',
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0002',
        'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        '22222222-3333-4444-5555-666666666661',
        4, 4, 3, 4, 4, 4,
        '李老师对语文教学很有经验，阅读理解讲得很透彻。作文批改很认真，能给出有针对性的建议。',
        ARRAY['经验丰富', '批改认真', '教学扎实'],
        'approved'
    );

-- 待审核的评价 (pending)
INSERT INTO reviews (
    id, author_id, teacher_id, course_id,
    rating_overall, rating_clarity, rating_workload, rating_fairness, rating_difficulty, rating_recommendation,
    content, tags, status
) VALUES
    (
        'rrrr2222-3333-4444-5555-666677778881',
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0001',
        'c3d4e5f6-a7b8-9012-cdef-123456789012',
        '33333333-4444-5555-6666-777777777771',
        4, 5, 3, 4, 3, 5,
        '王老师的英语课很有意思，口语练习比较多，对提高听力很有帮助。希望能多一些写作训练。',
        ARRAY['口语练习多', '有趣', '听力提升'],
        'pending'
    );

-- 已拒绝的评价 (rejected)
INSERT INTO reviews (
    id, author_id, teacher_id, course_id,
    rating_overall, rating_clarity, rating_workload, rating_fairness, rating_difficulty, rating_recommendation,
    content, tags, status, rejection_reason
) VALUES
    (
        'rrrr3333-4444-5555-6666-777788889991',
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0002',
        'd4e5f6a7-b8c9-0123-defa-234567890123',
        '44444444-5555-6666-7777-888888888881',
        2, 1, 5, 2, 5, 1,
        '老师上课很无聊，总是在讲台上讲，不与学生互动。作业特别多，考试特别难。',
        ARRAY['作业多', '考试难'],
        'rejected',
        '评价内容包含对教师的负面描述，不符合平台文明评价原则。请重新撰写评价，专注于课程内容和教学体验的客观描述。'
    );

-- =====================================================
-- 6. 插入虚构的举报 (reports)
-- =====================================================

-- 已解决的举报
INSERT INTO reports (
    id, review_id, reporter_id, reason, description, status, resolved_at, resolved_by
) VALUES
    (
        'rrrr9999-8888-7777-6666-555544443331',
        'rrrr3333-4444-5555-6666-777788889991',
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0001',
        'harassment',
        '这条评价包含对教师的人身攻击，不符合平台规则。',
        'resolved',
        NOW(),
        'aaaa1111-bbbb-cccc-dddd-eeeeffff0003'
    );

-- =====================================================
-- 完成
-- =====================================================
