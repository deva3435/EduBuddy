import React, { useState } from 'react';
import { Copy, Check, Code, Eye } from 'lucide-react';
import { FormulaExpression } from '../types';

interface MathRendererProps {
  expression: FormulaExpression;
  size?: 'small' | 'medium' | 'large';
  allowCopy?: boolean;
  className?: string;
  showToggle?: boolean;
}

/**
 * Safely transforms simple LaTeX and algebraic expressions into structured HTML nodes
 * for crisp, readable mathematical typography without external heavy runtimes.
 */
function renderMathContent(latex: string, fallbackText: string): React.ReactNode {
  if (!latex) return fallbackText;

  // Pre-process common LaTeX commands into clean unicode / tokens
  let processed = latex
    .replace(/\\quad/g, '   ')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\mp/g, ' ∓ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\leq/g, ' ≤ ')
    .replace(/\\geq/g, ' ≥ ')
    .replace(/\\infty/g, ' ∞ ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\nu/g, 'ν')
    .replace(/\\pi/g, 'π')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\tau/g, 'τ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\omega/g, 'ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\sum/g, '∑')
    .replace(/\\int/g, '∫')
    .replace(/\\varepsilon_0/g, 'ε₀')
    .replace(/\\varepsilon/g, 'ε')
    .replace(/\\kappa/g, 'κ')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\text\{([^}]+)\}/g, '$1');

  // Handle fractions: \frac{A}{B}
  const fracRegex = /\\frac\{([^{}]+)\}\{([^{}]+)\}/;
  let hasFrac = fracRegex.test(processed);

  // If there's a simple single or double fraction, parse and structure it
  if (hasFrac) {
    const parts: React.ReactNode[] = [];
    let remaining = processed;
    let match = fracRegex.exec(remaining);
    let keyIdx = 0;

    while (match) {
      const matchIndex = match.index;
      const before = remaining.substring(0, matchIndex);
      if (before) {
        parts.push(<span key={`text-${keyIdx++}`}>{formatSubSup(before)}</span>);
      }

      const num = match[1];
      const denom = match[2];

      parts.push(
        <span className="math-frac" key={`frac-${keyIdx++}`}>
          <span className="math-num">{formatSubSup(num)}</span>
          <span className="math-denom">{formatSubSup(denom)}</span>
        </span>
      );

      remaining = remaining.substring(matchIndex + match[0].length);
      match = fracRegex.exec(remaining);
    }

    if (remaining) {
      parts.push(<span key={`text-${keyIdx++}`}>{formatSubSup(remaining)}</span>);
    }

    return <span className="math-expression-wrap">{parts}</span>;
  }

  // Fallback to formatted sub/superscript formatting
  return <span className="math-expression-wrap">{formatSubSup(processed)}</span>;
}

/**
 * Parses superscripts (^x or ^{xyz}) and subscripts (_x or _{xyz}) into React nodes
 */
function formatSubSup(str: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Tokenize ^ and _
  let i = 0;
  let cur = '';

  const flush = () => {
    if (cur) {
      tokens.push(cur);
      cur = '';
    }
  };

  while (i < str.length) {
    if (str[i] === '^') {
      flush();
      i++;
      let supText = '';
      if (str[i] === '{') {
        i++;
        while (i < str.length && str[i] !== '}') {
          supText += str[i];
          i++;
        }
        if (str[i] === '}') i++;
      } else if (i < str.length) {
        supText = str[i];
        i++;
      }
      tokens.push(<sup className="math-sup" key={`sup-${i}`}>{cleanLatexText(supText)}</sup>);
    } else if (str[i] === '_') {
      flush();
      i++;
      let subText = '';
      if (str[i] === '{') {
        i++;
        while (i < str.length && str[i] !== '}') {
          subText += str[i];
          i++;
        }
        if (str[i] === '}') i++;
      } else if (i < str.length) {
        subText = str[i];
        i++;
      }
      tokens.push(<sub className="math-sub" key={`sub-${i}`}>{cleanLatexText(subText)}</sub>);
    } else if (str.substr(i, 6) === '\\sqrt{') {
      flush();
      i += 6;
      let sqrtText = '';
      let braceDepth = 1;
      while (i < str.length && braceDepth > 0) {
        if (str[i] === '{') braceDepth++;
        else if (str[i] === '}') braceDepth--;
        if (braceDepth > 0) sqrtText += str[i];
        i++;
      }
      tokens.push(
        <span className="math-sqrt" key={`sqrt-${i}`}>
          <span className="math-sqrt-radical">√</span>
          <span className="math-sqrt-radicand">{formatSubSup(sqrtText)}</span>
        </span>
      );
    } else {
      cur += str[i];
      i++;
    }
  }
  flush();

  return tokens;
}

function cleanLatexText(s: string): string {
  return s
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\/g, '');
}

export function MathRenderer({
  expression,
  size = 'medium',
  allowCopy = true,
  className = '',
  showToggle = false
}: MathRendererProps) {
  const [copiedType, setCopiedType] = useState<'text' | 'latex' | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'latex'>('visual');

  const copyToClipboard = async (type: 'text' | 'latex', e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = type === 'latex' ? expression.latex : (expression.text || expression.latex);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older environments
        const el = document.createElement('textarea');
        el.value = textToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 1800);
    } catch {
      // Ignore clipboard permission errors gracefully
    }
  };

  return (
    <div className={`math-renderer-container math-size-${size} ${className}`}>
      <div className="math-display-viewport">
        {viewMode === 'visual' ? (
          <div className="math-content-visual" title={expression.text}>
            {renderMathContent(expression.latex, expression.text)}
          </div>
        ) : (
          <code className="math-content-latex">
            {expression.latex}
          </code>
        )}
      </div>

      <div className="math-actions-bar">
        {showToggle && (
          <button
            type="button"
            className="math-mode-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode(m => m === 'visual' ? 'latex' : 'visual');
            }}
            title={viewMode === 'visual' ? 'Switch to LaTeX code' : 'Switch to visual math'}
            aria-label="Toggle mathematical expression format"
          >
            {viewMode === 'visual' ? <Code size={13} /> : <Eye size={13} />}
            <span>{viewMode === 'visual' ? 'LaTeX' : 'Math'}</span>
          </button>
        )}

        {allowCopy && (
          <div className="math-copy-group">
            <button
              type="button"
              className={`math-copy-btn ${copiedType === 'text' ? 'copied' : ''}`}
              onClick={(e) => copyToClipboard('text', e)}
              title="Copy plain formula text"
              aria-label="Copy plain text formula"
            >
              {copiedType === 'text' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedType === 'text' ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className={`math-copy-btn math-copy-latex-btn ${copiedType === 'latex' ? 'copied' : ''}`}
              onClick={(e) => copyToClipboard('latex', e)}
              title="Copy LaTeX code for reports & documents"
              aria-label="Copy LaTeX code"
            >
              {copiedType === 'latex' ? <Check size={12} /> : <span>LaTeX</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
