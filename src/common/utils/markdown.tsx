import React, { type ReactNode } from 'react';

function buildHyperlink(keyIndex: number, url: string, content?: ReactNode): ReactNode {
  return (
    <a
      key={`md-${keyIndex}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e): void => e.stopPropagation()}
    >
      {content || url}
    </a>
  );
}

interface RuleResult {
  node: ReactNode;
  nextIndex: number;
}

type RuleHandler = (text: string, i: number, sign: string) => RuleResult | null;

const parseUrl: RuleHandler = (text, i) => {
  let end = i;
  while (end < text.length && text[end] !== ' ' && text[end] !== '\n') {
    end++;
  }
  const url = text.slice(i, end);
  return {
    node: buildHyperlink(i, url),
    nextIndex: end,
  };
};

function parsePairedTag(Tag: 'strong' | 'em' | 'code'): RuleHandler {
  return (text, i, sign) => {
    const start = i + sign.length;
    if (!text.includes(sign, start)) return null;
    const end = text.indexOf(sign, start);
    return {
      node: <Tag key={`md-${i}`}>{text.slice(start, end)}</Tag>,
      nextIndex: end + sign.length,
    };
  };
}

const RULES: Record<string, RuleHandler> = {
  'https://': parseUrl,
  'http://': parseUrl,
  '**': parsePairedTag('strong'),
  '*': parsePairedTag('em'),
  _: parsePairedTag('em'),
  '`': parsePairedTag('code'),
  '[': (text, i) => {
    if (!text.includes(']', i + 1)) return null;
    const closeBracket = text.indexOf(']', i + 1);
    if (text[closeBracket + 1] !== '(') return null;
    const closeParen = text.indexOf(')', closeBracket + 2);
    if (closeParen === -1) return null;

    const label = text.slice(i + 1, closeBracket);
    const url = text.slice(closeBracket + 2, closeParen);
    return {
      node: buildHyperlink(i, url, label),
      nextIndex: closeParen + 1,
    };
  },
};

const RULE_ENTRIES = Object.entries(RULES);

function matchRule(text: string, i: number): RuleResult | null {
  let matchedResult: RuleResult | null = null;
  RULE_ENTRIES.some(([sign, handler]) => {
    if (text.startsWith(sign, i)) {
      matchedResult = handler(text, i, sign);
      return Boolean(matchedResult);
    }
    return false;
  });
  return matchedResult;
}

export function parseMarkdown(text: string): ReactNode {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let buffer = '';

  const flush = (): void => {
    if (buffer) {
      parts.push(buffer);
      buffer = '';
    }
  };

  let i = 0;
  while (i < text.length) {
    const result = matchRule(text, i);

    if (result) {
      flush();
      parts.push(result.node);
      i = result.nextIndex;
    } else {
      buffer += text[i];
      i++;
    }
  }

  flush();
  return parts.length > 0 ? parts : null;
}
