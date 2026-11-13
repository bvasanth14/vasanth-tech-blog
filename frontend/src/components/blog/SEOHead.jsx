import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOHead = ({
  title = 'Vasanth Tech Blog | Enterprise Software & Technology Architecture',
  description = 'Deep engineering insights, cloud-native architecture, generative AI, cybersecurity, and modern software development authored by Vasanth.',
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  article = null,
}) => {
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const siteName = 'Vasanth Tech Blog';

  // Construct JSON-LD Schema for BlogPosting if article is provided
  let jsonLdSchema = null;
  if (article) {
    jsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
      headline: article.seoTitle || article.title,
      description: article.metaDescription || article.excerpt,
      image: [article.coverImage || ogImage],
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author?.name || 'Vasanth',
        jobTitle: article.author?.bio || 'Founder & Principal Cloud Architect',
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
      },
      keywords: Array.isArray(article.tags) ? article.tags.join(', ') : '',
    };
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />

      {/* Article specific metadata */}
      {article && (
        <meta property="article:published_time" content={new Date(article.publishedAt).toISOString()} />
      )}
      {article?.categories?.map((cat, idx) => (
        <meta key={idx} property="article:section" content={cat} />
      ))}

      {/* JSON-LD Structured Data */}
      {jsonLdSchema && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
