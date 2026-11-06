import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  GraduationCap,
  Building2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, quickDemoLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const redirectAfterLogin = (role) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from, { replace: true });
      return;
    }

    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'recruiter') navigate('/recruiter/dashboard', { replace: true });
    else navigate('/student/dashboard', { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setSubmitting(true);
      const user = await login(data.email, data.password);
      redirectAfterLogin(user.role);
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async (role) => {
    try {
      setAuthError('');
      setSubmitting(true);
      const user = await quickDemoLogin(role);
      redirectAfterLogin(user.role);
    } catch (err) {
      setAuthError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-primary-600 flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy-950 font-sans">
              Career<span className="text-primary-600">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your dashboard, applications, or candidate listings
          </p>
        </div>

        {/* Demo Quick Logins Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            ⚡ Quick Demo 1-Click Login:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('student')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-primary-400 hover:bg-primary-50/50 transition-all text-xs font-semibold text-navy-900 shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-primary-600 mb-1" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('recruiter')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-primary-400 hover:bg-primary-50/50 transition-all text-xs font-semibold text-navy-900 shadow-2xs"
            >
              <Building2 className="w-4 h-4 text-indigo-600 mb-1" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              disabled={submitting}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-xs font-semibold text-navy-900 shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600 mb-1" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
          
          {authError && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  placeholder="name@example.com"
                  className={`w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white transition-colors ${
                    errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-primary-500'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <span className="text-[11px] text-primary-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  placeholder="••••••••"
                  className={`w-full text-xs font-medium pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:bg-white transition-colors ${
                    errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-primary-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
