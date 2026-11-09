'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isUser?: boolean;
}

/**
 * Clean Markdown Renderer that converts markdown into clean styled elements:
 * - Formats bold **text** into <strong>
 * - Formats numbered lists (1. 2. 3.) with clean badges
 * - Formats bullet lists (- or • or *) into clean bullet points
 * - Formats inline `code` into styled monospace chips
 * - Strips dangling/broken markdown artifacts
 */
export function MarkdownRenderer({ content, className = '', isUser = false }: MarkdownRendererProps) {
  if (!content) return null;

  // Split into paragraphs by double newlines or single newlines
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ol') {
        renderedElements.push(
          <ol key={`ol-${renderedElements.length}`} className="my-2.5 space-y-1.5 pl-0.5">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 shadow-2xs ${
                  isUser ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  {idx + 1}
                </span>
                <span className="flex-1 text-xs leading-relaxed">{renderInlineFormatted(item, isUser)}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        renderedElements.push(
          <ul key={`ul-${renderedElements.length}`} className="my-2 space-y-1.5 pl-1">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                  isUser ? 'bg-white/70' : 'bg-blue-500'
                }`} />
                <span className="flex-1 text-xs leading-relaxed">{renderInlineFormatted(item, isUser)}</span>
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Header 1, 2, 3
    if (trimmed.startsWith('### ')) {
      flushList();
      renderedElements.push(
        <h4 key={`h-${i}`} className={`font-bold text-xs mt-3 mb-1 ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {renderInlineFormatted(trimmed.slice(4), isUser)}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      flushList();
      const text = trimmed.replace(/^#+\s*/, '');
      renderedElements.push(
        <h3 key={`h-${i}`} className={`font-bold text-sm mt-3 mb-1.5 ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {renderInlineFormatted(text, isUser)}
        </h3>
      );
      continue;
    }

    // Numbered list item: e.g. "1. ", "1) ", "**1.** "
    const numMatch = trimmed.match(/^(\*{0,2}\d+[\.\)]\*{0,2})\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[2]);
      continue;
    }

    // Bullet list item: e.g. "- ", "* ", "• "
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Normal text line
    flushList();
    renderedElements.push(
      <p key={`p-${i}`} className={`text-xs leading-relaxed my-1.5 ${isUser ? 'text-white/95' : 'text-slate-700'}`}>
        {renderInlineFormatted(trimmed, isUser)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
}

/**
 * Helper to parse bold, inline code, and clean up orphan markdown syntax
 */
function renderInlineFormatted(text: string, isUser: boolean): React.ReactNode[] {
  // Clean stray single asterisks or trailing double asterisks without match
  let clean = text;

  // Tokenize by inline code `...`, bold **...**, and italic *...* or _..._
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  const parts = clean.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold ${
            isUser ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-700 border border-slate-200/60'
          }`}
        >
          {code}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {boldText}
        </strong>
      );
    }

    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      const italicText = part.slice(1, -1);
      return (
        <span key={index} className={`italic ${isUser ? 'text-white/80' : 'text-slate-500'}`}>
          {italicText}
        </span>
      );
    }

    // Strip any remaining lone unclosed markdown symbols
    const sanitized = part.replace(/\*\*/g, '').replace(/\*/g, '').replace(/_/g, ' ');
    return sanitized;
  });
}
