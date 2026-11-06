import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, GraduationCap, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { jobService } from '../services/jobService';
import JobCard from '../components/jobs/JobCard';
import JobFilterSidebar from '../components/jobs/JobFilterSidebar';
import Pagination from '../components/common/Pagination';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const InternshipListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    workplaceType: searchParams.get('workplaceType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    minSalary: searchParams.get('minSalary') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        isInternship: 'true',
        page: filters.page,
        limit: 8,
        sort: filters.sort
      };

      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.category) params.category = filters.category;
      if (filters.workplaceType) params.workplaceType = filters.workplaceType;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;

      const res = await jobService.getJobs(params);
      if (res.success) {
        setInternships(res.jobs || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInternships();

    const newParams = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'newest' && !(key === 'page' && val === 1)) {
        newParams[key] = val;
      }
    });
    setSearchParams(newParams);
  }, [filters, fetchInternships, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      category: '',
      workplaceType: '',
      experienceLevel: '',
      minSalary: '',
      sort: 'newest',
      page: 1
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([k, v]) => v && k !== 'page' && k !== 'sort'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur text-purple-200 mb-3 border border-white/10">
            <GraduationCap className="w-3.5 h-3.5 text-purple-300" />
            <span>Student & Graduate Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Summer & Fall 2026 Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Browse {totalCount} verified paid internships with mentorship, stipends, and full-time conversion pathways.
          </p>

          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 text-slate-800">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Internship title, track, or skills..."
                className="w-full text-xs font-medium placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-2.5 bg-white rounded-xl px-3.5 py-2.5 text-slate-800">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Location or 'Remote'..."
                className="w-full text-xs font-medium placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-20">
          <JobFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            isInternshipPage={true}
          />
        </aside>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>
              <p className="text-xs text-slate-500">
                Showing <strong className="text-navy-900">{internships.length}</strong> of{' '}
                <strong className="text-navy-900">{totalCount}</strong> internships
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-none focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Application Deadline</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Active filters:</span>
              {filters.category && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                  Category: {filters.category}
                  <button onClick={() => handleFilterChange('category', '')}>
                    <X className="w-3 h-3 hover:text-navy-900" />
                  </button>
                </span>
              )}
              {filters.workplaceType && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                  Workplace: {filters.workplaceType}
                  <button onClick={() => handleFilterChange('workplaceType', '')}>
                    <X className="w-3 h-3 hover:text-navy-900" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-purple-600 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Internship Cards Grid */}
          {loading ? (
            <LoadingSpinner text="Searching internships..." />
          ) : internships.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No internships found matching your criteria"
              description="Try adjusting your keywords or clearing selected filters to see other student opportunities."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internships.map((internship) => (
                <JobCard key={internship._id} job={internship} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative min-h-full flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-navy-900 text-sm">Filter Internships</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <JobFilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                isInternshipPage={true}
              />
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InternshipListings;
