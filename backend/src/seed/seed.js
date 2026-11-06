require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const Report = require('../models/Report');

const seedData = async () => {
  try {
    console.log('[Seed] Starting database seed...');
    
    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
      Notification.deleteMany({}),
      Report.deleteMany({})
    ]);

    console.log('[Seed] Cleared existing data.');

    const passwordHash = await bcrypt.hash('Password123!', 10);

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Portal Administrator',
      email: 'admin@portal.com',
      passwordHash,
      role: 'admin',
      phone: '+1 (555) 019-2834',
      headline: 'Platform Master Administrator',
      status: 'active'
    });

    const recruiter1 = await User.create({
      name: 'Sarah Chen',
      email: 'recruiter@techcorp.io',
      passwordHash,
      role: 'recruiter',
      phone: '+1 (415) 890-1234',
      headline: 'Head of Technical Talent @ TechCorp Labs',
      status: 'active'
    });

    const recruiter2 = await User.create({
      name: 'Marcus Vance',
      email: 'recruiter@cloudscale.com',
      passwordHash,
      role: 'recruiter',
      phone: '+1 (512) 432-8765',
      headline: 'Director of People & Culture @ CloudScale',
      status: 'active'
    });

    const recruiter3 = await User.create({
      name: 'Elena Rostova',
      email: 'recruiter@fintechx.com',
      passwordHash,
      role: 'recruiter',
      phone: '+1 (212) 678-4321',
      headline: 'Senior University Recruiting Lead @ FinTechX',
      status: 'active'
    });

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@portal.com',
      passwordHash,
      role: 'student',
      phone: '+1 (510) 987-6543',
      headline: 'Aspiring Full-Stack Software Engineer | CS Senior @ UC Berkeley',
      bio: 'Enthusiastic computer science undergraduate with strong foundations in React, Node.js, and cloud architectures. Passionate about building accessible, performant software solutions.',
      location: 'San Francisco Bay Area, CA',
      skills: ['React', 'JavaScript', 'Node.js', 'Express', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'REST APIs', 'Git'],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California, Berkeley',
          fieldOfStudy: 'Computer Science',
          startYear: '2022',
          endYear: '2026',
          grade: '3.86 GPA'
        }
      ],
      experience: [
        {
          title: 'Frontend Developer Intern',
          company: 'NextGen Solutions',
          location: 'San Francisco, CA',
          startDate: 'Jun 2025',
          endDate: 'Aug 2025',
          current: false,
          description: 'Engineered reusable React components with Tailwind CSS, improving dashboard page load performance by 28%.'
        }
      ],
      projects: [
        {
          title: 'Campus Collaboration Platform',
          description: 'A real-time workspace for students to collaborate on engineering coursework using WebSockets and React.',
          technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
          link: 'https://github.com/alexrivera/campus-collab'
        }
      ],
      resumeUrl: '/uploads/resumes/demo-resume.pdf',
      resumeOriginalName: 'Alex_Rivera_Resume_2026.pdf',
      resumeUpdatedAt: new Date(),
      status: 'active'
    });

    const studentUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@portal.com',
      passwordHash,
      role: 'student',
      phone: '+1 (408) 555-8912',
      headline: 'Data Science & Machine Learning Enthusiast | Senior @ CMU',
      bio: 'Focused on applied machine learning, statistical modeling, and data engineering pipelines.',
      location: 'Pittsburgh, PA',
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'Data Visualization', 'Tableau'],
      education: [
        {
          degree: 'Bachelor of Science in Statistics & Machine Learning',
          institution: 'Carnegie Mellon University',
          fieldOfStudy: 'Data Science',
          startYear: '2022',
          endYear: '2026',
          grade: '3.91 GPA'
        }
      ],
      resumeUrl: '/uploads/resumes/demo-resume.pdf',
      resumeOriginalName: 'Priya_Sharma_Resume.pdf',
      resumeUpdatedAt: new Date(),
      status: 'active'
    });

    // 2. Create Companies
    const company1 = await Company.create({
      name: 'TechCorp Labs',
      description: 'TechCorp Labs is a forward-thinking AI and web software studio designing intelligent products used by millions worldwide.',
      website: 'https://techcorp.example.io',
      industry: 'Software & Artificial Intelligence',
      location: 'San Francisco, CA (Remote Friendly)',
      recruiterId: recruiter1._id,
      size: '250-500 employees',
      founded: '2019'
    });

    const company2 = await Company.create({
      name: 'CloudScale Systems',
      description: 'CloudScale provides mission-critical enterprise cloud architecture, Kubernetes orchestration, and site reliability automation.',
      website: 'https://cloudscale.example.com',
      industry: 'Cloud Computing & DevOps',
      location: 'Austin, TX (Hybrid)',
      recruiterId: recruiter2._id,
      size: '100-250 employees',
      founded: '2017'
    });

    const company3 = await Company.create({
      name: 'FinTechX Global',
      description: 'FinTechX is revolutionizing modern digital banking, algorithmic trading infrastructure, and real-time payment solutions.',
      website: 'https://fintechx.example.com',
      industry: 'Financial Technology',
      location: 'New York, NY (On-site)',
      recruiterId: recruiter3._id,
      size: '1000+ employees',
      founded: '2014'
    });

    // 3. Create Jobs & Internships
    const now = new Date();
    const futureDeadline = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const jobsData = [
      // TechCorp Jobs & Internships
      {
        title: 'Junior Frontend Software Engineer',
        description: 'We are seeking a talented Junior Frontend Software Engineer to help build our next-generation web applications. You will collaborate directly with our design and backend teams to implement responsive user interfaces, modular components, and accessible digital experiences.',
        companyId: company1._id,
        recruiterId: recruiter1._id,
        category: 'Software Engineering',
        location: 'San Francisco, CA',
        workplaceType: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Entry Level / Fresher',
        requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'TypeScript', 'REST APIs', 'Git'],
        salaryRange: { min: 90000, max: 120000, currency: 'USD', period: 'yearly' },
        openings: 3,
        applicationDeadline: futureDeadline(35),
        eligibilityCriteria: 'Recent graduates or candidates with 0-2 years of relevant software engineering experience. Strong knowledge of modern JavaScript (ES6+) and React.',
        responsibilities: [
          'Develop reusable, tested React components based on modern design systems',
          'Collaborate with product designers to translate Figma mockups into clean responsive pages',
          'Optimize web performance, client-side bundle size, and rendering bottlenecks',
          'Participate in constructive peer code reviews and team retrospectives'
        ],
        requirements: [
          'Proficiency with React.js, modern CSS, and component-driven development',
          'Familiarity with state management, RESTful APIs, and asynchronous programming',
          'Solid understanding of Git version control and collaborative workflows',
          'Bachelor’s degree in Computer Science, related field, or equivalent practical portfolio'
        ],
        benefits: [
          'Competitive salary and equity grant',
          '100% remote flexibility and $1,500 home office stipend',
          'Comprehensive health, dental, and vision insurance',
          'Annual $2,000 learning & conference allowance'
        ],
        featured: true,
        status: 'active'
      },
      {
        title: 'Summer 2026 Software Engineering Intern',
        description: 'Join TechCorp Labs for an immersive 12-week paid internship! Interns are paired with senior engineering mentors and work on genuine production services that power our core platform.',
        companyId: company1._id,
        recruiterId: recruiter1._id,
        category: 'Software Engineering',
        location: 'Remote (US & Canada)',
        workplaceType: 'Remote',
        jobType: 'Internship',
        experienceLevel: 'Internship',
        duration: '12 Weeks (Summer 2026)',
        stipendText: '$5,000 / month',
        salaryRange: { min: 5000, max: 6000, currency: 'USD', period: 'stipend' },
        openings: 5,
        applicationDeadline: futureDeadline(45),
        eligibilityCriteria: 'Currently enrolled in an undergraduate or graduate degree in Computer Science, Software Engineering, or related STEM disciplines graduating between Dec 2026 and June 2028.',
        responsibilities: [
          'Architect and deliver a high-impact end-to-end feature alongside a designated mentor',
          'Write clean, maintainable, and well-tested code in React and Node.js',
          'Present internship project outcomes to company leadership during Demo Day'
        ],
        requirements: [
          'Fundamental grasp of data structures, algorithms, and web technologies',
          'Experience building projects with JavaScript, Python, or Go',
          'Excitement to learn fast in a supportive, collaborative environment'
        ],
        benefits: [
          '$5,000 monthly stipend',
          'Full-time return offer opportunities for top performers',
          '1-on-1 mentorship from principal engineers',
          'Virtual social events, hackathons, and executive Q&A sessions'
        ],
        featured: true,
        status: 'active'
      },
      {
        title: 'Product Design & UX Research Intern',
        description: 'Our design team is looking for a creative UI/UX Intern passionate about user research, interactive wireframing, and component libraries.',
        companyId: company1._id,
        recruiterId: recruiter1._id,
        category: 'Design',
        location: 'San Francisco, CA',
        workplaceType: 'Hybrid',
        jobType: 'Internship',
        experienceLevel: 'Internship',
        duration: '16 Weeks',
        stipendText: '$4,200 / month',
        salaryRange: { min: 4200, max: 4800, currency: 'USD', period: 'stipend' },
        openings: 2,
        applicationDeadline: futureDeadline(30),
        eligibilityCriteria: 'Degree students in HCI, Interaction Design, Product Design, or related creative disciplines with an online portfolio.',
        responsibilities: [
          'Conduct user usability interviews and synthesize behavioral feedback',
          'Create high-fidelity wireframes and clickable Figma prototypes',
          'Contribute to our centralized Tailwind design token system'
        ],
        requirements: [
          'Strong portfolio showcasing UI/UX case studies',
          'Fluency in Figma, auto-layout, and prototyping tools',
          'Empathy for accessibility (WCAG) standards'
        ],
        benefits: [
          'Competitive monthly stipend',
          'Portfolio mentorship by senior product designers'
        ],
        featured: false,
        status: 'active'
      },

      // CloudScale Systems Jobs & Internships
      {
        title: 'Backend Node.js & Cloud Engineer',
        description: 'CloudScale is hiring a Backend Engineer to build resilient microservices, distributed caching layers, and high-throughput streaming systems using Node.js, Docker, and AWS.',
        companyId: company2._id,
        recruiterId: recruiter2._id,
        category: 'Software Engineering',
        location: 'Austin, TX',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Redis'],
        salaryRange: { min: 110000, max: 145000, currency: 'USD', period: 'yearly' },
        openings: 2,
        applicationDeadline: futureDeadline(28),
        eligibilityCriteria: '2+ years professional software development experience with backend systems.',
        responsibilities: [
          'Design and maintain scalable REST and gRPC microservices in Node.js',
          'Optimize database queries and indexing strategies in MongoDB & PostgreSQL',
          'Implement automated unit and integration test pipelines'
        ],
        requirements: [
          'Solid proficiency in JavaScript/TypeScript backend development',
          'Familiarity with containerization (Docker) and CI/CD pipelines',
          'Understanding of distributed caching and rate-limiting patterns'
        ],
        benefits: [
          'Competitive base salary plus 401(k) matching',
          'Flexible hybrid schedule (2 days in modern downtown Austin office)',
          'Unlimited PTO and wellness stipends'
        ],
        featured: true,
        status: 'active'
      },
      {
        title: 'Cloud Infrastructure & DevOps Intern',
        description: 'Kickstart your career in cloud engineering! Work with our Platform Engineering team managing Kubernetes clusters, Terraform infrastructure-as-code, and observability tooling.',
        companyId: company2._id,
        recruiterId: recruiter2._id,
        category: 'DevOps & Cloud',
        location: 'Austin, TX',
        workplaceType: 'Hybrid',
        jobType: 'Internship',
        experienceLevel: 'Internship',
        duration: '12 Weeks',
        stipendText: '$4,600 / month',
        salaryRange: { min: 4600, max: 5000, currency: 'USD', period: 'stipend' },
        openings: 2,
        applicationDeadline: futureDeadline(40),
        eligibilityCriteria: 'Students interested in Site Reliability Engineering, Linux, cloud providers, and automated deployments.',
        responsibilities: [
          'Assist in writing Terraform modules for reproducible cloud environments',
          'Configure Grafana and Prometheus monitoring alerts',
          'Automate GitHub Actions deployment workflows'
        ],
        requirements: [
          'Basic understanding of Linux command-line and networking concepts',
          'Curiosity about Docker containers and cloud computing (AWS / GCP / Azure)',
          'Scripting knowledge in Bash or Python'
        ],
        benefits: [
          '$4,600 monthly stipend',
          'AWS Certification exam sponsorship'
        ],
        featured: false,
        status: 'active'
      },

      // FinTechX Global Jobs & Internships
      {
        title: 'Junior Full-Stack Web Developer',
        description: 'FinTechX is expanding our customer-facing merchant portal team. We are looking for an ambitious Junior Full-Stack Developer proficient with React, Node.js, and database systems.',
        companyId: company3._id,
        recruiterId: recruiter3._id,
        category: 'Software Engineering',
        location: 'New York, NY',
        workplaceType: 'On-site',
        jobType: 'Full-time',
        experienceLevel: 'Entry Level / Fresher',
        requiredSkills: ['React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'REST APIs'],
        salaryRange: { min: 95000, max: 125000, currency: 'USD', period: 'yearly' },
        openings: 4,
        applicationDeadline: futureDeadline(20),
        eligibilityCriteria: 'Graduating seniors or entry-level developers with demonstrable full-stack web application projects.',
        responsibilities: [
          'Build end-to-end user workflows from frontend React forms to backend validation and database storage',
          'Ensure high performance and security compliance across financial transactions',
          'Write comprehensive test coverage'
        ],
        requirements: [
          'Strong command of modern JavaScript, React, and Express',
          'Understanding of relational and non-relational database models',
          'Passion for financial technology and user privacy'
        ],
        benefits: [
          'Wall Street competitive starting package and annual performance bonus',
          'Comprehensive health benefits with full family coverage',
          'Commuter transit passes and catered team lunches'
        ],
        featured: true,
        status: 'active'
      },
      {
        title: 'Data Science & Machine Learning Intern',
        description: 'Collaborate with our Quantitative Research team to analyze millions of daily payment transactions, train fraud detection models, and present actionable customer insights.',
        companyId: company3._id,
        recruiterId: recruiter3._id,
        category: 'Data Science',
        location: 'New York, NY',
        workplaceType: 'Hybrid',
        jobType: 'Internship',
        experienceLevel: 'Internship',
        duration: '6 Months (Co-op / Internship)',
        stipendText: '$5,200 / month',
        salaryRange: { min: 5200, max: 6000, currency: 'USD', period: 'stipend' },
        openings: 3,
        applicationDeadline: futureDeadline(25),
        eligibilityCriteria: 'Students pursuing degrees in Data Science, Statistics, Computer Science, or Mathematics.',
        responsibilities: [
          'Clean, preprocess, and analyze large-scale transactional datasets in Python and SQL',
          'Train, evaluate, and benchmark machine learning models for anomaly detection',
          'Build interactive dashboards visualizing model performance metrics'
        ],
        requirements: [
          'Proficiency with Python (Pandas, NumPy, Scikit-Learn) and SQL queries',
          'Solid understanding of statistical hypothesis testing and regression analysis',
          'Clear communication skills for presenting findings to technical and business teams'
        ],
        benefits: [
          'Top-tier $5,200 monthly compensation',
          'Opportunity for accelerated full-time quantitative analyst offer'
        ],
        featured: true,
        status: 'active'
      },
      {
        title: 'Growth Marketing & Content Strategist',
        description: 'FinTechX is looking for a digital marketing specialist to drive organic user acquisition, content creation, and developer community advocacy.',
        companyId: company3._id,
        recruiterId: recruiter3._id,
        category: 'Marketing',
        location: 'New York, NY',
        workplaceType: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        requiredSkills: ['SEO', 'Content Strategy', 'Google Analytics', 'Social Media', 'Copywriting'],
        salaryRange: { min: 85000, max: 110000, currency: 'USD', period: 'yearly' },
        openings: 1,
        applicationDeadline: futureDeadline(30),
        eligibilityCriteria: '2+ years experience in digital marketing or content creation for B2B / SaaS technology companies.',
        responsibilities: [
          'Plan and execute organic SEO content campaigns targeting financial developers',
          'Manage company blog, monthly newsletters, and social channels',
          'Track conversion funnel metrics and present weekly growth analytics'
        ],
        requirements: [
          'Proven portfolio of published articles and technical content',
          'Experience with Google Analytics, SEMrush, and CRM platforms'
        ],
        benefits: [
          'Competitive salary and bonus',
          'Annual marketing conference budget'
        ],
        featured: false,
        status: 'active'
      }
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`[Seed] Created ${createdJobs.length} jobs and internships.`);

    // 4. Create Pre-seeded Applications for Alex Rivera (Student)
    // Job 0: Junior Frontend Engineer (Status: Shortlisted)
    const app1 = await Application.create({
      applicantId: studentUser._id,
      jobId: createdJobs[0]._id,
      companyId: company1._id,
      recruiterId: recruiter1._id,
      resumeUrl: studentUser.resumeUrl,
      coverLetter: 'Dear Hiring Team at TechCorp Labs, I am thrilled to apply for the Junior Frontend Engineer role. My experience building React interfaces and my background in CS at UC Berkeley align closely with your team’s focus on delightful user experiences.',
      status: 'Shortlisted',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: studentUser._id,
          note: 'Application submitted online.',
          changedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: recruiter1._id,
          note: 'Resume reviewed by Sarah Chen. Strong match for React and UI fundamentals.',
          changedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Shortlisted',
          updatedBy: recruiter1._id,
          note: 'Candidate shortlisted for technical screening round.',
          changedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      recruiterNotes: 'Solid GitHub projects with React and clean design system. Recommend scheduling technical interview.',
      appliedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    });

    // Job 1: Summer 2026 SWE Intern (Status: Interview)
    const app2 = await Application.create({
      applicantId: studentUser._id,
      jobId: createdJobs[1]._id,
      companyId: company1._id,
      recruiterId: recruiter1._id,
      resumeUrl: studentUser.resumeUrl,
      coverLetter: 'I am excited to submit my candidacy for the Summer 2026 Software Engineering Internship. I have extensive hands-on experience with modern JavaScript frameworks and collaborative engineering teams.',
      status: 'Interview',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: studentUser._id,
          note: 'Application submitted online.',
          changedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: recruiter1._id,
          note: 'Resume reviewed.',
          changedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Interview',
          updatedBy: recruiter1._id,
          note: 'Invited to 45-minute technical screen with senior mentor.',
          changedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      recruiterNotes: 'Top candidate from UC Berkeley. Technical interview scheduled for next Tuesday.',
      appliedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    });

    // Job 5: Junior Full-Stack Web Developer at FinTechX (Status: Under Review)
    const app3 = await Application.create({
      applicantId: studentUser._id,
      jobId: createdJobs[5]._id,
      companyId: company3._id,
      recruiterId: recruiter3._id,
      resumeUrl: studentUser.resumeUrl,
      coverLetter: 'I am passionate about building modern web applications that handle secure financial workflows.',
      status: 'Under Review',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: studentUser._id,
          note: 'Application submitted.',
          changedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Under Review',
          updatedBy: recruiter3._id,
          note: 'Screening portfolio and resume.',
          changedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      ],
      appliedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    });

    // Application for Priya (Data Science Intern)
    await Application.create({
      applicantId: studentUser2._id,
      jobId: createdJobs[6]._id, // FinTechX Data Science Intern
      companyId: company3._id,
      recruiterId: recruiter3._id,
      resumeUrl: studentUser2.resumeUrl,
      coverLetter: 'My academic coursework in ML and statistical analysis at CMU makes this internship a dream opportunity.',
      status: 'Shortlisted',
      statusHistory: [
        {
          status: 'Applied',
          updatedBy: studentUser2._id,
          note: 'Application submitted.',
          changedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'Shortlisted',
          updatedBy: recruiter3._id,
          note: 'Excellent quantitative background.',
          changedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      ],
      recruiterNotes: 'Impressive GPA and relevant coursework in statistical modeling.',
      appliedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    });

    // Update applicationsCount on jobs
    await Job.findByIdAndUpdate(createdJobs[0]._id, { applicationsCount: 1 });
    await Job.findByIdAndUpdate(createdJobs[1]._id, { applicationsCount: 1 });
    await Job.findByIdAndUpdate(createdJobs[5]._id, { applicationsCount: 1 });
    await Job.findByIdAndUpdate(createdJobs[6]._id, { applicationsCount: 1 });

    // 5. Create Saved Jobs for Alex Rivera
    await SavedJob.create({
      userId: studentUser._id,
      jobId: createdJobs[3]._id // Backend Node.js
    });
    await SavedJob.create({
      userId: studentUser._id,
      jobId: createdJobs[4]._id // Cloud Infrastructure Intern
    });

    // 6. Create Notifications for Alex Rivera
    await Notification.create({
      userId: studentUser._id,
      title: 'Interview Invitation!',
      message: 'Great news! Sarah Chen has invited you to an Interview for "Summer 2026 Software Engineering Intern".',
      type: 'application_status',
      link: '/student/applications',
      isRead: false
    });

    await Notification.create({
      userId: studentUser._id,
      title: 'Application Shortlisted',
      message: 'Your application for "Junior Frontend Software Engineer" has been Shortlisted.',
      type: 'application_status',
      link: '/student/applications',
      isRead: true
    });

    await Notification.create({
      userId: studentUser._id,
      title: 'Welcome to Job & Internship Portal',
      message: 'Welcome Alex! Complete your profile and upload your resume to apply for high-growth tech roles with 1-click.',
      type: 'system',
      link: '/student/profile',
      isRead: true
    });

    // Notification for Recruiter
    await Notification.create({
      userId: recruiter1._id,
      title: 'New Applicant Received',
      message: 'Alex Rivera submitted an application for "Junior Frontend Software Engineer".',
      type: 'application_received',
      link: `/recruiter/applicants?jobId=${createdJobs[0]._id}`,
      isRead: false
    });

    // 7. Create a Sample Report for Admin demonstration
    await Report.create({
      reporterId: studentUser._id,
      jobId: createdJobs[7]._id,
      reason: 'Expired or duplicate',
      details: 'This posting looks very similar to an older opening from last month. Please verify deadline.',
      status: 'pending'
    });

    console.log('[Seed] Database seeded successfully with demo accounts:');
    console.log('       ADMIN:     admin@portal.com / Password123!');
    console.log('       RECRUITER: recruiter@techcorp.io / Password123!');
    console.log('       STUDENT:   student@portal.com / Password123!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    throw error;
  }
};

// If run directly
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedData();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = seedData;
