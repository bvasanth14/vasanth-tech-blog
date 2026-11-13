import React from 'react';
import PostCard from './PostCard';
import { Sparkles } from 'lucide-react';

export const RelatedPosts = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-200">
      <div className="flex items-center space-x-2 mb-8">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Related Articles
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id || post.slug} post={post} compact={true} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
