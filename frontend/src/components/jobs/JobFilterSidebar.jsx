import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Engineering',
  'Data Science',
  'DevOps & Cloud',
  'Design',
  'Marketing',
  'Finance',
  'Product Management'
];

const JOB_TYPES = [
  'All',
  'Full-time',
  'Internship',
  'Part-time',
  'Contract'
];

const WORKPLACE_TYPES = [
  'All',
  'Remote',
  'Hybrid',
  'On-site'
];

const EXPERIENCE_LEVELS = [
  'All',
  'Entry Level / Fresher',
  'Mid Level',
  'Senior Level',
  'Internship'
];

const JobFilterSidebar = ({ filters, onFilterChange, onReset, isInternshipPage = false }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-bold text-sm text-navy-900">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Category
        </label>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = (!filters.category && cat === 'All') || filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange('category', cat === 'All' ? '' : cat)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Job Type (if not already strictly internship page) */}
      {!isInternshipPage && (
        <div className="border-t border-slate-100 pt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Employment Type
          </label>
          <div className="space-y-1.5">
            {JOB_TYPES.map((type) => {
              const isSelected = (!filters.jobType && type === 'All') || filters.jobType === type;
              return (
                <button
                  key={type}
                  onClick={() => onFilterChange('jobType', type === 'All' ? '' : type)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-primary-50 text-primary-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Workplace Environment */}
      <div className="border-t border-slate-100 pt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Workplace
        </label>
        <div className="space-y-1.5">
          {WORKPLACE_TYPES.map((wp) => {
            const isSelected = (!filters.workplaceType && wp === 'All') || filters.workplaceType === wp;
            return (
              <button
                key={wp}
                onClick={() => onFilterChange('workplaceType', wp === 'All' ? '' : wp)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                {wp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="border-t border-slate-100 pt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Experience Level
        </label>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((exp) => {
            const isSelected = (!filters.experienceLevel && exp === 'All') || filters.experienceLevel === exp;
            return (
              <button
                key={exp}
                onClick={() => onFilterChange('experienceLevel', exp === 'All' ? '' : exp)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                {exp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimum Base Salary */}
      <div className="border-t border-slate-100 pt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Min Annual Salary
        </label>
        <select
          value={filters.minSalary || ''}
          onChange={(e) => onFilterChange('minSalary', e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-primary-500"
        >
          <option value="">Any compensation</option>
          <option value="50000">$50,000+ / year</option>
          <option value="75000">$75,000+ / year</option>
          <option value="100000">$100,000+ / year</option>
          <option value="120000">$120,000+ / year</option>
        </select>
      </div>
    </div>
  );
};

export default JobFilterSidebar;
