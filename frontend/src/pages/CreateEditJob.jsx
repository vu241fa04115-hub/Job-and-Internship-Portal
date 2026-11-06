import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { jobService } from '../services/jobService';

const CATEGORIES = [
  'Software Engineering',
  'Data Science',
  'DevOps & Cloud',
  'Design',
  'Marketing',
  'Finance',
  'Product Management',
  'Sales & BD',
  'Other'
];

const CreateEditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dynamic Lists
  const [responsibilities, setResponsibilities] = useState(['']);
  const [requirements, setRequirements] = useState(['']);
  const [benefits, setBenefits] = useState(['']);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      jobType: 'Full-time',
      category: 'Software Engineering',
      location: 'Remote',
      workplaceType: 'Remote',
      experienceLevel: 'Entry Level / Fresher',
      salaryMin: '',
      salaryMax: '',
      salaryPeriod: 'yearly',
      stipendText: '',
      duration: '',
      openings: 1,
      applicationDeadline: '',
      eligibilityCriteria: '',
      description: '',
      requiredSkills: '',
      status: 'active',
      featured: false
    }
  });

  const selectedJobType = watch('jobType');

  useEffect(() => {
    if (isEditing) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await jobService.getJobById(id);
          if (res.success && res.job) {
            const j = res.job;
            reset({
              title: j.title || '',
              jobType: j.jobType || 'Full-time',
              category: j.category || 'Software Engineering',
              location: j.location || '',
              workplaceType: j.workplaceType || 'Remote',
              experienceLevel: j.experienceLevel || 'Entry Level / Fresher',
              salaryMin: j.salaryRange?.min || '',
              salaryMax: j.salaryRange?.max || '',
              salaryPeriod: j.salaryRange?.period || 'yearly',
              stipendText: j.stipendText || '',
              duration: j.duration || '',
              openings: j.openings || 1,
              applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '',
              eligibilityCriteria: j.eligibilityCriteria || '',
              description: j.description || '',
              requiredSkills: j.requiredSkills ? j.requiredSkills.join(', ') : '',
              status: j.status || 'active',
              featured: j.featured || false
            });

            if (j.responsibilities && j.responsibilities.length > 0) {
              setResponsibilities(j.responsibilities);
            }
            if (j.requirements && j.requirements.length > 0) {
              setRequirements(j.requirements);
            }
            if (j.benefits && j.benefits.length > 0) {
              setBenefits(j.benefits);
            }
          }
        } catch (err) {
          setErrorMsg('Failed to load existing job details.');
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    } else {
      // Set default deadline 30 days ahead
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setValue('applicationDeadline', nextMonth);
    }
  }, [id, isEditing, reset, setValue]);

  // Dynamic Array Handlers
  const handleListChange = (list, setList, index, val) => {
    const updated = [...list];
    updated[index] = val;
    setList(updated);
  };

  const handleAddListItem = (list, setList) => {
    setList([...list, '']);
  };

  const handleRemoveListItem = (list, setList, index) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setErrorMsg('');

      const payload = {
        title: data.title,
        jobType: data.jobType,
        category: data.category,
        location: data.location,
        workplaceType: data.workplaceType,
        experienceLevel: data.experienceLevel,
        salaryRange: {
          min: data.salaryMin ? Number(data.salaryMin) : 0,
          max: data.salaryMax ? Number(data.salaryMax) : 0,
          period: data.salaryPeriod,
          currency: 'USD'
        },
        stipendText: data.stipendText,
        duration: data.duration,
        openings: Number(data.openings) || 1,
        applicationDeadline: data.applicationDeadline,
        eligibilityCriteria: data.eligibilityCriteria,
        description: data.description,
        requiredSkills: data.requiredSkills ? data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
        responsibilities: responsibilities.filter(r => r.trim().length > 0),
        requirements: requirements.filter(r => r.trim().length > 0),
        benefits: benefits.filter(b => b.trim().length > 0),
        status: data.status,
        featured: data.featured
      };

      if (isEditing) {
        await jobService.updateJob(id, payload);
      } else {
        await jobService.createJob(payload);
      }

      navigate('/recruiter/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading opportunity..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/recruiter/dashboard"
          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            {isEditing ? 'Edit Job Posting' : 'Post a New Opportunity'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create an attractive opening for students, interns, or experienced professionals.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3">
            Primary Opportunity Details
          </h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Job / Internship Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Job title is required' })}
                placeholder="e.g. Junior Frontend Software Engineer"
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
              {errors.title && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Employment Type *
                </label>
                <select
                  {...register('jobType')}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Experience Level
                </label>
                <select
                  {...register('experienceLevel')}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
                >
                  <option value="Entry Level / Fresher">Entry Level / Fresher</option>
                  <option value="Internship">Internship</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Location (City or Region) *
                </label>
                <input
                  type="text"
                  {...register('location', { required: 'Location is required' })}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Workplace Type
                </label>
                <select
                  {...register('workplaceType')}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Compensation & Timeline Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3">
            Compensation & Timeline
          </h2>

          <div className="space-y-4 pt-1">
            {selectedJobType === 'Internship' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Stipend Description
                  </label>
                  <input
                    type="text"
                    {...register('stipendText')}
                    placeholder="e.g. $5,000 / month or $25 / hour"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Internship Duration
                  </label>
                  <input
                    type="text"
                    {...register('duration')}
                    placeholder="e.g. 12 Weeks (Summer 2026)"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Min Base Salary ($)
                  </label>
                  <input
                    type="number"
                    {...register('salaryMin')}
                    placeholder="90000"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Max Base Salary ($)
                  </label>
                  <input
                    type="number"
                    {...register('salaryMax')}
                    placeholder="120000"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Period
                  </label>
                  <select
                    {...register('salaryPeriod')}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
                  >
                    <option value="yearly">Per Year</option>
                    <option value="monthly">Per Month</option>
                    <option value="hourly">Per Hour</option>
                  </select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Available Openings *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('openings', { required: true, min: 1 })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  {...register('applicationDeadline', { required: 'Application deadline is required' })}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Eligibility Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3">
            Description & Criteria
          </h2>

          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Role Description *
              </label>
              <textarea
                rows={5}
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe team mission, key projects, and organizational impact..."
                className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Eligibility Criteria (e.g. Graduation year, major, GPA)
              </label>
              <textarea
                rows={2}
                {...register('eligibilityCriteria')}
                placeholder="e.g. Degree students in Computer Science graduating between Dec 2026 - June 2028..."
                className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Required Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                {...register('requiredSkills')}
                placeholder="React, Node.js, TypeScript, Docker, SQL"
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Responsibilities & Requirements Lists Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          
          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Key Responsibilities
              </label>
              <button
                type="button"
                onClick={() => handleAddListItem(responsibilities, setResponsibilities)}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={resp}
                    onChange={(e) => handleListChange(responsibilities, setResponsibilities, i, e.target.value)}
                    placeholder="e.g. Architect scalable React components and design system tokens"
                    className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(responsibilities, setResponsibilities, i)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Qualifications & Requirements
              </label>
              <button
                type="button"
                onClick={() => handleAddListItem(requirements, setRequirements)}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleListChange(requirements, setRequirements, i, e.target.value)}
                    placeholder="e.g. Proficiency in modern JavaScript ES6+ and state management"
                    className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveListItem(requirements, setRequirements, i)}
                      className="p-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/recruiter/dashboard"
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Publish Opportunity'}</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default CreateEditJob;
