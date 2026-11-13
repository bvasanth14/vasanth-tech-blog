import React, { useEffect, useState } from 'react';
import { ListOrdered, ChevronRight } from 'lucide-react';

export const TableOfContents = ({ contentHtml }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  // Parse <h2> elements from HTML content and assign unique IDs to DOM elements
  useEffect(() => {
    if (!contentHtml) return;

    // Small delay to allow DOM render of content
    const timer = setTimeout(() => {
      const container = document.getElementById('article-body-content');
      if (!container) return;

      const h2Elements = container.querySelectorAll('h2');
      const items = [];

      h2Elements.forEach((el, index) => {
        let id = el.id;
        if (!id) {
          id = `section-${index + 1}-${el.textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}`;
          el.id = id;
        }
        items.push({
          id,
          text: el.textContent.replace(/^[0-9]+[.\s]*/, ''), // clean optional leading numbers
          rawText: el.textContent,
        });
      });

      setHeadings(items);
      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [contentHtml]);

  // Scrollspy & Reading Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate reading percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(Math.round(progress));
      }

      // 2. Detect active heading
      const container = document.getElementById('article-body-content');
      if (!container) return;

      const h2Elements = container.querySelectorAll('h2');
      let currentActive = '';

      h2Elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If heading is near top of viewport (offset 140px for sticky headers)
        if (rect.top <= 160) {
          currentActive = el.id;
        }
      });

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const offset = 100; // Account for sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm tracking-tight">
          <ListOrdered className="w-4 h-4 text-blue-600" />
          <span>Table of Contents</span>
        </div>
        <span className="text-2xs font-semibold text-slate-400">
          {readingProgress}% read
        </span>
      </div>

      {/* Reading Progress Bar */}
      <div className="w-full bg-slate-100 h-1 rounded-full mb-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-150 ease-out rounded-full"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Headings List */}
      <nav className="flex flex-col space-y-1" aria-label="Table of Contents Navigation">
        {headings.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`group flex items-start text-left py-2 px-2.5 rounded-lg text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50/80 text-blue-700 font-bold border-l-2 border-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <span
                className={`mr-2 font-mono text-2xs mt-0.5 shrink-0 ${
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                }`}
              >
                0{index + 1}.
              </span>
              <span className="line-clamp-2 leading-relaxed flex-1">
                {item.text}
              </span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-1 text-blue-600 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TableOfContents;
