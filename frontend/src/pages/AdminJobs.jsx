import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Flag,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { jobService } from '../services/jobService';
import { formatDate } from '../utils/formatters';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchTerm || undefined
      };

      const res = await adminService.getAdminJobs(params);
      if (res.success) {
        setJobs(res.jobs || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await adminService.updateJobStatus(jobId, newStatus);
      if (res.success) {
        setJobs(prev => prev.map(j => (j._id === jobId ? { ...j, status: newStatus } : j)));
        setSuccessMsg(`Job status updated to ${newStatus}.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      const res = await jobService.deleteJob(jobToDelete._id);
      if (res.success) {
        setJobs(prev => prev.filter(j => j._id !== jobToDelete._id));
        setSuccessMsg('Job posting removed.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job.');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Job & Internship Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, approve, flag, or remove inappropriate listings across the entire portal ({totalCount} total).
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search postings by title or category..."
                className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-navy-800 shadow-2xs"
            >
              Search
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800 w-full md:w-auto"
          >
            <option value="All">All Moderation Statuses</option>
            <option value="active">Active</option>
            <option value="flagged">Flagged</option>
            <option value="closed">Closed</option>
          </select>

        </div>
      </div>

      {/* Postings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching job postings..." />
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No job postings found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Opportunity</th>
                  <th className="px-6 py-3.5">Company / Recruiter</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Posted</th>
                  <th className="px-6 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/jobs/${job._id}`}
                        target="_blank"
                        className="font-bold text-navy-900 hover:text-primary-600 flex items-center gap-1.5"
                      >
                        <span>{job.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-0.5">{job.category} • {job.location}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{job.companyId?.name || 'Company'}</p>
                      <p className="text-[11px] text-slate-400">{job.recruiterId?.email}</p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {job.jobType}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        job.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : job.status === 'flagged'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(job.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {job.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'active')}
                            className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            title="Approve / Activate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {job.status !== 'flagged' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'flagged')}
                            className="p-1.5 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50"
                            title="Flag Listing"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        )}
                        {job.status !== 'closed' && (
                          <button
                            onClick={() => handleUpdateStatus(job._id, 'closed')}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                            title="Close Listing"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setJobToDelete(job);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Permanently Remove"
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

        <div className="p-4 border-t border-slate-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteModalOpen && (
        <ConfirmDialog
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Remove Job Posting?"
          message={`Are you sure you want to permanently delete "${jobToDelete?.title}" from the platform?`}
          confirmText="Yes, Remove"
          isDestructive={true}
          isLoading={deleting}
        />
      )}

    </div>
  );
};

export default AdminJobs;
