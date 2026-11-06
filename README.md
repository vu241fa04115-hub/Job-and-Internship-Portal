# CareerHub - Job and Internship Portal

A modern, responsive, full-stack web application designed for students, freshers, job seekers, recruiters, and platform administrators. Built with React.js (Vite), Tailwind CSS, Node.js, Express.js, and MongoDB (Mongoose).

---

## 🌟 Key Features by User Role

### 🎓 1. Job Seeker / Student
* **Authentication & Profile:** Secure registration & login with JWT; customizable profile with headline, contact info, bio, skills tag editor, academic education history, and work experience.
* **Resume Management:** Upload and manage PDF resumes (up to 5MB) with built-in embedded PDF preview and download capabilities.
* **Search & Multi-Facet Filtering:** Find jobs and internships filtered by title, skills, category, workplace type (Remote / Hybrid / On-site), experience level, and minimum compensation.
* **1-Click Application:** Apply for open vacancies utilizing saved profile resumes or uploaded position-specific resumes, complete with cover letters.
* **Duplicate Prevention:** Automated backend checks and database unique indexes prevent multiple submissions to the same posting.
* **Live Status Tracking:** Real-time visibility into application stages: `Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`, and `Withdrawn`.
* **Application History & Withdrawal:** View full application timeline notes with the ability to safely withdraw active applications.
* **Bookmarks:** Save interesting opportunities to personal bookmarks with instant 1-click toggling.
* **Notification Feed:** In-app alert dropdown with unread badge counters that update whenever recruiters advance application statuses.

### 🏢 2. Recruiter / Employer
* **Recruiter Authentication & Company Profile:** Manage corporate profiles, logo uploads, size, industry, and headquarters details.
* **Job & Internship Authoring:** Post full-time jobs or summer/fall internships with salary ranges or monthly stipends, duration, openings count, application deadlines, eligibility criteria, and dynamic responsibilities/requirements lists.
* **Postings Management:** Edit, reopen, close, or delete postings.
* **Candidate Pipeline & Applicant Review:** Filter candidates by opportunity or status, search applicants by skills/name/email, view comprehensive candidate backgrounds, inspect PDF resumes, and update stages with feedback notes.
* **Automated Candidate Alerts:** Updating an applicant's status instantly sends a notification to the student candidate.

### 🛡️ 3. Platform Administrator
* **Role-Based Access Control:** Dedicated administration panel protected by server-side role validation.
* **Real-Time Analytics & Charts:** Interactive visual analytics powered by **Recharts**:
  * Application status pipeline distribution (Donut chart).
  * Job opportunities distribution across categories (Bar chart).
  * Real-time metrics: Total Users, Students, Recruiters, Active Jobs, Active Internships, Total Applications, and Pending Complaints.
* **User Moderation:** Search users, filter by role, activate or suspend accounts, and permanently delete accounts.
* **Job Moderation:** Moderate listings across the platform: approve/activate, flag inappropriate postings, close, or delete listings.
* **Reports & Complaints:** Review and resolve user reports submitted against suspicious or fraudulent listings.

---

## 💻 Technology Stack

* **Frontend:** React 18, Vite, React Router DOM 6, React Hook Form
* **Styling:** Tailwind CSS, Inter Typography, Custom Modern Component Design
* **Icons:** Lucide React
* **Data Visualization:** Recharts
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose ODM
* **Security & Auth:** JSON Web Tokens (JWT), bcrypt password hashing, Helmet, CORS, Express Rate Limiting
* **File Uploads:** Multer with strict PDF / Image MIME-type filters and 5MB size limits
* **Development Database Fallback:** Automatic embedded MongoDB Memory Server fallback for zero-configuration local execution.

---

## 🗄️ Database Architecture

The application implements standard MongoDB models with references, unique indexes, and timestamps:

