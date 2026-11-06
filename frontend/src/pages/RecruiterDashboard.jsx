import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { formatDate, timeAgo } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete Job modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getRecruiterJobs(),
        applicationService.getRecruiterApplicants()
      ]);

      if (jobsRes.success) setJobs(jobsRes.jobs || []);
      if (appsRes.success) setApplicants(appsRes.applications || []);
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      const res = await jobService.deleteJob(jobToDelete._id);
      if (res.success) {
        setJobs(prev => prev.filter(j => j._id !== jobToDelete._id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      const res = await jobService.updateJob(job._id, { status: newStatus });
      if (res.success) {
        setJobs(prev => prev.map(j => (j._id === job._id ? { ...j, status: newStatus } : j)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading recruiter dashboard & metrics..." />;
  }

  // Calculated Stats
  const totalJobsCount = jobs.length;
  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  const totalApplicantsCount = applicants.length;
  const interviewingCount = applicants.filter(a => ['Shortlisted', 'Interview'].includes(a.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Recruitment Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your open postings, track candidate pipelines, and review applicant resumes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/recruiter/jobs/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
          <Link
            to="/recruiter/company"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            Company Profile
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Postings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{totalJobsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Jobs & internships posted</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Listings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{activeJobsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Accepting applications</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{totalApplicantsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all positions</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interview Stage</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy-900 mt-2">{interviewingCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Shortlisted & interviewing</p>
        </div>

      </div>

      {/* Posted Jobs Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900">Your Job & Internship Postings</h2>
            <p className="text-xs text-slate-500 mt-0.5">View and manage active candidate pipelines</p>
          </div>
          <Link
            to="/recruiter/applicants"
            className="text-xs font-bold text-primary-600 hover:underline"
          >
            Review All Candidates ({totalApplicantsCount})
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-navy-900">No vacancies published yet</p>
            <p className="text-xs text-slate-500">Create your first job or internship listing to start receiving candidates.</p>
            <Link
              to="/recruiter/jobs/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Vacancy</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Opportunity</th>
                  <th className="px-6 py-3.5">Type & Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Applicants</th>
                  <th className="px-6 py-3.5">Deadline</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="font-bold text-navy-900 hover:text-primary-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">{job.location} • {job.workplaceType}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{job.jobType}</span>
                      <p className="text-[11px] text-slate-400">{job.category}</p>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title="Click to toggle active/closed"
                      >
                        {job.status === 'active' ? 'Active' : 'Closed'}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        className="inline-flex items-center gap-1.5 font-bold text-primary-600 hover:underline"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantCount || 0} candidates</span>
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(job.applicationDeadline)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/recruiter/applicants?jobId=${job._id}`}
                          className="p-1.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                          title="View Applicants"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="p-1.5 text-slate-500 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteModalOpen && (
        <ConfirmDialog
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Job Posting?"
          message={`Are you sure you want to delete "${jobToDelete?.title}"? All submitted applications for this listing will also be removed.`}
          confirmText="Yes, Delete Job"
          isDestructive={true}
          isLoading={deleting}
        />
      )}

    </div>
  );
};

export default RecruiterDashboard;
