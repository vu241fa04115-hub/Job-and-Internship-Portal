import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Globe,
  AlertCircle,
  GraduationCap,
  Loader2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register: registerUser } = useAuth();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      companyName: '',
      companyWebsite: '',
      companyIndustry: 'Technology'
    }
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setSubmitting(true);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: selectedRole,
        phone: data.phone,
        ...(selectedRole === 'recruiter' && {
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
          companyIndustry: data.companyIndustry
        })
      };

      const user = await registerUser(payload);
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        
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
            Create your account
          </h2>
          <p className="text-xs text-slate-500">
            Select your account type to access specialized tools and opportunities
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
              selectedRole === 'student'
                ? 'bg-white text-navy-950 shadow-sm'
                : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${selectedRole === 'student' ? 'text-primary-600' : 'text-slate-400'}`} />
            <span>Job Seeker / Student</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('recruiter')}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${
              selectedRole === 'recruiter'
                ? 'bg-white text-navy-950 shadow-sm'
                : 'text-slate-500 hover:text-navy-900'
            }`}
          >
            <Building2 className={`w-4 h-4 ${selectedRole === 'recruiter' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>Recruiter / Employer</span>
          </button>
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
            
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    {...register('name', { required: 'Full name is required' })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address *
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
                  className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Recruiter-specific fields */}
            {selectedRole === 'recruiter' && (
              <div className="p-4 bg-primary-50/40 rounded-2xl border border-primary-100 space-y-3.5">
                <h4 className="font-bold text-xs text-navy-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  Company Details
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    {...register('companyName', {
                      required: selectedRole === 'recruiter' ? 'Company name is required' : false
                    })}
                    placeholder="e.g. Acme Technologies"
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
                  />
                  {errors.companyName && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.companyName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      {...register('companyWebsite')}
                      placeholder="https://company.com"
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Primary Industry
                    </label>
                    <select
                      {...register('companyIndustry')}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-700"
                    >
                      <option value="Technology">Technology & Software</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare">Healthcare & Biotech</option>
                      <option value="E-commerce">E-commerce & Retail</option>
                      <option value="Consulting">Consulting & Agency</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Must be at least 6 characters'
                      }
                    })}
                    placeholder="Min. 6 chars"
                    className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: val => val === passwordValue || 'Passwords do not match'
                    })}
                    placeholder="Repeat password"
                    className="w-full text-xs font-medium pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms notice */}
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              By creating an account, you agree to our{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register as {selectedRole === 'recruiter' ? 'Recruiter' : 'Student'}</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:underline">
              Log in instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
