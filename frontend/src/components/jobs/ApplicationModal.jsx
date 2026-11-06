import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';

const ApplicationModal = ({ isOpen, onClose, job, onApplicationSuccess }) => {
  const { user } = useAuth();
  const [useProfileResume, setUseProfileResume] = useState(!!user?.resumeUrl);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF documents are allowed for resumes.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!useProfileResume && !selectedFile) {
      setError('Please select or upload a PDF resume.');
      return;
    }

    try {
      setLoading(true);
      let payload;

      if (useProfileResume) {
        payload = {
          resumeUrl: user.resumeUrl,
          coverLetter
        };
      } else {
        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('coverLetter', coverLetter);
        payload = formData;
      }

      const res = await applicationService.applyForJob(job._id, payload);
      if (res.success) {
        setSuccess(true);
        if (onApplicationSuccess) onApplicationSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit application.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setError('');
    setSuccess(false);
    setSelectedFile(null);
    setCoverLetter('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={success ? 'Application Submitted!' : `Apply for ${job.title}`}
      maxWidth="max-w-lg"
    >
      {success ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-in zoom-in-50 duration-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-navy-900">Application Received</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              Your application has been delivered to <strong>{job.companyId?.name}</strong>. The hiring team has been notified.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Position:</span>
              <span className="font-semibold text-navy-900">{job.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Initial Status:</span>
              <span className="font-semibold text-blue-600">Applied</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetAndClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <Link
              to="/student/applications"
              className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors"
            >
              Track in My Applications
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Job summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-navy-900">{job.title}</p>
              <p className="text-slate-500">{job.companyId?.name} • {job.location}</p>
            </div>
            <span className="font-semibold text-primary-600">{job.jobType}</span>
          </div>

          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Resume (PDF format) *
            </label>

            {user?.resumeUrl && (
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="resumeOption"
                    checked={useProfileResume}
                    onChange={() => {
                      setUseProfileResume(true);
                      setSelectedFile(null);
                      setError('');
                    }}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <FileText className="w-4 h-4 text-primary-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-navy-900">
                      Use saved profile resume
                    </p>
                    <p className="text-slate-400 text-[11px] truncate max-w-xs">
                      {user.resumeOriginalName || 'Alex_Rivera_Resume_2026.pdf'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                  <input
                    type="radio"
                    name="resumeOption"
                    checked={!useProfileResume}
                    onChange={() => setUseProfileResume(false)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">
                    Upload a different resume for this application
                  </span>
                </label>
              </div>
            )}

            {(!useProfileResume || !user?.resumeUrl) && (
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-primary-500 cursor-pointer bg-slate-50/50 hover:bg-primary-50/20 transition-all">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-navy-900">
                    {selectedFile ? selectedFile.name : 'Click to select PDF resume'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size: 5MB</p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Cover letter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Cover Letter / Note to Recruiter
              </label>
              <span className="text-[11px] text-slate-400">Optional</span>
            </div>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Highlight why you're a standout fit for this role, key projects, and availability..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetAndClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Application</span>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ApplicationModal;