* `User`: Name, email, passwordHash, role (`student` | `recruiter` | `admin`), phone, profileImage, headline, bio, location, education, skills, experience, projects, resumeUrl, resumeOriginalName, status (`active` | `suspended`).
* `Company`: Name, description, logo, website, industry, location, size, founded, recruiterId (ref: `User`).
* `Job`: Title, description, companyId (ref: `Company`), recruiterId (ref: `User`), category, location, workplaceType (`Remote` | `Hybrid` | `On-site`), jobType (`Full-time` | `Part-time` | `Contract` | `Internship`), experienceLevel, requiredSkills, salaryRange, stipendText, duration, openings, applicationDeadline, eligibilityCriteria, responsibilities, requirements, benefits, status (`active` | `closed` | `flagged`).
* `Application`: applicantId (ref: `User`), jobId (ref: `Job`), companyId (ref: `Company`), recruiterId (ref: `User`), resumeUrl, coverLetter, status (`Applied` | `Under Review` | `Shortlisted` | `Interview` | `Selected` | `Rejected` | `Withdrawn`), statusHistory, recruiterNotes. *Indexed uniquely on `(applicantId, jobId)` to prevent duplicates.*
* `SavedJob`: userId (ref: `User`), jobId (ref: `Job`). *Indexed uniquely on `(userId, jobId)`.*
* `Notification`: userId (ref: `User`), title, message, type, link, isRead.
* `Report`: reporterId (ref: `User`), jobId (ref: `Job`), reason, details, status (`pending` | `reviewed` | `resolved` | `dismissed`), adminNotes.

---

## 🔑 Pre-Seeded Demonstration Accounts

For quick manual testing or evaluation, use these pre-seeded accounts (password is identical for all three):

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Student** | `student@portal.com` | `Password123!` | Has pre-seeded applications (Shortlisted, Interview), saved jobs, resume, and notifications. |
| **Recruiter** | `recruiter@techcorp.io` | `Password123!` | Head of Talent at TechCorp Labs with active jobs, internships, and applicant pipelines. |
| **Administrator** | `admin@portal.com` | `Password123!` | Master administrator with platform metrics, user moderation, and reports access. |

*(Note: The login screen also features 1-click **Quick Demo Login** buttons for instant access to each role without typing!)*

---

## 🚀 Local Installation & Execution

### Prerequisites
* Node.js (v18.x or v20.x recommended)
* npm (v9.x or higher)
* Local MongoDB daemon (optional; if not running, the backend automatically uses an embedded local database!)

### 1. Backend Setup
```bash
cd backend

# Install dependencies (already installed in workspace)
npm install

# (Optional) Seed the database with realistic demo jobs, recruiters, students, and applications:
npm run seed

# Start the Express API server:
npm start
# or with auto-restart on changes:
npm run dev
```
The backend API starts on **http://localhost:5000**. Health check: `http://localhost:5000/api/health`.

### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend

# Install dependencies (already installed in workspace)
npm install

# Start the Vite development server:
npm run dev
```
The frontend application will be live at **http://localhost:5173**.

---

## 🧪 Automated Testing

An automated end-to-end API test suite is included in `backend/src/tests/api.test.js`. It validates 20 critical assertions across authentication, role enforcement, job creation, application workflows, duplicate prevention, notifications, saved bookmarks, and administrative dashboard statistics.

Run the test suite with:
```bash
cd backend
npm test
```

---

## 🔒 Security Best Practices Implemented

* **Password Security:** Salted bcrypt hashing with 10 salt rounds.
* **Stateless Authorization:** Cryptographic JSON Web Tokens (JWT) verified on all private endpoints.
* **Role Verification:** Strict server-side role middleware ensuring students cannot post jobs, recruiters only modify their own postings and applicants, and administrative endpoints cannot be accessed by non-admins.
* **Brute-Force Protection:** Rate-limiting middleware on authentication endpoints (`/api/auth/login`, `/api/auth/register`).
* **File Upload Sanitation:** Strict Multer filters requiring genuine `.pdf` MIME-types for resumes and image formats for avatars and logos, enforcing file size limits.
* **Data Sanitization:** Removal of sensitive fields (`passwordHash`) from all user and applicant API responses.
