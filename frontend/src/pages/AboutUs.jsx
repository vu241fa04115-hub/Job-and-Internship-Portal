import React from 'react';
import { Briefcase, Target, ShieldCheck, Award, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold border border-primary-200">
          <Heart className="w-3.5 h-3.5 text-primary-500" />
          <span>Our Vision & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 tracking-tight">
          Bridging the Gap Between Talent and Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          CareerHub was founded to eliminate the opaque black-hole of modern hiring. We empower students, fresh graduates, and career changers to find verified full-time positions and paid internships.
        </p>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Direct Connections</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every job and internship posting links directly to verified corporate talent leads and recruiters without intermediaries.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Verified Postings</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our multi-tier moderation system continuously scans for authentic compensation packages, verified work terms, and safe opportunities.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-navy-900">Transparent Pipeline</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Candidates receive instant notifications when applications are opened, reviewed, shortlisted, or invited to technical screens.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Built for the Modern Workforce</h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Whether you are an undergraduate seeking a Summer 2026 software engineering internship, an entry-level graduate seeking your first full-time role, or a hiring manager searching for exceptional technical talent, CareerHub provides the specialized tooling needed to succeed.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs"
          >
            Explore Opportunities
          </Link>
          <Link
            to="/register?role=recruiter"
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
          >
            Join as Recruiter
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;
