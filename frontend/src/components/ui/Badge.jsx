import React from 'react';

export const CategoryBadge = ({ category, className = '', onClick }) => {
  const getColors = (cat) => {
    switch (cat) {
      case 'Software Development':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Artificial Intelligence & Machine Learning':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'Web and Mobile App Development':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'Technology & Innovation':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      case 'Cybersecurity':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100';
      case 'Cloud Computing':
        return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100';
      case 'Industry Insights':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${getColors(
        category
      )} ${className}`}
    >
      {category}
    </Component>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'published':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"></span>
          Published
        </span>
      );
    case 'scheduled':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          Scheduled
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 mr-1.5 bg-amber-500 rounded-full"></span>
          Draft
        </span>
      );
  }
};
