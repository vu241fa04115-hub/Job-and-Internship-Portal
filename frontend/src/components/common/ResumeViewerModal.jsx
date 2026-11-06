import React from 'react';
import Modal from './Modal';
import { ExternalLink, Download, FileText } from 'lucide-react';

const ResumeViewerModal = ({ isOpen, onClose, resumeUrl, applicantName }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${applicantName || 'Applicant'}'s Resume`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <span className="text-xs font-semibold text-slate-700">
              PDF Resume Viewer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-navy-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded Iframe */}
        <div className="w-full h-[600px] border border-slate-200 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
          <iframe
            src={resumeUrl}
            title="Resume Document"
            className="w-full h-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ResumeViewerModal;
