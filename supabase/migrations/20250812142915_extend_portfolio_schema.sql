-- Location: supabase/migrations/20250812142915_extend_portfolio_schema.sql
-- Schema Analysis: Existing work experience tables (positions, projects, technologies) found
-- Integration Type: Extension - Adding missing portfolio functionality
-- Dependencies: Extends existing positions, projects, technologies tables

-- 1. Create User Profile System (Authentication Integration)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    phone TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    avatar_url TEXT,
    years_experience INTEGER DEFAULT 0,
    current_position TEXT,
    available_for_work BOOLEAN DEFAULT true,
    hourly_rate DECIMAL(10,2),
    languages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add Education System
CREATE TYPE public.education_level AS ENUM ('bachelor', 'master', 'phd', 'certification', 'bootcamp', 'other');

CREATE TABLE public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    level public.education_level NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    grade TEXT,
    description TEXT,
    location TEXT,
    logo_url TEXT,
    skills_gained TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add Certifications System
CREATE TYPE public.certification_status AS ENUM ('active', 'expired', 'in_progress');

CREATE TABLE public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    certification_id TEXT,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status public.certification_status DEFAULT 'active'::public.certification_status,
    credential_url TEXT,
    logo_url TEXT,
    skills TEXT[],
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Add Contact Information System
CREATE TYPE public.contact_status AS ENUM ('new', 'read', 'replied', 'archived');
CREATE TYPE public.contact_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_budget TEXT,
    project_timeline TEXT,
    status public.contact_status DEFAULT 'new'::public.contact_status,
    priority public.contact_priority DEFAULT 'medium'::public.contact_priority,
    is_spam BOOLEAN DEFAULT false,
    replied_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enhance Existing Tables with User Relationships
-- Add user_id to existing positions table
ALTER TABLE public.positions
ADD COLUMN user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN is_current BOOLEAN DEFAULT false,
ADD COLUMN location TEXT,
ADD COLUMN company TEXT,
ADD COLUMN company_logo_url TEXT,
ADD COLUMN description TEXT,
ADD COLUMN achievements JSONB DEFAULT '[]'::jsonb,
ADD COLUMN responsibilities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- Add user_id to existing projects table  
ALTER TABLE public.projects
ADD COLUMN user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN status TEXT DEFAULT 'completed',
ADD COLUMN client TEXT,
ADD COLUMN team_size INTEGER,
ADD COLUMN role TEXT,
ADD COLUMN technologies_used TEXT[],
ADD COLUMN github_url TEXT,
ADD COLUMN demo_url TEXT,
ADD COLUMN image_urls JSONB DEFAULT '[]'::jsonb,
ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;

-- 6. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_education_user_id ON public.education(user_id);
CREATE INDEX idx_education_level ON public.education(level);
CREATE INDEX idx_certifications_user_id ON public.certifications(user_id);
CREATE INDEX idx_certifications_status ON public.certifications(status);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at);
CREATE INDEX idx_positions_user_id ON public.positions(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);

-- 7. Enable RLS on All Tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.position_technology ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_usages ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies

-- Pattern 1: Core user table (user_profiles) - Simple ownership
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for user data
CREATE POLICY "users_manage_own_education"
ON public.education
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_certifications"
ON public.certifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_positions"
ON public.positions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_projects"
ON public.projects
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_technology_usages"
ON public.technology_usages
FOR ALL
TO authenticated
USING (position_id IN (SELECT id FROM public.positions WHERE user_id = auth.uid()));

-- Pattern 4: Public read, private write for portfolio content
CREATE POLICY "public_can_read_user_profiles"
ON public.user_profiles
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_education"
ON public.education
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_certifications"
ON public.certifications
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_positions"
ON public.positions
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_projects"
ON public.projects
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_technologies"
ON public.technologies
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_position_technology"
ON public.position_technology
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_technology_usages"
ON public.technology_usages
FOR SELECT
TO public
USING (true);

-- Contact messages - special handling for public form submission
CREATE POLICY "anyone_can_create_contact_messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can read/manage contact messages
CREATE POLICY "authenticated_users_manage_contact_messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 9. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER positions_updated_at
  BEFORE UPDATE ON public.positions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Mock Data for Portfolio
