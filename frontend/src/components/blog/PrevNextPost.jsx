import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const PrevNextPost = ({ prevPost, nextPost }) => {
  if (!prevPost && !nextPost) return null;

  return (
    <div className="border-t border-b border-slate-200 py-8 my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Previous Post */}
      {prevPost ? (
        <Link
          to={`/blog/${prevPost.slug}`}
          className="group p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center text-xs font-semibold text-slate-500 group-hover:text-blue-600 mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1" />
            <span>Previous Story</span>
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
            {prevPost.title}
          </h4>
        </Link>
      ) : (
        <div className="hidden md:block"></div>
      )}

      {/* Next Post */}
      {nextPost ? (
        <Link
          to={`/blog/${nextPost.slug}`}
          className="group p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex flex-col justify-between text-right md:text-right"
        >
          <div className="flex items-center justify-end text-xs font-semibold text-slate-500 group-hover:text-blue-600 mb-2">
            <span>Next Story</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
            {nextPost.title}
          </h4>
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default PrevNextPost;
