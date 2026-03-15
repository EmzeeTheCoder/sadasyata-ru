'use client';

// Renders Digiseller product descriptions
// Handles both Russian and English tag variants:
// <delivery> / <доставка>  → orange highlighted box
// <attention> / <внимание> → yellow warning box  
// <br> tags and plain HTML rendered normally

interface Props {
  html: string;
}

type Block =
  | { type: 'html'; content: string }
  | { type: 'delivery'; content: string }
  | { type: 'attention'; content: string };

// All tag variants Digiseller uses (case-insensitive)
const DELIVERY_OPEN  = /<delivery>|<доставка>/gi;
const DELIVERY_CLOSE = /<\/delivery>|<\/доставка>/gi;
const ATTENTION_OPEN  = /<attention>|<внимание>/gi;
const ATTENTION_CLOSE = /<\/attention>|<\/внимание>/gi;

function parseBlocks(html: string): Block[] {
  const blocks: Block[] = [];

  // Normalize all tag variants to a single marker
  let normalized = html
    .replace(/<доставка>/gi, '<delivery>')
    .replace(/<\/доставка>/gi, '</delivery>')
    .replace(/<внимание>/gi, '<attention>')
    .replace(/<\/внимание>/gi, '</attention>');

  // Split on special tags using a regex that captures them
  const parts = normalized.split(/(<\/?(?:delivery|attention)>)/gi);

  let currentType: 'html' | 'delivery' | 'attention' = 'html';
  let buffer = '';

  for (const part of parts) {
    if (!part) continue;
    const lower = part.toLowerCase();

    if (lower === '<delivery>') {
      if (buffer.trim()) blocks.push({ type: currentType, content: buffer });
      buffer = '';
      currentType = 'delivery';
    } else if (lower === '</delivery>') {
      if (buffer.trim()) blocks.push({ type: 'delivery', content: buffer });
      buffer = '';
      currentType = 'html';
    } else if (lower === '<attention>') {
      if (buffer.trim()) blocks.push({ type: currentType, content: buffer });
      buffer = '';
      currentType = 'attention';
    } else if (lower === '</attention>') {
      if (buffer.trim()) blocks.push({ type: 'attention', content: buffer });
      buffer = '';
      currentType = 'html';
    } else {
      buffer += part;
    }
  }

  if (buffer.trim()) blocks.push({ type: currentType, content: buffer });
  return blocks;
}

function cleanContent(html: string): string {
  return html
    .replace(/^(<br\s*\/?>|\s)+/gi, '')  // strip leading breaks
    .replace(/(<br\s*\/?>|\s)+$/gi, '')  // strip trailing breaks
    .trim();
}

export default function ProductDescription({ html }: Props) {
  if (!html) return null;
  const blocks = parseBlocks(html);

  return (
    <div className="space-y-3 text-sm">
      {blocks.map((block, i) => {
        const content = cleanContent(block.content);
        if (!content) return null;

        if (block.type === 'delivery') {
          return (
            <div key={i} className="relative rounded-xl border border-brand-orange/40 bg-brand-orange/8 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-orange" />
              <div
                className="px-4 py-3 pl-5 text-white leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          );
        }

        if (block.type === 'attention') {
          return (
            <div key={i} className="relative rounded-xl border border-yellow-400/30 bg-yellow-400/5 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400" />
              <div
                className="px-4 py-3 pl-5 text-yellow-100/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          );
        }

        // Plain HTML block
        return (
          <div
            key={i}
            className="text-brand-gray leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      })}
    </div>
  );
}
