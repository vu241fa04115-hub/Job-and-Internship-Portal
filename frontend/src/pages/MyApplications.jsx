import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { StatusBadge } from '../components/common/Badge';
import { formatDate, timeAgo, formatSalary } from '../utils/formatters';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const STATUS_TABS = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Withdraw state
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedAppToWithdraw, setSelectedAppToWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getMyApplications({
        status: selectedStatus === 'All' ? undefined : selectedStatus
      });
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleWithdrawConfirm = async () => {
    if (!selectedAppToWithdraw) return;

    try {
      setWithdrawing(true);
      const res = await applicationService.withdrawApplication(selectedAppToWithdraw._id);
      if (res.success) {
        setActionSuccess('Application withdrawn successfully.');
        setApplications(prev =>
          prev.map(app => (app._id === selectedAppToWithdraw._id ? { ...app, status: 'Withdrawn' } : app))
        );
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawing(false);
      setWithdrawModalOpen(false);
      setSelectedAppToWithdraw(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          My Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your application lifecycle, recruiter feedback, and interview schedules.
        </p>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedStatus === tab
                ? 'bg-navy-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <LoadingSpinner text="Fetching your submitted applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications in this category"
          description="You haven't submitted any applications under this status filter yet."
          actionText="Browse Open Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.jobId || {};
            const company = job.companyId || {};
            const isExpanded = expandedId === app._id;
            const canWithdraw = ['Applied', 'Under Review'].includes(app.status);

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* Main Card Header */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>

                    <div className="space-y-1">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="font-bold text-base text-navy-900 hover:text-primary-600 transition-colors line-clamp-1"
                      >
                        {job.title || 'Opportunity'}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{company.name}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{formatSalary(job.salaryRange, job.stipendText, job.jobType)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Submitted on {formatDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                    <StatusBadge status={app.status} />

                    {canWithdraw && (
                      <button
                        onClick={() => {
                          setSelectedAppToWithdraw(app);
                          setWithdrawModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors"
                      >
                        Withdraw
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(app._id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      <span>Timeline</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Timeline & Cover Letter */}
                {isExpanded && (
                  <div className="bg-slate-50/80 border-t border-slate-100 p-6 space-y-6 animate-in fade-in duration-150">
                    
                    {/* Status History Timeline */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Status History Timeline
                      </h4>

                      <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-7">
                        {app.statusHistory && app.statusHistory.length > 0 ? (
                          app.statusHistory.map((step, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -left-7 top-1.5 w-2 h-2 rounded-full bg-primary-600 ring-4 ring-white" />
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="font-bold text-xs text-navy-900">
                                  {step.status}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatDate(step.changedAt)}
                                </span>
                              </div>
                              {step.note && (
                                <p className="text-xs text-slate-600 mt-0.5">{step.note}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No history notes available.</p>
                        )}
                      </div>
                    </div>

                    {/* Cover Letter Section */}
                    {app.coverLetter && (
                      <div className="border-t border-slate-200/60 pt-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Cover Letter Submitted
                        </h4>
                        <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed">
                          {app.coverLetter}
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for Withdrawing Application */}
      {withdrawModalOpen && (
        <ConfirmDialog
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          onConfirm={handleWithdrawConfirm}
          title="Withdraw Application?"
          message={`Are you sure you want to withdraw your application for "${selectedAppToWithdraw?.jobId?.title}"? This cannot be undone.`}
          confirmText="Yes, Withdraw"
          isDestructive={true}
          isLoading={withdrawing}
        />
      )}

    </div>
  );
};

export default MyApplications;
