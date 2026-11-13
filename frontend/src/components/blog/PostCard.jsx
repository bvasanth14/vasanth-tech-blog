import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';

export const PostCard = ({ post, compact = false }) => {
  if (!post) return null;

  const primaryCategory =
    Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories[0]
      : 'Technology';

  const authorName = post.author?.name || 'Vasanth';
  const authorAvatar =
    post.author?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <article className="group flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden card-hover-fx">
      {/* Thumbnail with smooth zoom */}
      <Link
        to={`/blog/${post.slug}`}
        className="relative block aspect-16/10 overflow-hidden bg-slate-100"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={primaryCategory} />
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center space-x-3 text-xs text-slate-500 mb-2.5">
          <span className="inline-flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {formattedDate}
          </span>
          <span>•</span>
          <span className="inline-flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {post.readTime || 4} min read
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
          <Link to={`/blog/${post.slug}`} className="flex items-start justify-between">
            <span>{post.title}</span>
          </Link>
        </h3>

        {!compact && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer: Author Info */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2.5">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 group-hover:border-blue-400 transition-colors"
            />
            <span className="text-xs font-semibold text-slate-800">
              {authorName}
            </span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 inline-flex items-center group-hover:translate-x-0.5 transition-transform"
            aria-label={`Read ${post.title}`}
          >
            Read
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
