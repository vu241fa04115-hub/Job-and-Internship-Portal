import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Send, Check } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Career<span className="text-primary-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The modern career launchpad connecting ambitious students, freshers, and experienced talent with premier tech innovators and global enterprises.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Get Weekly Job & Internship Alerts
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2.5 rounded-xl max-w-sm">
                  <Check className="w-4 h-4" />
                  <span>Subscribed! Check your inbox for top job drops.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-navy-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Candidates Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">
                  Explore Full-Time Jobs
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-white transition-colors">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/profile" className="hover:text-white transition-colors">
                  Resume & Profile Builder
                </Link>
              </li>
              <li>
                <Link to="/student/applications" className="hover:text-white transition-colors">
                  Track Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/register?role=recruiter" className="hover:text-white transition-colors">
                  Recruiter Sign Up
                </Link>
              </li>
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-white transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-white transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/applicants" className="hover:text-white transition-colors">
                  Applicant Pipeline
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="hover:text-white transition-colors">
                  Company Branding
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About CareerHub
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Staff / Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Job and Internship Portal (CareerHub). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with React, Vite, Tailwind CSS, Express, and MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
