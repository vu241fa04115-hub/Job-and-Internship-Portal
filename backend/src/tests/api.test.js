const http = require('http');
const app = require('../app');
const { connectDB, disconnectDB } = require('../config/db');
const seedData = require('../seed/seed');

let server;
let baseUrl;

const request = async (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting Job and Internship Portal Comprehensive API Verification ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name}`);
      failed++;
    }
  };

  try {
    await connectDB();
    await seedData();

    // Start ephemeral test server on random port
    server = http.createServer(app);
    await new Promise((resolve) => {
      server.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`Test server active on ${baseUrl}`);
        resolve();
      });
    });

    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health returns ok');

    // 2. Auth: Login as Student
    const studentLogin = await request('POST', '/api/auth/login', {
      email: 'student@portal.com',
      password: 'Password123!'
    });
    assert(studentLogin.status === 200 && studentLogin.data.token, 'POST /api/auth/login succeeds for student');
    const studentToken = studentLogin.data.token;

    // 3. Auth: Login as Recruiter
    const recruiterLogin = await request('POST', '/api/auth/login', {
      email: 'recruiter@techcorp.io',
      password: 'Password123!'
    });
    assert(recruiterLogin.status === 200 && recruiterLogin.data.token, 'POST /api/auth/login succeeds for recruiter');
    const recruiterToken = recruiterLogin.data.token;

    // 4. Auth: Login as Admin
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@portal.com',
      password: 'Password123!'
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'POST /api/auth/login succeeds for admin');
    const adminToken = adminLogin.data.token;

    // 5. Auth: Get Current User Profile
    const me = await request('GET', '/api/auth/me', null, studentToken);
    assert(me.status === 200 && me.data.user.email === 'student@portal.com', 'GET /api/auth/me returns user data');

    // 6. Jobs: List Jobs
    const jobs = await request('GET', '/api/jobs');
    assert(jobs.status === 200 && jobs.data.jobs.length > 0, `GET /api/jobs returns list of ${jobs.data?.jobs?.length} jobs`);

    // 7. Jobs: Filter Internships
    const internships = await request('GET', '/api/jobs?isInternship=true');
    assert(
      internships.status === 200 && internships.data.jobs.every(j => j.jobType === 'Internship'),
      'GET /api/jobs?isInternship=true returns only internships'
    );

    const firstJobId = jobs.data.jobs[0]._id;

    // 8. Jobs: Get Single Job Details
    const jobDetails = await request('GET', `/api/jobs/${firstJobId}`);
    assert(jobDetails.status === 200 && jobDetails.data.job._id === firstJobId, 'GET /api/jobs/:id returns full job details');

    // 9. Jobs: Recruiter creates a new posting
    const newJob = await request('POST', '/api/jobs', {
      title: 'Senior React Developer (Test)',
      description: 'Test posting created by recruiter automated test',
      category: 'Software Engineering',
      location: 'Remote',
      workplaceType: 'Remote',
      jobType: 'Full-time',
      experienceLevel: 'Senior Level',
      requiredSkills: ['React', 'Redux', 'TypeScript'],
      salaryRange: { min: 130000, max: 160000, period: 'yearly' },
      openings: 2,
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }, recruiterToken);
    assert(newJob.status === 201 && newJob.data.job.title === 'Senior React Developer (Test)', 'POST /api/jobs creates posting');

    const createdJobId = newJob.data.job._id;

    // 10. Applications: Student applies for the newly created job
    const apply = await request('POST', `/api/applications/apply/${createdJobId}`, {
      resumeUrl: '/uploads/resumes/demo-resume.pdf',
      coverLetter: 'Hello! I am very excited to apply for this test senior position.'
    }, studentToken);
    assert(apply.status === 201 && apply.data.application.status === 'Applied', 'POST /api/applications/apply submits application');

    // 11. Applications: Prevent duplicate application
    const duplicateApply = await request('POST', `/api/applications/apply/${createdJobId}`, {
      resumeUrl: '/uploads/resumes/demo-resume.pdf'
    }, studentToken);
    assert(duplicateApply.status === 400, 'POST /api/applications/apply rejects duplicate submission with 400 error');

    // 12. Applications: Student retrieves their applications
    const myApps = await request('GET', '/api/applications/my-applications', null, studentToken);
    assert(
      myApps.status === 200 && myApps.data.applications.some(a => a.jobId?._id === createdJobId),
      'GET /api/applications/my-applications lists candidate applications'
    );

    const applicationId = apply.data.application._id;

    // 13. Applications: Recruiter updates application status to "Shortlisted"
    const updateStatus = await request('PUT', `/api/applications/${applicationId}/status`, {
      status: 'Shortlisted',
      note: 'Candidate advanced to next round'
    }, recruiterToken);
    assert(
      updateStatus.status === 200 && updateStatus.data.application.status === 'Shortlisted',
      'PUT /api/applications/:id/status updates status to Shortlisted'
    );

    // 14. Notifications: Verify student received status change notification
    const notifications = await request('GET', '/api/notifications', null, studentToken);
    assert(
      notifications.status === 200 && notifications.data.notifications.some(n => n.title.includes('Shortlisted')),
      'GET /api/notifications verifies student received notification for status update'
    );

    // 15. Saved Jobs: Save, List, and Unsave
    const saveJobRes = await request('POST', `/api/saved-jobs/${firstJobId}`, null, studentToken);
    assert(saveJobRes.status === 201, 'POST /api/saved-jobs/:id saves job');

    const listSaved = await request('GET', '/api/saved-jobs', null, studentToken);
    assert(listSaved.status === 200 && listSaved.data.savedJobs.length > 0, 'GET /api/saved-jobs lists bookmarked jobs');

    const unsaveRes = await request('DELETE', `/api/saved-jobs/${firstJobId}`, null, studentToken);
    assert(unsaveRes.status === 200, 'DELETE /api/saved-jobs/:id removes bookmark');

    // 16. Admin Dashboard: Metrics and Analytics
    const adminDash = await request('GET', '/api/admin/dashboard', null, adminToken);
    assert(
      adminDash.status === 200 && adminDash.data.stats.totalUsers >= 5,
      `GET /api/admin/dashboard returns metrics (Users: ${adminDash.data?.stats?.totalUsers})`
    );

    // 17. Admin Users: User Management
    const adminUsers = await request('GET', '/api/admin/users', null, adminToken);
    assert(adminUsers.status === 200 && adminUsers.data.users.length > 0, 'GET /api/admin/users lists platform accounts');

    // 18. Admin Reports: Reports & Grievances
    const reports = await request('GET', '/api/admin/reports', null, adminToken);
    assert(reports.status === 200 && Array.isArray(reports.data.reports), 'GET /api/admin/reports returns platform complaints');

    console.log(`\n=================================================`);
    console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
    console.log(`=================================================`);

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDB();
    process.exit(failed === 0 ? 0 : 1);
  }
};

runTests();
