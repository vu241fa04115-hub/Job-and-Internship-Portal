import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationService } from '../services/applicationService';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { StatusBadge } from '../components/common/Badge';
import { formatDate, timeAgo } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appsRes, savedRes, recJobsRes] = await Promise.all([
          applicationService.getMyApplications(),
          userService.getSavedJobs(),
          jobService.getJobs({ limit: 4 })
        ]);

        if (appsRes.success) setApplications(appsRes.applications || []);
        if (savedRes.success) setSavedJobsCount(savedRes.count || 0);
        if (recJobsRes.success) setRecommendedJobs(recJobsRes.jobs || []);
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading candidate dashboard..." />;
  }

  // Calculate metrics
  const totalApps = applications.length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;

  // Profile completeness percentage
  let completeness = 40;
  if (user?.headline) completeness += 15;
  if (user?.resumeUrl) completeness += 20;
  if (user?.skills && user.skills.length > 0) completeness += 15;
  if (user?.education && user.education.length > 0) completeness += 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Hello, {user?.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your applications, interview invites, and recommended opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/jobs"
            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            Find Opportunities
          </Link>
          <Link
            to="/student/profile"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Completeness Alert (if < 100%) */}
      {completeness < 100 && (
        <div className="bg-gradient-to-r from-primary-900 to-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-sm">
              Your profile is {completeness}% complete
            </h3>
            <p className="text-xs text-primary-200">
              Profiles with uploaded PDF resumes and skills receive 4x more recruiter responses!
            </p>
          </div>
          <Link
            to="/student/profile"
            className="px-4 py-2 bg-white text-navy-900 font-bold text-xs rounded-xl hover:bg-primary-50 transition-colors shrink-0"
          >
            Complete Profile Now
          </Link>
        </div>
      )}

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applied</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{totalApps}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all opportunities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Under Review</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{underReviewCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active recruiter screens</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviews</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{interviewCount + shortlistedCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Interviews & shortlists</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Saved Jobs</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{savedJobsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Bookmarked roles</p>
        </div>

      </div>

      {/* Grid: Recent Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Recent Applications) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Recent Applications</h2>
            <Link
              to="/student/applications"
              className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
            >
              <span>View all ({totalApps})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            {applications.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-navy-900">No applications yet</p>
                <p className="text-[11px] text-slate-500 mt-1 mb-4">Start applying to open tech roles</p>
                <Link
                  to="/jobs"
                  className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl"
                >
                  Explore Jobs
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <Link
                          to={`/jobs/${app.jobId?._id}`}
                          className="font-bold text-xs sm:text-sm text-navy-900 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {app.jobId?.title || 'Position'}
                        </Link>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {app.jobId?.companyId?.name || 'Company'} • Applied {timeAgo(app.appliedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Recommended For You) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span>Recommended Jobs</span>
            </h2>
            <Link to="/jobs" className="text-xs text-primary-600 hover:underline font-semibold">
              See more
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all block group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {job.companyId?.name} • {job.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md shrink-0">
                    {job.jobType}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  <span className="font-medium text-navy-900">
                    {job.salaryRange?.min ? `$${job.salaryRange.min.toLocaleString()}+` : 'Competitive'}
                  </span>
                  <span>{timeAgo(job.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
