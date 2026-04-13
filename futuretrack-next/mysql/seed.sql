USE futuretrack;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_course_enrollments;
TRUNCATE TABLE recommendations;
TRUNCATE TABLE course_skills;
TRUNCATE TABLE job_skills;
TRUNCATE TABLE profile_skills;
TRUNCATE TABLE courses;
TRUNCATE TABLE jobs;
TRUNCATE TABLE skills;
TRUNCATE TABLE profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, full_name, email, password_hash, role)
VALUES
  (1, 'Riya Verma', 'riya@example.com', '$2y$10$dummyHashForSeedOnly', 'student');

INSERT INTO profiles (
  id, user_id, headline, location, education_summary, experience_years, career_interests, about
) VALUES (
  1,
  1,
  'Aspiring Product Analyst',
  'Bengaluru',
  'B.Sc Computer Science',
  1,
  JSON_ARRAY('Product Analytics', 'Data Visualization', 'Growth'),
  'Career-focused learner interested in product-led decision making and analytics.'
);

INSERT INTO skills (id, name, category)
VALUES
  (1, 'SQL', 'Analytics'),
  (2, 'Python', 'Programming'),
  (3, 'A/B Testing', 'Analytics'),
  (4, 'Dashboarding', 'Analytics'),
  (5, 'Communication', 'Soft Skills'),
  (6, 'React', 'Frontend'),
  (7, 'TypeScript', 'Frontend'),
  (8, 'Tailwind CSS', 'Frontend'),
  (9, 'REST APIs', 'Backend'),
  (10, 'Git', 'Tools'),
  (11, 'Tableau', 'Analytics'),
  (12, 'Statistics', 'Analytics'),
  (13, 'Storytelling', 'Soft Skills'),
  (14, 'Linux', 'Cloud'),
  (15, 'AWS Basics', 'Cloud'),
  (16, 'Networking', 'Cloud'),
  (17, 'Troubleshooting', 'Cloud');

INSERT INTO profile_skills (profile_id, skill_id, proficiency_level, years_of_experience)
VALUES
  (1, 1, 4, 1.0),
  (1, 2, 3, 1.0),
  (1, 4, 4, 1.0),
  (1, 5, 4, 1.0);

INSERT INTO jobs (
  id, title, company_name, location, domain, experience_level, salary_min, salary_max,
  description, responsibilities, benefits
)
VALUES
  (
    101,
    'Product Analyst Intern',
    'NovaPath',
    'Bengaluru',
    'Product Management',
    'Entry',
    450000,
    600000,
    'Support product teams with user behavior insights and experiment analysis.',
    JSON_ARRAY('Analyze product funnel and retention metrics', 'Build dashboards for product teams', 'Collaborate on experiment design and reporting'),
    JSON_ARRAY('Hybrid work', 'Mentorship', 'Learning stipend')
  ),
  (
    102,
    'Frontend Developer',
    'PixelForge Labs',
    'Remote',
    'Frontend Engineering',
    'Entry',
    600000,
    900000,
    'Build responsive interfaces for B2B SaaS modules.',
    JSON_ARRAY('Develop reusable UI components', 'Integrate frontend with APIs', 'Improve page performance and accessibility'),
    JSON_ARRAY('Remote-first', 'Health insurance', 'Wellness allowance')
  ),
  (
    103,
    'Data Analyst',
    'FinEdge',
    'Mumbai',
    'Data Science',
    'Mid',
    800000,
    1300000,
    'Transform business data into insights for growth and operations.',
    JSON_ARRAY('Deliver insights to leadership teams', 'Automate recurring KPI reporting', 'Partner with product and marketing teams'),
    JSON_ARRAY('Performance bonus', 'Upskilling budget', 'Flexible timing')
  );

INSERT INTO job_skills (job_id, skill_id, is_mandatory, weight)
VALUES
  (101, 1, TRUE, 1.2),
  (101, 2, TRUE, 1.2),
  (101, 3, TRUE, 1.0),
  (101, 4, TRUE, 1.0),
  (101, 5, TRUE, 0.8),
  (102, 6, TRUE, 1.2),
  (102, 7, TRUE, 1.2),
  (102, 8, TRUE, 1.0),
  (102, 9, TRUE, 1.0),
  (102, 10, TRUE, 0.8),
  (103, 1, TRUE, 1.2),
  (103, 2, TRUE, 1.2),
  (103, 11, TRUE, 1.0),
  (103, 12, TRUE, 1.0),
  (103, 13, TRUE, 0.8);

INSERT INTO courses (
  id, title, provider, domain, category, level, duration_hours, description
)
VALUES
  (201, 'A/B Testing for Product Teams', 'GrowthX Academy', 'Product Management', 'Analytics', 'Intermediate', 28, 'Practical experimentation for product and growth teams.'),
  (202, 'React + TypeScript Bootcamp', 'CodeSprint', 'Frontend Engineering', 'Development', 'Beginner', 42, 'Build modern frontend applications with React and TypeScript.'),
  (203, 'Tableau for Business Insights', 'DataCraft', 'Data Science', 'Visualization', 'Beginner', 21, 'Create business dashboards and analytical stories in Tableau.'),
  (204, 'AWS Cloud Practitioner Path', 'CloudLift', 'Cloud & DevOps', 'Cloud', 'Beginner', 35, 'Cloud fundamentals with practical AWS use cases.'),
  (205, 'SQL for Product Analysts', 'QueryLab', 'Product Management', 'Analytics', 'Intermediate', 14, 'Advanced SQL patterns for product and growth analytics.');

INSERT INTO course_skills (course_id, skill_id, coverage_level)
VALUES
  (201, 3, 3),
  (201, 1, 2),
  (202, 6, 3),
  (202, 7, 3),
  (202, 8, 2),
  (202, 10, 2),
  (203, 11, 3),
  (203, 13, 2),
  (204, 15, 3),
  (204, 14, 2),
  (204, 16, 2),
  (205, 1, 3),
  (205, 4, 2);

INSERT INTO recommendations (id, user_id, recommendation_type, reference_id, title, reason, score)
VALUES
  (1, 1, 'job', 101, 'Apply to Product Analyst Intern roles', 'You already match core analytics requirements in most entry roles.', 87.0),
  (2, 1, 'course', 201, 'Learn A/B Testing this month', 'Improves your match score by up to 18% for product analytics jobs.', 92.0),
  (3, 1, 'tip', NULL, 'Build one portfolio case study', 'Recruiters prioritize evidence of decision-making and metrics impact.', 80.0);

INSERT INTO user_course_enrollments (user_id, course_id, enrollment_status, progress_percent)
VALUES
  (1, 205, 'in_progress', 40),
  (1, 201, 'enrolled', 0);
