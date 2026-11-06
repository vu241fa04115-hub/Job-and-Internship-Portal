import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { companyService } from '../services/companyService';

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [company, setCompany] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await companyService.getMyCompany();
        if (res.success && res.company) {
          setCompany(res.company);
          reset({
            name: res.company.name || '',
            website: res.company.website || '',
            industry: res.company.industry || 'Technology',
            location: res.company.location || '',
            size: res.company.size || '50-200 employees',
            founded: res.company.founded || '2020',
            description: res.company.description || ''
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load company profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [reset]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      setErrorMsg('');
      const res = await companyService.uploadLogo(file);
      if (res.success) {
        setCompany(prev => ({ ...prev, logo: res.logo }));
        setSuccessMsg('Logo uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await companyService.updateMyCompany(data);
      if (res.success) {
        setCompany(res.company);
        setSuccessMsg('Company profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update company details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Company Profile & Branding
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Showcase your employer brand, culture, and company overview to prospective applicants.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Logo Branding Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {company?.logo ? (
              <img src={company.logo} alt="Company Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-navy-900">{company?.name || 'Company Name'}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Recommended: Square PNG/JPEG, at least 200x200px</p>
          </div>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors shrink-0">
          {uploadingLogo ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Company Logo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploadingLogo}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
        <h2 className="font-bold text-sm text-navy-900 border-b border-slate-100 pb-3">
          Company Overview & Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Website URL
            </label>
            <input
              type="url"
              {...register('website')}
              placeholder="https://acme.com"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Industry Sector
            </label>
            <select
              {...register('industry')}
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
            >
              <option value="Software & Artificial Intelligence">Software & AI</option>
              <option value="Cloud Computing & DevOps">Cloud & DevOps</option>
              <option value="Financial Technology">Financial Technology</option>
              <option value="HealthTech & Biotech">HealthTech</option>
              <option value="E-commerce & Retail">E-commerce</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Headquarters Location
            </label>
            <input
              type="text"
              {...register('location')}
              placeholder="e.g. San Francisco, CA"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Company Size
            </label>
            <select
              {...register('size')}
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-slate-800"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="50-200 employees">50-200 employees</option>
              <option value="250-500 employees">250-500 employees</option>
              <option value="500-1000 employees">500-1000 employees</option>
              <option value="1000+ employees">1000+ employees</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Year Founded
            </label>
            <input
              type="text"
              {...register('founded')}
              placeholder="e.g. 2019"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            About the Company
          </label>
          <textarea
            rows={4}
            {...register('description')}
            placeholder="Share what makes your team unique, your mission, and products..."
            className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Company Profile</span>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};

export default CompanyProfile;
