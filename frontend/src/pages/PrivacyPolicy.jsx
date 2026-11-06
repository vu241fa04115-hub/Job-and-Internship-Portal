import React from 'react';
import { ShieldCheck, Lock, Eye, FileCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight">
          Privacy Policy & Candidate Data Protection
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective date: October 2026 • Last updated: Current Version
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-2xs">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Information We Collect</h2>
          <p>
            CareerHub collects personal data that candidates provide voluntarily, including full name, verified email address, telephone contact, educational credentials, work histories, technical competencies, and PDF resume documents. For recruiters, we collect company branding assets, business emails, and corporate domain details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. How We Use and Protect Resume Documents</h2>
          <p>
            Candidate PDF resumes uploaded to CareerHub are strictly used for evaluation by the explicit employers and recruiters to whom the candidate has applied. We never sell candidate personal contact lists or resume files to third-party marketing or spam syndicates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Authentication & Password Protection</h2>
          <p>
            All user authentication credentials are encrypted using industry-standard bcrypt hashing with cryptographic salts before storage. Passwords and secret keys are never stored or transmitted in plain text. Session tokens utilize JSON Web Tokens (JWT) signed with secure secret keys.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">4. Candidate Rights & Account Deletion</h2>
          <p>
            Users retain full control over their account data. At any time, candidates can update their profiles, replace or remove uploaded resumes, or request permanent deletion of their account and historical application data by contacting platform support or through account settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">5. Contact Our Data Protection Officer</h2>
          <p>
            For privacy inquiries, GDPR/CCPA data export requests, or security audit notifications, please contact our privacy compliance team at <strong>privacy@careerhub.example</strong>.
          </p>
        </section>

      </div>

    </div>
  );
};

export default PrivacyPolicy;
