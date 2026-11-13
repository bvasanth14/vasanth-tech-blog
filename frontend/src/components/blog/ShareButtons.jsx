import React, { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, FacebookIcon } from '../ui/Icons';

export const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || 'Check out this tech article on Vasanth Tech Blog');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="flex items-center space-x-2 py-4">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
        Share:
      </span>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X / Twitter"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 flex items-center justify-center transition-colors"
      >
        <TwitterIcon className="w-3.5 h-3.5" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-blue-700 flex items-center justify-center transition-colors"
      >
        <LinkedinIcon className="w-3.5 h-3.5" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-blue-600 flex items-center justify-center transition-colors"
      >
        <FacebookIcon className="w-3.5 h-3.5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        aria-label="Copy article link"
        className="relative inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareButtons;
