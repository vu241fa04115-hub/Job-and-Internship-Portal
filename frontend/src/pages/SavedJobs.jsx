import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, Trash2, ArrowRight, MapPin } from 'lucide-react';
import { userService } from '../services/userService';
import { JobTypeBadge, WorkplaceBadge } from '../components/common/Badge';
import { formatSalary, formatDate } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await userService.getSavedJobs();
      if (res.success) {
        setSavedJobs(res.savedJobs || []);
      }
    } catch (err) {
      console.error('Failed to load saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await userService.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(item => item.job._id !== jobId));
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Saved Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and submit applications for the roles you've bookmarked.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading saved opportunities..." />
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Click the bookmark icon on any job or internship card to save it for quick access."
          actionText="Explore Open Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((item) => {
            const job = item.job;
            const company = job?.companyId || {};

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-bold text-sm text-navy-900 hover:text-primary-600 transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{company.name} • {job.category}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(job._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <JobTypeBadge type={job.jobType} />
                    <WorkplaceBadge type={job.workplaceType || 'Remote'} />
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-navy-900">
                      {formatSalary(job.salaryRange, job.stipendText, job.jobType)}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default SavedJobs;
