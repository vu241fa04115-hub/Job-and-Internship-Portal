import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Clock,
  Bookmark,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatSalary, timeAgo, formatDate } from '../../utils/formatters';
import { JobTypeBadge, WorkplaceBadge } from '../common/Badge';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const JobCard = ({ job, onBookmarkToggle }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isStudent) return;

    try {
      setSaving(true);
      if (isSaved) {
        await userService.unsaveJob(job._id);
        setIsSaved(false);
      } else {
        await userService.saveJob(job._id);
        setIsSaved(true);
      }
      if (onBookmarkToggle) onBookmarkToggle(job._id, !isSaved);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  const company = job.companyId || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 transition-card relative flex flex-col justify-between group">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Company Logo / Placeholder */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div>
              <Link
                to={`/jobs/${job._id}`}
                className="font-bold text-base text-navy-900 group-hover:text-primary-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {company.name || 'Confidential Company'} • {job.category}
              </p>
            </div>
          </div>

          {/* Bookmark Button (Students only) */}
          {(!isAuthenticated || isStudent) && (
            <button
              onClick={handleBookmark}
              disabled={saving}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-primary-50 border-primary-200 text-primary-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-navy-900 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove bookmark' : 'Save job'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <JobTypeBadge type={job.jobType} />
          <WorkplaceBadge type={job.workplaceType || 'Remote'} />
          {job.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Featured
            </span>
          )}
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            {job.experienceLevel}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Tags */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {job.requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] font-medium text-slate-400 self-center">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-navy-900">
            {formatSalary(job.salaryRange, job.stipendText, job.jobType)}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {job.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {timeAgo(job.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {job.hasApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          ) : (
            <Link
              to={`/jobs/${job._id}`}
              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
