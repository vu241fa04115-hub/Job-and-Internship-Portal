export const formatSalary = (salaryRange, stipendText, jobType) => {
  if (jobType === 'Internship' && stipendText) {
    return stipendText;
  }

  if (!salaryRange || (!salaryRange.min && !salaryRange.max)) {
    return jobType === 'Internship' ? 'Paid Internship' : 'Competitive';
  }

  const { min, max, currency = 'USD', period = 'yearly' } = salaryRange;
  const currSymbol = currency === 'USD' ? '$' : currency;

  const periodLabel = period === 'yearly' ? '/yr' : period === 'monthly' ? '/mo' : period === 'hourly' ? '/hr' : '';

  if (min && max) {
    return `${currSymbol}${min.toLocaleString()} - ${currSymbol}${max.toLocaleString()} ${periodLabel}`.trim();
  } else if (min) {
    return `From ${currSymbol}${min.toLocaleString()} ${periodLabel}`.trim();
  } else if (max) {
    return `Up to ${currSymbol}${max.toLocaleString()} ${periodLabel}`.trim();
  }

  return 'Competitive';
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Under Review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Shortlisted':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Interview':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Selected':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Withdrawn':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
