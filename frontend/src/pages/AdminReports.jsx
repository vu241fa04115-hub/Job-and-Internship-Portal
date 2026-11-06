import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { formatDate, timeAgo } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReports();
      if (res.success) {
        setReports(res.reports || []);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      setUpdatingId(reportId);
      const res = await adminService.updateReportStatus(reportId, { status: newStatus });
      if (res.success) {
        setReports(prev => prev.map(r => (r._id === reportId ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      alert('Failed to update report status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Reports & Complaints Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review user grievances, suspicious job postings, and terms-of-service violations.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading user reports..." />
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-sm text-navy-900">Zero Pending Complaints</h3>
          <p className="text-xs text-slate-500 mt-1">All user reports and grievances have been resolved.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <ShieldAlert className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-navy-900">{report.reason}</h3>
                    <p className="text-xs text-slate-400">
                      Reported by {report.reporterId?.name || 'User'} ({report.reporterId?.email}) • {timeAgo(report.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    report.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : report.status === 'resolved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {report.status}
                  </span>

                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                    disabled={updatingId === report._id}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>

              {/* Reported details */}
              <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed">
                <span className="font-bold text-navy-900 block mb-1">Complaint Details:</span>
                {report.details}
              </div>

              {/* Associated Job Link */}
              {report.jobId && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Reported Opportunity: <strong>{report.jobId?.title}</strong> ({report.jobId?.companyId?.name})
                  </span>
                  <Link
                    to={`/jobs/${report.jobId?._id}`}
                    target="_blank"
                    className="text-primary-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Posting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminReports;
