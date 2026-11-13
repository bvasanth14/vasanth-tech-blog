/**
 * Calculates estimated reading time in minutes based on content word count.
 * Standard average reading speed: ~200 words per minute.
 * 
 * @param {string} content - HTML or raw text content
 * @returns {number} estimated reading time in whole minutes (minimum 1)
 */
function calculateReadTime(content) {
  if (!content || typeof content !== 'string') {
    return 1;
  }

  // Strip HTML tags and markdown markers
  const plainText = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*`_~>[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plainText.length > 0 ? plainText.split(/\s+/).length : 0;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return Math.max(1, minutes);
}

module.exports = calculateReadTime;
