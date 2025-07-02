# Kickoff Goal / Target Tracker

A comprehensive goal and target tracking system built with HTML, CSS, JavaScript, and Supabase for managing web development projects with detailed tracking and user management.

## Features

### User Management
- **Three User Roles:**
  - Manager: Full access to create/edit/delete projects and manage users
  - Webmaster Level 1: View and update assigned projects
  - Webmaster Level 2: View and update assigned projects

### Project Management
- **Required Fields:**
  - Project Name
  - Ticket Link
  - Design Approved Date
  - Assigned Webmaster
  - Webmaster Assigned Date
  - Target Date (WP Conversion)

- **Project Status Tracking:**
  - WP Conversion
  - WP Conversion Review
  - Page Creation
  - Page Creation QA
  - Golive QA
  - Completed

- **Detailed Progress Tracking:**
  - WP Conversion phase tracking
  - Page Creation phase tracking
  - Go Live phase tracking
  - Quality assurance checkpoints
  - Bug tracking and reopening flags

### Task Management
- **Associate Multiple Tasks with Each Project:**
  - Task Name (required)
  - Task Description
  - Sent Date
  - Ticket Updated Date
  - Completed Date

- **Task Features:**
  - Add, edit, and delete tasks within projects
  - Track task progress with date milestones
  - Visual status indicators (completed/pending)
  - Manager-only task management permissions

### Goal Tracking System
- **Monthly Goals (evaluated on 10th of each month):**
  - Design conversion quality (90% for Level 1, 80% for Level 2)
  - 8-hour technical issue tracking
  - 10-day compliance standards
  - Zero reopened bugs policy
  - Page bug fix time (3 working days)

- **Biweekly Goals (evaluated every other Monday):**
  - Task update timeliness (2 working days)
  - Design completion deadlines

- **Working Day Calculations:**
  - Excludes weekends
  - Considers US Federal holidays for US schedule
  - Considers Sri Lankan holidays for SL schedule
  - Automatic evaluation and achievement tracking

### Leave Management
- Track user leaves with start/end dates
- Leave reasons and scheduling conflicts

## Setup Instructions

### 1. Clone/Download the Project
Download all files to your local directory.

### 2. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Database Schema
Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'webmaster_level_1', 'webmaster_level_2')),
    work_schedule VARCHAR(10) NOT NULL CHECK (work_schedule IN ('US', 'SL')),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    ticket_link VARCHAR(500) NOT NULL,
    design_approved_date DATE NOT NULL,
    assigned_webmaster BIGINT REFERENCES users(id),
    webmaster_assigned_date DATE NOT NULL,
    target_date DATE,
    project_status VARCHAR(50) DEFAULT 'WP conversion'
        CHECK (project_status IN ('WP conversion', 'WP conversion Review', 'Page creation', 'Page creation QA', 'Golive QA', 'Completed')),
    signed_up_date DATE,
    contract_start_date DATE,

    -- WP Conversion Tracking
    manager_sent_back BOOLEAN DEFAULT FALSE,
    date_sent_to_wp_qa DATE,
    date_finished_wp_qa DATE,
    date_finished_wp_bugs DATE,
    wp_reopened_bugs BOOLEAN DEFAULT FALSE,

    -- Page Creation Tracking
    date_sent_to_page_qa DATE,
    date_finished_page_qa DATE,
    date_finished_page_bugs DATE,
    page_reopened_bugs BOOLEAN DEFAULT FALSE,

    -- Go Live Tracking
    dns_changed_date DATE,
    date_sent_to_golive_qa DATE,
    date_finished_golive_qa DATE,
    date_finished_golive_bugs DATE,
    golive_reopened_bugs BOOLEAN DEFAULT FALSE,

    -- Quality Checks (Issues tracking)
    issues_after_8_hours BOOLEAN DEFAULT FALSE,
    issues_8_hours_text TEXT,
    issues_after_10_days BOOLEAN DEFAULT FALSE,
    issues_10_days_text TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaves table
