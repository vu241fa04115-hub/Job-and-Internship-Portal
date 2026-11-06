import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  FileText,
  Building2,
  ShieldCheck,
  PlusCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isStudent, isRecruiter, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-primary-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-navy-950 font-sans block leading-none">
                  Career<span className="text-primary-600">Hub</span>
                </span>
                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider block mt-1">
                  Jobs & Internships
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/jobs"
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive('/jobs')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                Jobs
              </Link>
              <Link
                to="/internships"
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/internships')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-primary-500" />
                Internships
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive('/about')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive('/contact')
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Role Specific Action Pill */}
                {isStudent && (
                  <Link
                    to="/student/applications"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-primary-600 bg-slate-100 hover:bg-primary-50 px-3 py-1.5 rounded-full transition-colors border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary-600" />
                    <span>My Applications</span>
                  </Link>
                )}

                {isRecruiter && (
                  <Link
                    to="/recruiter/jobs/new"
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post a Vacancy</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg relative transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-navy-900">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="text-[11px] font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center px-4">
                            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-700">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                if (!notif.isRead) markAsRead(notif._id);
                                if (notif.link) {
                                  navigate(notif.link);
                                  setNotificationsOpen(false);
                                }
                              }}
                              className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                                !notif.isRead ? 'bg-primary-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-bold text-navy-900 leading-snug">
                                  {notif.title}
                                </p>
                                <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                  {timeAgo(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-bold text-navy-900 leading-none truncate max-w-[120px]">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-600 capitalize mt-0.5">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-navy-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
                      </div>

                      {/* Student Links */}
                      {isStudent && (
                        <>
                          <Link
                            to="/student/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Briefcase className="w-4 h-4 text-primary-500" />
                            Dashboard
                          </Link>
                          <Link
                            to="/student/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <User className="w-4 h-4 text-primary-500" />
                            Profile & Resume
                          </Link>
                          <Link
                            to="/student/applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <FileText className="w-4 h-4 text-primary-500" />
                            My Applications
                          </Link>
                          <Link
                            to="/student/saved-jobs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Bookmark className="w-4 h-4 text-primary-500" />
                            Saved Jobs
                          </Link>
                        </>
                      )}

                      {/* Recruiter Links */}
                      {isRecruiter && (
                        <>
                          <Link
                            to="/recruiter/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Briefcase className="w-4 h-4 text-primary-500" />
                            Recruiter Dashboard
                          </Link>
                          <Link
                            to="/recruiter/jobs/new"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <PlusCircle className="w-4 h-4 text-primary-500" />
                            Post Job / Internship
                          </Link>
                          <Link
                            to="/recruiter/applicants"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <User className="w-4 h-4 text-primary-500" />
                            Manage Applicants
                          </Link>
                          <Link
                            to="/recruiter/company"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Building2 className="w-4 h-4 text-primary-500" />
                            Company Profile
                          </Link>
                        </>
                      )}

                      {/* Admin Links */}
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-500" />
                            Admin Analytics
                          </Link>
                          <Link
                            to="/admin/users"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <User className="w-4 h-4 text-amber-500" />
                            Manage Users
                          </Link>
                          <Link
                            to="/admin/jobs"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <Briefcase className="w-4 h-4 text-amber-500" />
                            Manage Job Postings
                          </Link>
                          <Link
                            to="/admin/reports"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                          >
                            <FileText className="w-4 h-4 text-amber-500" />
                            Reports & Complaints
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-navy-900 hover:text-primary-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
                <Link
                  to="/register?role=recruiter"
                  className="px-3.5 py-2 text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors border border-primary-200"
                >
                  Recruiters / Post Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-navy-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="space-y-1">
            <Link
              to="/jobs"
              className="block px-3 py-2 text-base font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Jobs
            </Link>
            <Link
              to="/internships"
              className="block px-3 py-2 text-base font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Internships
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Contact
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-bold text-navy-900">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>

                {isStudent && (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/student/profile"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Profile & Resume
                    </Link>
                    <Link
                      to="/student/applications"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/student/saved-jobs"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Saved Jobs
                    </Link>
                  </>
                )}

                {isRecruiter && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Recruiter Dashboard
                    </Link>
                    <Link
                      to="/recruiter/jobs/new"
                      className="block px-3 py-2 text-sm font-semibold text-primary-600 rounded-lg hover:bg-slate-50"
                    >
                      + Post Vacancy
                    </Link>
                    <Link
                      to="/recruiter/applicants"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Manage Applicants
                    </Link>
                    <Link
                      to="/recruiter/company"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Company Profile
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-sm font-semibold text-amber-700 rounded-lg hover:bg-slate-50"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/jobs"
                      className="block px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
                    >
                      Manage Postings
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 text-center text-sm font-semibold text-navy-900 border border-slate-300 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-navy-900 rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
