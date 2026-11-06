import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  FileText,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import { StatusBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ResumeViewerModal from '../components/common/ResumeViewerModal';
import { formatDate, timeAgo } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const STATUS_OPTIONS = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

const ManageApplicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Candidate Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState('');

  // Resume Modal State
  const [viewResumeOpen, setViewResumeOpen] = useState(false);

  useEffect(() => {
    const fetchJobsList = async () => {
      try {
        const res = await jobService.getRecruiterJobs();
        if (res.success) {
          setJobs(res.jobs || []);
        }
      } catch (err) {
        console.error('Failed to load jobs list:', err);
      }
    };
    fetchJobsList();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedJobId) params.jobId = selectedJobId;
      if (selectedStatus && selectedStatus !== 'All') params.status = selectedStatus;
      if (searchTerm) params.search = searchTerm;

      const res = await applicationService.getRecruiterApplicants(params);
      if (res.success) {
        setApplicants(res.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [selectedJobId, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplicants();
  };

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setStatusNote(app.recruiterNotes || '');
    setStatusSuccess('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdatingStatus(true);
      setStatusSuccess('');
      const res = await applicationService.updateApplicationStatus(selectedApp._id, {
        status: newStatus,
        note: statusNote
      });

      if (res.success) {
        setStatusSuccess(`Status updated to ${newStatus}. Candidate was notified.`);
        // Update local list
        setApplicants(prev =>
          prev.map(a => (a._id === selectedApp._id ? { ...a, status: newStatus, recruiterNotes: statusNote } : a))
        );
        setSelectedApp(prev => ({ ...prev, status: newStatus, recruiterNotes: statusNote }));
        setTimeout(() => setStatusSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const candidate = selectedApp?.applicantId || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Applicant Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review candidate resumes, evaluate academic credentials, and advance applicants through your hiring funnel.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Select Job Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filter by Opportunity
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
            >
              <option value="">All Job & Internship Postings</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.applicantCount || 0} applicants)
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Search Candidates
            </label>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Candidate name, email, or skill keywords..."
                  className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-navy-900 text-white font-bold text-xs rounded-xl shadow-2xs hover:bg-navy-800"
              >
                Search
              </button>
            </form>
          </div>

        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === status
                  ? 'bg-navy-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applicant Count & Listing */}
      {loading ? (
        <LoadingSpinner text="Fetching candidate applications..." />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates match your filters"
          description="Try selecting a different job opening or clearing your status filter."
          actionText="View All Candidates"
          onAction={() => {
            setSelectedJobId('');
            setSelectedStatus('All');
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applicants.map((app) => {
            const cand = app.applicantId || {};
            const job = app.jobId || {};

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-2xs">
                        {cand.name ? cand.name.charAt(0) : 'C'}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-navy-900">{cand.name || 'Candidate'}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{cand.headline || cand.email}</p>
                      </div>
                    </div>

                    <StatusBadge status={app.status} />
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs mt-3.5 space-y-1">
                    <p className="font-bold text-navy-900 truncate">
                      Applied for: {job.title}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Submitted {timeAgo(app.appliedAt)}
                    </p>
                  </div>

                  {cand.skills && cand.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {cand.skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{cand.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                    {cand.location || cand.email}
                  </span>
                  
                  <button
                    onClick={() => handleOpenReview(app)}
                    className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                  >
                    Review Candidate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Candidate Modal */}
      {selectedApp && (
        <Modal
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          title={`Candidate Review: ${candidate.name || 'Applicant'}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            
            {statusSuccess && (
              <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{statusSuccess}</span>
              </div>
            )}

            {/* Candidate Summary */}
            <div className="flex items-start justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white font-bold text-base flex items-center justify-center shrink-0 uppercase">
                  {candidate.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-900">{candidate.name}</h4>
                  <p className="text-xs text-slate-500">{candidate.headline || 'Job Seeker'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{candidate.email} • {candidate.phone || 'No phone'}</p>
                </div>
              </div>

              {selectedApp.resumeUrl && (
                <button
                  type="button"
                  onClick={() => setViewResumeOpen(true)}
                  className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Resume</span>
                </button>
              )}
            </div>

            {/* Academic & Experience Details */}
            {candidate.education && candidate.education.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Education</h5>
                <div className="space-y-1.5">
                  {candidate.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl text-xs">
                      <p className="font-bold text-navy-900">{edu.degree} — {edu.institution}</p>
                      <p className="text-slate-500 text-[11px]">{edu.startYear} - {edu.endYear} {edu.grade ? `• ${edu.grade}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Verified Skills</h5>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {selectedApp.coverLetter && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Candidate Cover Letter</h5>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedApp.coverLetter}
                </p>
              </div>
            )}

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 bg-primary-50/40 rounded-2xl border border-primary-100 space-y-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-primary-900">
                Update Candidate Status
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Note / Reason</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Invited to technical screen"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingStatus}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Save Status & Notify Candidate</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </Modal>
      )}

      {/* Resume Viewer */}
      {viewResumeOpen && selectedApp?.resumeUrl && (
        <ResumeViewerModal
          isOpen={viewResumeOpen}
          onClose={() => setViewResumeOpen(false)}
          resumeUrl={selectedApp.resumeUrl}
          applicantName={candidate.name}
        />
      )}

    </div>
  );
};

export default ManageApplicants;