DO $$
DECLARE
    developer_id UUID := gen_random_uuid();
    techcorp_project_id UUID := gen_random_uuid();
    financeflow_project_id UUID := gen_random_uuid();
    datastream_project_id UUID := gen_random_uuid();
    cloudtech_project_id UUID := gen_random_uuid();
    position1_id UUID := gen_random_uuid();
    position2_id UUID := gen_random_uuid();
    position3_id UUID := gen_random_uuid();
    position4_id UUID := gen_random_uuid();
BEGIN
    -- Create auth user and profile
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES (
        developer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'portfolio@developer.com', crypt('DeveloperPortfolio2024!', gen_salt('bf', 10)), now(),
        now(), now(),
        '{"full_name": "Backend Developer"}'::jsonb,
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null
    );

    -- Update user profile with complete information
    UPDATE public.user_profiles SET
        bio = 'Senior Backend Developer with 7+ years of experience in Java, Spring Boot, microservices architecture, and scalable system design. Passionate about building robust, high-performance applications.',
        location = 'Paris, France',
        phone = '+33 6 12 34 56 78',
        linkedin_url = 'https://linkedin.com/in/backend-developer',
        github_url = 'https://github.com/backend-developer',
        portfolio_url = 'https://portfolio.developer.com',
        years_experience = 7,
        current_position = 'Senior Backend Developer',
        available_for_work = true,
        hourly_rate = 650.00,
        languages = '["French", "English"]'::jsonb
    WHERE id = developer_id;

    -- Insert Projects
    INSERT INTO public.projects (id, user_id, name, overview, methodology, start_date, end_date, status, client, team_size, role, technologies_used) VALUES
        (techcorp_project_id, developer_id, 'E-commerce Platform Redesign', 'Complete backend redesign of high-traffic e-commerce platform handling 100k+ daily transactions', 'Agile/Scrum', '2022-01-15', null, 'ongoing', 'TechCorp Solutions', 8, 'Senior Backend Developer', ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'Apache Kafka']),
        (financeflow_project_id, developer_id, 'Payment Gateway Integration', 'Integrated multiple payment providers with unified API interface supporting 15+ payment methods', 'Waterfall', '2020-03-10', '2021-12-30', 'completed', 'FinanceFlow Inc', 12, 'Backend Developer', ARRAY['Java', 'Spring Framework', 'MySQL', 'RabbitMQ', 'Jenkins', 'AWS']),
        (datastream_project_id, developer_id, 'Big Data Processing Platform', 'Developed scalable data processing platform handling petabytes of customer analytics data', 'Agile', '2018-06-01', '2020-02-28', 'completed', 'DataStream Analytics', 6, 'Java Developer', ARRAY['Java', 'Spring Boot', 'MongoDB', 'Elasticsearch', 'Apache Spark', 'Hadoop']),
        (cloudtech_project_id, developer_id, 'Customer Management System', 'Built comprehensive CRM system for small businesses with 50+ features', 'Scrum', '2017-01-15', '2018-05-30', 'completed', 'CloudTech Innovations', 10, 'Junior Java Developer', ARRAY['Java', 'Spring MVC', 'Hibernate', 'MySQL', 'Tomcat', 'JSP']);

    -- Insert Positions
    INSERT INTO public.positions (id, user_id, project_id, title, start_date, end_date, is_current, location, company, company_logo_url, description, achievements, responsibilities) VALUES
        (position1_id, developer_id, techcorp_project_id, 'Senior Backend Developer', '2022-01-15', null, true, 'Paris, France', 'TechCorp Solutions', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center', 'Leading backend development for scalable microservices architecture', 
         '["Reduced system response time by 45%", "Successfully migrated legacy monolith to microservices", "Implemented automated testing suite achieving 95% code coverage", "Led team of 4 developers"]'::jsonb,
         '["Architected and developed scalable microservices using Java Spring Boot", "Implemented event-driven architecture with Apache Kafka", "Optimized database performance resulting in 40% faster query execution", "Led code reviews and mentored junior developers", "Collaborated with DevOps team for CI/CD implementation"]'::jsonb),
        
        (position2_id, developer_id, financeflow_project_id, 'Backend Developer', '2020-03-10', '2021-12-30', false, 'Lyon, France', 'FinanceFlow Inc', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center', 'Developed secure payment processing systems handling millions in daily transactions',
         '["Implemented fraud detection system reducing false positives by 30%", "Optimized payment processing pipeline increasing throughput by 25%", "Successfully passed SOC 2 compliance audit", "Mentored 2 junior developers"]'::jsonb,
         '["Developed secure payment processing systems", "Implemented robust API endpoints for mobile and web applications", "Maintained and optimized financial calculation engines", "Collaborated with compliance team for regulatory requirements", "Participated in on-call rotation for production monitoring"]'::jsonb),
        
        (position3_id, developer_id, datastream_project_id, 'Java Developer', '2018-06-01', '2020-02-28', false, 'Marseille, France', 'DataStream Analytics', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop&crop=center', 'Built data processing pipelines for large-scale analytics platform',
         '["Processed 10TB+ of data daily with 99.9% uptime", "Reduced data processing time by 60%", "Implemented real-time data streaming capabilities", "Created comprehensive API documentation"]'::jsonb,
         '["Built data processing pipelines for large-scale analytics", "Developed RESTful APIs for data ingestion and retrieval", "Implemented search functionality using Elasticsearch", "Optimized data storage and retrieval mechanisms", "Collaborated with data scientists on ML model integration"]'::jsonb),
        
        (position4_id, developer_id, cloudtech_project_id, 'Junior Java Developer', '2017-01-15', '2018-05-30', false, 'Nice, France', 'CloudTech Innovations', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop&crop=center', 'Developed web applications using Java Spring MVC framework',
         '["Successfully delivered 5 web applications within tight deadlines", "Improved application performance by 35%", "Completed Java certification and Spring framework training", "Contributed to open-source projects"]'::jsonb,
         '["Developed web applications using Java Spring MVC framework", "Created and maintained database schemas and stored procedures", "Implemented user authentication and authorization systems", "Participated in agile development processes", "Performed unit testing and bug fixing"]'::jsonb);

    -- Insert Education
    INSERT INTO public.education (user_id, institution, degree, field_of_study, level, start_date, end_date, location, description, skills_gained) VALUES
        (developer_id, 'École Polytechnique Paris', 'Master of Engineering', 'Computer Science and Software Engineering', 'master', '2013-09-01', '2016-06-15', 'Paris, France', 'Specialized in distributed systems, algorithms, and software architecture. Graduated with honors.', ARRAY['Algorithms', 'Data Structures', 'Software Architecture', 'Distributed Systems', 'Database Design']),
        (developer_id, 'Université Pierre et Marie Curie', 'Bachelor of Science', 'Computer Science', 'bachelor', '2010-09-01', '2013-06-30', 'Paris, France', 'Strong foundation in computer science fundamentals, programming, and mathematics.', ARRAY['Java', 'C++', 'Mathematics', 'Object-Oriented Programming', 'Database Systems']);

    -- Insert Certifications
    INSERT INTO public.certifications (user_id, name, issuing_organization, issue_date, expiry_date, status, skills, description) VALUES
        (developer_id, 'AWS Certified Solutions Architect - Professional', 'Amazon Web Services', '2023-03-15', '2026-03-15', 'active', ARRAY['AWS', 'Cloud Architecture', 'Microservices', 'DevOps'], 'Advanced certification demonstrating expertise in designing distributed applications on AWS.'),
        (developer_id, 'Oracle Certified Professional Java SE 17 Developer', 'Oracle', '2022-11-20', null, 'active', ARRAY['Java', 'Object-Oriented Programming', 'Spring Framework'], 'Professional-level Java certification covering advanced language features and best practices.'),
        (developer_id, 'Spring Professional Certification', 'VMware', '2021-09-10', '2024-09-10', 'active', ARRAY['Spring Boot', 'Spring Framework', 'Dependency Injection', 'AOP'], 'Comprehensive certification in Spring Framework ecosystem and enterprise application development.'),
        (developer_id, 'Certified Kubernetes Administrator (CKA)', 'Cloud Native Computing Foundation', '2023-01-25', '2026-01-25', 'active', ARRAY['Kubernetes', 'Container Orchestration', 'DevOps', 'Cloud Native'], 'Hands-on certification demonstrating skills in Kubernetes cluster administration.');

    -- Update technology usages with proper references
    UPDATE public.technology_usages SET position_id = position1_id::uuid WHERE id IN (
        SELECT id FROM public.technology_usages LIMIT 2
    );

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data insertion: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data insertion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data insertion: %', SQLERRM;
END $$;