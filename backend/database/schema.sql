-- ===== טבלת תלמידים =====
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    threads_knowledge ENUM('yes', 'somewhat', 'no') DEFAULT 'no',
    android_experience ENUM('yes', 'some', 'no') DEFAULT 'no',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== טבלת שיחות =====
CREATE TABLE IF NOT EXISTS student_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    user_message LONGTEXT NOT NULL,
    morna_response LONGTEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lesson_stage VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_timestamp (student_id, timestamp)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== טבלת הגשות קוד =====
CREATE TABLE IF NOT EXISTS student_code_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    code_content LONGTEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'java',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis TEXT,
    practical_score INT,
    feedback TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_submitted (student_id, submitted_at)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== טבלת הערכות =====
CREATE TABLE IF NOT EXISTS student_assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    q1_answer VARCHAR(1),
    q2_answer VARCHAR(1),
    q3_answer VARCHAR(1),
    q4_answer VARCHAR(1),
    theoretical_score INT,
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_seconds INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_assessment (student_id, assessment_date)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== טבלת דוחות סופיים =====
CREATE TABLE IF NOT EXISTS student_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    theoretical_score INT,
    practical_score INT,
    final_grade INT,
    level_achieved VARCHAR(50),
    teacher_feedback LONGTEXT,
    recommendations TEXT,
    student_reflection TEXT,
    report_generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lesson_duration_minutes INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== Indexes =====
CREATE INDEX idx_created_at ON students(created_at);
