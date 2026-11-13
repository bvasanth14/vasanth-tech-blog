import React from 'react';
import { Layers } from 'lucide-react';

export const CategoryNav = ({ categories = [], activeCategory = 'All', onSelectCategory }) => {
  const defaultList = [
    'All',
    'Software Development',
    'Artificial Intelligence & Machine Learning',
    'Web and Mobile App Development',
    'Technology & Innovation',
    'Cybersecurity',
    'Cloud Computing',
    'Industry Insights',
  ];

  const items = categories.length > 0
    ? ['All', ...categories.map((c) => (typeof c === 'string' ? c : c.name))]
    : defaultList;

  // Deduplicate
  const uniqueItems = Array.from(new Set(items));

  return (
    <div className="bg-white border-b border-slate-200 sticky top-18 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Topics:</span>
          </div>

          {uniqueItems.map((category) => {
            const isActive =
              activeCategory === category ||
              (activeCategory === '' && category === 'All') ||
              (activeCategory === null && category === 'All');

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
