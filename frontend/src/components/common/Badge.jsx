import React from 'react';
import { getStatusBadgeColor } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};

export const JobTypeBadge = ({ type }) => {
  const isIntern = type === 'Internship';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isIntern
          ? 'bg-purple-100 text-purple-700 border border-purple-200'
          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
      }`}
    >
      {type}
    </span>
  );
};

export const WorkplaceBadge = ({ type }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {type}
    </span>
  );
};

export default StatusBadge;
