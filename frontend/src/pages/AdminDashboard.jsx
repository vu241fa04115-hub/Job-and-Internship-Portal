import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  GraduationCap,
  FileText,
  AlertTriangle,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { adminService } from '../services/adminService';
import { formatDate, timeAgo } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
const STATUS_COLORS = {
  Applied: '#3b82f6',
  'Under Review': '#f59e0b',
  Shortlisted: '#8b5cf6',
  Interview: '#6366f1',
  Selected: '#10b981',
  Rejected: '#ef4444'
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await adminService.getDashboardStats();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner text="Compiling administrator analytics..." />;
  }

  const { stats, charts, recentUsers, recentApplications } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Master Administration Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
            Portal Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics, user moderation, recruitment metrics, and platform health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/jobs"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            Moderate Listings
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors relative"
          >
            Reports
            {stats.pendingReports > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full">
                {stats.pendingReports}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Users</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">{stats.totalUsers}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Registered accounts</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Candidates</span>
          <p className="text-2xl font-extrabold text-primary-600 mt-1">{stats.totalStudents}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Job seekers & freshers</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Recruiters</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.totalRecruiters}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Hiring companies</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Jobs</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.totalJobs}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Full-time opportunities</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Internships</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-1">{stats.totalInternships}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Student programs</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Applications</span>
          <p className="text-2xl font-extrabold text-cyan-600 mt-1">{stats.totalApplications}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Processed total</p>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Applications Status Breakdown (Donut Chart) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-navy-900">Application Pipeline Distribution</h2>
            <span className="text-[11px] text-slate-400">By Status</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.applicationStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.applicationStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} applications`, name]}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Postings by Category (Bar Chart) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-navy-900">Job Postings by Category</h2>
            <span className="text-[11px] text-slate-400">Top Domains</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categories} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} postings`, 'Openings']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {charts.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tables: Recent Registrations & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Registrations */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-navy-900">Recent Registrations</h2>
            <Link to="/admin/users" className="text-xs text-primary-600 font-semibold hover:underline">
              View All Users
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div key={user._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-navy-900">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    user.role === 'recruiter' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {timeAgo(user.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-navy-900">Latest Applications Submitted</h2>
            <span className="text-[11px] text-slate-400">Live Activity</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentApplications.map((app) => (
              <div key={app._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-navy-900">
                    {app.applicantId?.name || 'Applicant'} applied for {app.jobId?.title || 'Job'}
                  </p>
                  <p className="text-[11px] text-slate-400">{app.companyId?.name || 'Company'}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {timeAgo(app.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
