'use client';

// Renders Digiseller product descriptions with custom tag support:
// <delivery> → highlighted orange box (most important info)
// <attention> → yellow warning box
// All other HTML rendered normally

interface Props {
  html: string;
}

function parseDescription(html: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = html;
  let key = 0;

  while (remaining.length > 0) {
    // Check for <delivery> tag
    const deliveryStart = remaining.toLowerCase().indexOf('<delivery>');
    const attentionStart = remaining.toLowerCase().indexOf('<attention>');

    // Find the nearest special tag
    let nextTag: 'delivery' | 'attention' | null = null;
    let nextPos = Infinity;

    if (deliveryStart !== -1 && deliveryStart < nextPos) {
      nextTag = 'delivery';
      nextPos = deliveryStart;
    }
    if (attentionStart !== -1 && attentionStart < nextPos) {
      nextTag = 'attention';
      nextPos = attentionStart;
    }

    if (nextTag === null) {
      // No more special tags — render remaining as HTML
      if (remaining.trim()) {
        nodes.push(
          <div
            key={key++}
            className="text-brand-gray leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtml(remaining) }}
          />
        );
      }
      break;
    }

    // Render text before the special tag
    if (nextPos > 0) {
      const before = remaining.slice(0, nextPos);
      if (before.trim()) {
        nodes.push(
          <div
            key={key++}
            className="text-brand-gray leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtml(before) }}
          />
        );
      }
    }

    // Find closing tag
    const closeTag = `</${nextTag}>`;
    const closePos = remaining.toLowerCase().indexOf(closeTag, nextPos);

    if (closePos === -1) {
      // No closing tag found — treat rest as plain content
      remaining = remaining.slice(nextPos + nextTag.length + 2);
      continue;
    }

    const openTagLength = nextTag.length + 2; // e.g. <delivery> = 10 chars
    const innerContent = remaining.slice(nextPos + openTagLength, closePos);

    if (nextTag === 'delivery') {
      nodes.push(
        <div
          key={key++}
          className="my-4 p-4 rounded-xl border border-brand-orange/40 bg-brand-orange/10 relative overflow-hidden"
        >
          {/* Glow accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange rounded-l-xl" />
          <div
            className="pl-3 text-sm text-white leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtml(innerContent) }}
          />
        </div>
      );
    } else if (nextTag === 'attention') {
      nodes.push(
        <div
          key={key++}
          className="my-4 p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/8 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 rounded-l-xl" />
          <div
            className="pl-3 text-sm text-yellow-100/90 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: cleanHtml(innerContent) }}
          />
        </div>
      );
    }

    remaining = remaining.slice(closePos + closeTag.length);
  }

  return nodes;
}

// Clean up common Digiseller HTML artifacts
function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '<br/>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function ProductDescription({ html }: Props) {
  if (!html) return null;
  const nodes = parseDescription(html);
  return (
    <div className="space-y-2 text-sm">
      {nodes}
    </div>
  );
}
