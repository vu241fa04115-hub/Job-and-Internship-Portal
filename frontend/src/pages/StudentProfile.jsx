import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Download,
  Eye,
  Plus,
  Trash2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import ResumeViewerModal from '../components/common/ResumeViewerModal';
import { formatDate } from '../utils/formatters';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  
  const [education, setEducation] = useState(user?.education || []);
  const [experience, setExperience] = useState(user?.experience || []);

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  const [viewResumeModal, setViewResumeModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      headline: user?.headline || '',
      location: user?.location || '',
      bio: user?.bio || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        headline: user.headline || '',
        location: user.location || '',
        bio: user.bio || ''
      });
      setSkills(user.skills || []);
      setEducation(user.education || []);
      setExperience(user.experience || []);
    }
  }, [user, reset]);

  // Skill Handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        grade: ''
      }
    ]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const handleRemoveExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Resume file size cannot exceed 5MB.');
      return;
    }

    try {
      setUploadingResume(true);
      setErrorMsg('');
      const res = await userService.uploadResume(file);
      if (res.success) {
        updateUser({
          resumeUrl: res.resumeUrl,
          resumeOriginalName: res.resumeOriginalName,
          resumeUpdatedAt: res.resumeUpdatedAt
        });
        setSuccessMsg('Resume uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  // Submit Profile Changes
  const onSubmit = async (formData) => {
    try {
      setSavingProfile(true);
      setErrorMsg('');
      const payload = {
        ...formData,
        skills,
        education,
        experience
      };

      const res = await userService.updateProfile(payload);
      if (res.success) {
        updateUser(res.user);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
          Profile & Resume
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, resume file, skills, and academic history.
        </p>
      </div>

      {/* Alerts */}
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

      {/* 1. Resume Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-navy-900">Resume Document</h2>
              <p className="text-xs text-slate-500">PDF format required (max 5MB)</p>
            </div>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors">
            {uploadingResume ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>{user?.resumeUrl ? 'Replace Resume' : 'Upload Resume'}</span>
              </>
            )}
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
              className="hidden"
            />
          </label>
        </div>

        {user?.resumeUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-navy-900 truncate max-w-sm">
                  {user.resumeOriginalName || 'Uploaded Resume.pdf'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Last updated {formatDate(user.resumeUpdatedAt || user.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewResumeModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-primary-600" />
                <span>Preview</span>
              </button>
              <a
                href={user.resumeUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-navy-900">No resume on file</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Upload your PDF resume to enable instant 1-click applications.
            </p>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* 2. Personal Information Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-navy-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Your public contact and headline information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                {...register('headline')}
                placeholder="e.g. Full-Stack Developer | CS Senior @ UC Berkeley"
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="City, State, Country"
                className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Short Bio / Candidate Summary
            </label>
            <textarea
              rows={3}
              {...register('bio')}
              placeholder="Tell recruiters about your background, career goals, and technical passions..."
              className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* 3. Skills Tag Management Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-navy-900">Skills & Competencies</h2>
              <p className="text-xs text-slate-500">Keywords employers search for</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
              placeholder="Type a skill (e.g. React, Python, Docker) and press Enter..."
              className="flex-1 text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-slate-400 italic">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* 4. Education History Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-navy-900">Education History</h2>
                <p className="text-xs text-slate-500">Degree, university, GPA</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddEducation}
              className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600"
                  title="Remove education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Institution / College</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                      placeholder="e.g. UC Berkeley"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Years (Start - End)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={edu.startYear || ''}
                        onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                        placeholder="2022"
                        className="w-1/2 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="text"
                        value={edu.endYear || ''}
                        onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                        placeholder="2026"
                        className="w-1/2 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">GPA / Grade</label>
                    <input
                      type="text"
                      value={edu.grade || ''}
                      onChange={(e) => handleEducationChange(idx, 'grade', e.target.value)}
                      placeholder="e.g. 3.85 GPA"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}

            {education.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No education history added yet.
              </p>
            )}
          </div>
        </div>

        {/* 5. Experience History Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-navy-900">Work & Internship Experience</h2>
                <p className="text-xs text-slate-500">Previous roles, internships, and research</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddExperience}
              className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600"
                  title="Remove experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Frontend Intern"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                      placeholder="e.g. NextGen Software"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Description of Work</label>
                  <textarea
                    rows={2}
                    value={exp.description || ''}
                    onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                    placeholder="Key responsibilities and technical accomplishments..."
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl resize-none"
                  />
                </div>
              </div>
            ))}

            {experience.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No work experience entries added yet.
              </p>
            )}
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-8 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {savingProfile ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <span>Save All Profile Changes</span>
            )}
          </button>
        </div>

      </form>

      {/* Resume Viewer Modal */}
      {viewResumeModal && user?.resumeUrl && (
        <ResumeViewerModal
          isOpen={viewResumeModal}
          onClose={() => setViewResumeModal(false)}
          resumeUrl={user.resumeUrl}
          applicantName={user.name}
        />
      )}

    </div>
  );
};

export default StudentProfile;
