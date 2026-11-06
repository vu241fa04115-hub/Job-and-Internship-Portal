import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Flag,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { userService } from '../services/userService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { formatSalary, formatDate, timeAgo } from '../utils/formatters';
import { JobTypeBadge, WorkplaceBadge } from '../components/common/Badge';
import ApplicationModal from '../components/jobs/ApplicationModal';
import Modal from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  
  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Spam or misleading');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await jobService.getJobById(id);
        if (res.success && res.job) {
          setJob(res.job);
          setIsSaved(res.job.isSaved || false);
          setHasApplied(res.job.hasApplied || false);
          setSimilarJobs(res.similarJobs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Opportunity not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) return;

    try {
      if (isSaved) {
        await userService.unsaveJob(job._id);
        setIsSaved(false);
      } else {
        await userService.saveJob(job._id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to bookmark job:', err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setReportSubmitting(true);
      await adminService.createReport({
        jobId: job._id,
        reason: reportReason,
        details: reportDetails
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportModalOpen(false);
        setReportDetails('');
      }, 3000);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isStudent) {
      alert('Recruiters and admins cannot apply for opportunities. Please sign in as a student.');
      return;
    }
    setApplyModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading opportunity details..." />;
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Opportunity Not Available</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'This job posting may have expired or been removed.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-navy-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Jobs</span>
        </Link>
      </div>
    );
  }

  const company = job.companyId || {};
  const isExpired = new Date(job.applicationDeadline) < new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-navy-900">Home</Link>
        <span>/</span>
        <Link to={job.jobType === 'Internship' ? '/internships' : '/jobs'} className="hover:text-navy-900">
          {job.jobType === 'Internship' ? 'Internships' : 'Jobs'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{job.title}</span>
      </nav>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-9 h-9 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <JobTypeBadge type={job.jobType} />
                <WorkplaceBadge type={job.workplaceType || 'Remote'} />
                {job.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium pt-0.5">
                <span className="text-primary-700 font-bold">{company.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Posted {timeAgo(job.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isStudent && (
              <button
                onClick={handleBookmark}
                className={`p-3 rounded-2xl border transition-colors flex items-center gap-2 text-xs font-semibold ${
                  isSaved
                    ? 'bg-primary-50 border-primary-200 text-primary-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}

            {hasApplied ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Applied ({job.applicationStatus || 'In Review'})</span>
              </div>
            ) : isExpired ? (
              <div className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold border border-slate-200">
                Application Closed
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-7 py-3 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-2xl shadow-md shadow-primary-600/30 hover:shadow-lg transition-all"
              >
                Apply for Position
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Grid: Details on Left (2/3), Company & Key Facts on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Job Details) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-navy-900 border-b border-slate-100 pb-3 mb-4">
                About the Opportunity
              </h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Eligibility Criteria */}
            {job.eligibilityCriteria && (
              <div>
                <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                  Eligibility Criteria
                </h3>
                <div className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {job.eligibilityCriteria}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-900 mb-3">Qualifications & Requirements</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills Chips */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-900 mb-3">Required Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-navy-900 mb-3">Benefits & Perks</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {job.benefits.map((b, i) => (
                    <li key={i} className="leading-relaxed">{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Report Job Button */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Posting ID: {job._id}</span>
              <button
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report this listing</span>
              </button>
            </div>
          </div>

          {/* Similar Opportunities */}
          {similarJobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-navy-900">Similar Opportunities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarJobs.map((sim) => (
                  <Link
                    key={sim._id}
                    to={`/jobs/${sim._id}`}
                    className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all group block"
                  >
                    <p className="font-bold text-xs text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {sim.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">{sim.companyId?.name}</p>
                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <span className="font-semibold text-primary-600">{sim.jobType}</span>
                      <span className="text-slate-400">{sim.location}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Key Facts & Company Profile) */}
        <div className="space-y-6">
          
          {/* Key Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-100">
              Overview & Specifications
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  Compensation
                </span>
                <span className="font-bold text-navy-900 text-right">
                  {formatSalary(job.salaryRange, job.stipendText, job.jobType)}
                </span>
              </div>

              {job.duration && (
                <div className="flex items-start justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Duration
                  </span>
                  <span className="font-semibold text-navy-900">{job.duration}</span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  Job Category
                </span>
                <span className="font-semibold text-navy-900">{job.category}</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  Total Openings
                </span>
                <span className="font-semibold text-navy-900">{job.openings} positions</span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Apply Deadline
                </span>
                <span className="font-semibold text-navy-900">{formatDate(job.applicationDeadline)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleApplyClick}
                disabled={hasApplied || isExpired}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                {hasApplied ? 'Application Submitted' : isExpired ? 'Closed' : 'Apply Now'}
              </button>
            </div>
          </div>

          {/* Company Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-sm text-navy-900 pb-2 border-b border-slate-100">
              About {company.name}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {company.description || 'Verified enterprise hiring partner on CareerHub portal.'}
            </p>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              {company.industry && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Industry:</span>
                  <span className="font-semibold text-navy-900">{company.industry}</span>
                </div>
              )}
              {company.size && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Company Size:</span>
                  <span className="font-semibold text-navy-900">{company.size}</span>
                </div>
              )}
              {company.website && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Website:</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <span>Visit site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <ApplicationModal
          isOpen={applyModalOpen}
          onClose={() => setApplyModalOpen(false)}
          job={job}
          onApplicationSuccess={() => setHasApplied(true)}
        />
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Report this Job Posting"
          maxWidth="max-w-md"
        >
          {reportSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-sm text-navy-900">Report Submitted</p>
              <p className="text-xs text-slate-500">
                Our trust & safety team has logged your complaint and will investigate immediately.
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Reason for Report
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-primary-500"
                >
                  <option value="Spam or misleading">Spam or misleading</option>
                  <option value="Fraudulent opportunity">Fraudulent opportunity</option>
                  <option value="Discriminatory content">Discriminatory content</option>
                  <option value="Expired or duplicate">Expired or duplicate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please describe why this posting violates community guidelines..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

    </div>
  );
};

export default JobDetails;