CREATE TABLE leaves (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    sent_date DATE,
    ticket_updated_date DATE,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(project_status);
CREATE INDEX idx_projects_webmaster ON projects(assigned_webmaster);
CREATE INDEX idx_leaves_user ON leaves(user_id);
CREATE INDEX idx_leaves_dates ON leaves(start_date, end_date);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_completed ON tasks(completed_date);

-- Insert default manager user (password should be hashed in production)
INSERT INTO users (name, email, role, work_schedule, password) VALUES
('System Manager', 'manager@example.com', 'manager', 'US', 'password123');

-- Update existing user password if it exists
UPDATE users SET password = 'password123' WHERE email = 'manager@example.com';

-- IMPORTANT: Disable Row Level Security for now (since we're using custom auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE leaves DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Note: The RLS policies below won't work with custom authentication
-- They are kept for reference but commented out
/*
-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;

-- Policies for users table (managers can see all, others can see only themselves)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = email OR
                     EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'manager'));

CREATE POLICY "Managers can manage users" ON users
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'manager'));

-- Policies for projects table
CREATE POLICY "Everyone can view projects" ON projects FOR SELECT USING (true);

CREATE POLICY "Managers can manage projects" ON projects
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'manager'));

CREATE POLICY "Webmasters can update assigned projects" ON projects
    FOR UPDATE USING (assigned_webmaster IN (SELECT id FROM users WHERE email = auth.email()));

-- Policies for leaves table
CREATE POLICY "Users can view own leaves" ON leaves
    FOR SELECT USING (user_id IN (SELECT id FROM users WHERE email = auth.email()) OR
                     EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'manager'));

CREATE POLICY "Managers can manage leaves" ON leaves
    FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'manager'));
```

### 3. Configure the Application

1. Open `app.js`
2. Replace the placeholder values with your Supabase credentials:

```javascript
const SUPABASE_URL = 'your-project-url';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. Authentication Setup

In Supabase Dashboard:
1. Go to Authentication > Settings
2. Disable email confirmations for development (optional)
3. Configure your site URL if deploying

### 5. Running the Application

1. **Local Development:**
   - Simply open `index.html` in a web browser
   - Or use a local server like Live Server in VS Code

2. **Demo Mode:**
   - If Supabase credentials are not configured, the app runs in demo mode
   - Default login: `manager@example.com` / `password`

## Usage

### Login Credentials (Demo Mode)
- **Manager:** manager@example.com / password123
- **Webmaster 1:** webmaster1@example.com / password
- **Webmaster 2:** webmaster2@example.com / password

### Manager Features
- Create, edit, and delete projects
- Assign webmasters to projects
- Manage users (add/edit/delete)
- Track leave schedules
- Full project tracking capabilities
- **Manage project tasks:** Add, edit, and delete tasks within projects

### Webmaster Features
- View assigned projects
- Update project status and tracking information
- View project details and timelines
- **View project tasks:** See all tasks associated with projects (read-only)

## File Structure

```
project-management-system/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styling
├── app.js             # Application logic and Supabase integration
└── README.md          # This file
```

## Key Features Explained

### Project Status Workflow
1. **WP Conversion** - Initial development phase
2. **WP Conversion Review** - Manager review phase
3. **Page Creation** - Content and page development
4. **Page Creation QA** - Quality assurance testing
5. **Golive QA** - Final pre-launch testing
6. **Completed** - Project finished

### Quality Checkpoints
- **8-Hour Issues Check:** Track and document any issues found 8 hours after DNS change
- **10-Day Issues Check:** Track and document any issues found after 10 working days
- Issues are tracked with checkboxes and detailed text descriptions when problems are identified

### User Roles and Permissions
- **Manager:** Full system access
- **Webmaster Level 1 & 2:** Project view and update access
- Role-based UI hiding/showing of features

## Development Notes

### Extending the System
- Add new project status types in both database schema and JavaScript
- Modify user roles by updating the CHECK constraints
- Add new tracking fields by extending the projects table

### Security Considerations
- Passwords should be properly hashed in production
- Implement proper Supabase RLS policies
- Consider implementing session management
- Add input validation and sanitization

### Performance Optimization
- Database indexes are included for common queries
- Consider pagination for large datasets
- Implement caching for frequently accessed data

## Troubleshooting

### Common Issues
1. **Supabase Connection Failed:** Check your URL and API key
2. **Authentication Errors:** Verify RLS policies and user table structure
3. **Permission Denied:** Check user roles and policy configurations

### Browser Console
Check browser console for detailed error messages and debugging information.

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase configuration
3. Ensure database schema matches the provided SQL
4. Test with demo mode first to isolate configuration issues
