import React, { useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

export const RichContentRenderer = ({ content }) => {
  const containerRef = useRef(null);

  // Enhance code blocks with copy buttons and language badges
  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll('pre');

    preElements.forEach((pre) => {
      // Avoid duplicate wrappers
      if (pre.parentElement.classList.contains('code-block-wrapper')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper relative group my-6 rounded-xl overflow-hidden shadow-md';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create toolbar header
      const header = document.createElement('div');
      header.className =
        'flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono select-none';

      const codeType = document.createElement('span');
      codeType.textContent = 'CODE SNIPPET';
      header.appendChild(codeType);

      const copyBtn = document.createElement('button');
      copyBtn.className =
        'inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-2xs font-sans';
      copyBtn.innerHTML = `<span>Copy</span>`;

      copyBtn.onclick = () => {
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `<span class="text-emerald-400 font-semibold">Copied!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Copy</span>`;
          }, 2000);
        });
      };

      header.appendChild(copyBtn);
      wrapper.insertBefore(header, pre);
    });

    // Make tables horizontally scrollable on mobile
    const tables = containerRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      if (table.parentElement.classList.contains('table-scroll-container')) return;
      const scrollWrapper = document.createElement('div');
      scrollWrapper.className = 'table-scroll-container overflow-x-auto my-6 rounded-lg border border-slate-200';
      table.parentNode.insertBefore(scrollWrapper, table);
      scrollWrapper.appendChild(table);
    });
  }, [content]);

  return (
    <div
      id="article-body-content"
      ref={containerRef}
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default RichContentRenderer;
