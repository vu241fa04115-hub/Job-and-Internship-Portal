import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  Code2,
  BarChart3,
  Palette,
  Cloud,
  DollarSign
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { userService } from '../services/userService';
import JobCard from '../components/jobs/JobCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const POPULAR_CATEGORIES = [
  { name: 'Software Engineering', icon: Code2, count: '140+ Openings', color: 'from-blue-500/10 to-indigo-500/10 text-primary-600' },
  { name: 'Data Science & AI', icon: BarChart3, count: '65+ Openings', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600' },
  { name: 'UI/UX & Product Design', icon: Palette, count: '45+ Openings', color: 'from-purple-500/10 to-pink-500/10 text-purple-600' },
  { name: 'DevOps & Cloud', icon: Cloud, count: '50+ Openings', color: 'from-cyan-500/10 to-blue-500/10 text-cyan-600' },
  { name: 'Finance & FinTech', icon: DollarSign, count: '38+ Openings', color: 'from-amber-500/10 to-orange-500/10 text-amber-600' },
  { name: 'Product Management', icon: TrendingUp, count: '30+ Openings', color: 'from-rose-500/10 to-red-500/10 text-rose-600' }
];

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [stats, setStats] = useState({
    activeJobs: 120,
    activeInternships: 85,
    partnerCompanies: 45,
    totalApplications: 1450
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, internRes, statsRes] = await Promise.all([
          jobService.getJobs({ isInternship: 'false', limit: 4 }),
          jobService.getJobs({ isInternship: 'true', limit: 4 }),
          userService.getPublicStats().catch(() => ({ stats: null }))
        ]);

        if (jobsRes.success) setFeaturedJobs(jobsRes.jobs || []);
        if (internRes.success) setFeaturedInternships(internRes.jobs || []);
        if (statsRes && statsRes.stats) setStats(statsRes.stats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('search', searchTerm);
    if (location) queryParams.set('location', location);
    if (category) queryParams.set('category', category);
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-md text-primary-300">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            <span>Discover 500+ Verified Tech & Enterprise Openings</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Find Your Dream <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-indigo-300 to-cyan-300">
              Job or Internship
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            The premier platform for students, fresh graduates, and experienced engineers to connect directly with innovative startups and Fortune 500 employers.
          </p>

          {/* Search Box Card */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col md:flex-row gap-2.5 items-stretch text-slate-800"
            >
              {/* Job Title / Skill */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 md:bg-transparent rounded-xl">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title, keywords, or skills..."
                  className="w-full bg-transparent text-sm text-navy-950 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              <div className="hidden md:block w-px bg-slate-200 my-2" />

              {/* Location */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-slate-50 md:bg-transparent rounded-xl">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or 'Remote'..."
                  className="w-full bg-transparent text-sm text-navy-950 placeholder-slate-400 focus:outline-none font-medium"
                />
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="px-7 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl sm:rounded-2xl shadow-md shadow-primary-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
              >
                <Search className="w-4 h-4" />
                <span>Search Opportunities</span>
              </button>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular Searches:</span>
              {['Frontend', 'React', 'Python', 'Remote', 'Summer 2026', 'Data Science'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchTerm(tag);
                    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Metric Counter Cards */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-300 flex items-center justify-center mx-auto mb-2">
              <Briefcase className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-white">{stats.activeJobs}+</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Active Full-Time Jobs</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-white">{stats.activeInternships}+</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Active Internships</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-white">{stats.partnerCompanies}+</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Hiring Companies</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-white">{stats.totalApplications}+</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Applications Processed</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Popular Job Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Explore trending industry sectors hiring fresh and experienced talent</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy-900 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200 mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Full-Time Careers
            </div>
            <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Featured Job Openings</h2>
            <p className="text-xs text-slate-500 mt-1">Hand-picked engineering and corporate roles from verified employers</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-colors shadow-2xs"
          >
            <span>Browse All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading featured jobs..." />
        ) : featuredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            No featured jobs available currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Internships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary-900 via-indigo-900 to-navy-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 mb-2">
                <GraduationCap className="w-3.5 h-3.5 text-primary-300" />
                Students & Freshers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Top Internship Programs (Summer 2026)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
                Paid practical internships with direct return-offer paths for students and recent grads.
              </p>
            </div>
            <Link
              to="/internships"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-navy-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md shrink-0"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredInternships.map((internship) => (
              <JobCard key={internship._id} job={internship} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / Why Choose Portal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">How CareerHub Works</h2>
          <p className="text-xs text-slate-500 mt-1.5">
            A frictionless, transparent recruitment experience designed for both candidates and hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-lg">
              1
            </div>
            <h3 className="font-bold text-base text-navy-900">Build Your Profile</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your verified PDF resume, list your technical skills, projects, and education in minutes.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-lg">
              2
            </div>
            <h3 className="font-bold text-base text-navy-900">1-Click Fast Apply</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Filter by compensation, remote flexibility, or skills and submit direct applications with zero hassle.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-lg">
              3
            </div>
            <h3 className="font-bold text-base text-navy-900">Live Status Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No more black hole submissions. Receive live status alerts for Under Review, Shortlisted, and Interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Recruiter Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-navy-900">
              Hiring top interns or full-time engineers?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Reach thousands of pre-screened graduates and senior developers. Post your openings in minutes and manage your candidate pipeline in one dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/register?role=recruiter"
              className="px-5 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Post a Job Opening
            </Link>
            <Link
              to="/about"
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
