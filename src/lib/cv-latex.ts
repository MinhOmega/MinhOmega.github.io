/**
 * Focused LaTeX-to-data parser for the resume in /home/minhvnq/Desktop/CV/minh_vo.tex.
 *
 * Not a general LaTeX engine — handles only the macros this resume uses:
 *   \documentclass, \usepackage, \newcommand, \section, \resumeSubheading,
 *   \begin{document} / \end{document}, \begin{center} / \end{center},
 *   \begin{itemize} / \end{itemize}, \item,
 *   \textbf, \textit, \href, \textbar, \fontsize{..}{..}\selectfont, \\, \vspace,
 *   `--`, `---`, comments (% ...), and plain text.
 */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "italic"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] }
  | { type: "linebreak" };

export type SubheadingBlock = {
  type: "subheading";
  primary: InlineNode[];
  meta: InlineNode[];
  secondary: InlineNode[];
  secondaryMeta: InlineNode[];
};

export type ItemizeBlock = { type: "itemize"; items: InlineNode[][] };
export type ParagraphBlock = { type: "paragraph"; content: InlineNode[] };

export type Block = SubheadingBlock | ItemizeBlock | ParagraphBlock;

export type Section = { title: string; blocks: Block[] };

export type CVDocument = {
  name: string;
  contact: InlineNode[];
  sections: Section[];
};

/* -------------------------------------------------------------------------- */
/* Pre-processing                                                              */
/* -------------------------------------------------------------------------- */

const stripComments = (src: string): string =>
  src
    .split("\n")
    .map((line) => {
      // Remove unescaped `%` to end of line.
      const out: string[] = [];
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === "\\" && i + 1 < line.length) {
          out.push(ch, line[i + 1]);
          i++;
          continue;
        }
        if (ch === "%") break;
        out.push(ch);
      }
      return out.join("");
    })
    .join("\n");

const extractDocumentBody = (src: string): string => {
  const begin = src.indexOf("\\begin{document}");
  const end = src.indexOf("\\end{document}");
  if (begin === -1 || end === -1) return src;
  return src.slice(begin + "\\begin{document}".length, end);
};

/* -------------------------------------------------------------------------- */
/* Brace-balanced argument reader                                              */
/* -------------------------------------------------------------------------- */

/**
 * Read a single `{...}` argument starting at `src[pos]`.
 * Returns the inner text and the next position (after the closing brace).
 * If the next non-whitespace char isn't `{`, returns `null`.
 */
const readBraceArg = (
  src: string,
  pos: number,
): { value: string; next: number } | null => {
  while (pos < src.length && /\s/.test(src[pos])) pos++;
  if (src[pos] !== "{") return null;
  let depth = 1;
  let i = pos + 1;
  const start = i;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === "\\" && i + 1 < src.length) {
      i += 2;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) break;
    }
    i++;
  }
  return { value: src.slice(start, i), next: i + 1 };
};

/* -------------------------------------------------------------------------- */
/* Inline parsing                                                              */
/* -------------------------------------------------------------------------- */

const DASH_RE = /---/g;
const ENDASH_RE = /--/g;

const cleanText = (raw: string): string =>
  raw
    .replace(/~/g, " ")
    .replace(DASH_RE, "—")
    .replace(ENDASH_RE, "–")
    .replace(/\s+/g, " ");

const parseInline = (src: string): InlineNode[] => {
  const nodes: InlineNode[] = [];
  let buffer = "";
  const flush = () => {
    if (buffer) {
      const cleaned = cleanText(buffer);
      if (cleaned) nodes.push({ type: "text", value: cleaned });
      buffer = "";
    }
  };

  let i = 0;
  while (i < src.length) {
    const ch = src[i];

    if (ch === "\\") {
      // Special two-char escapes
      if (src.startsWith("\\\\", i)) {
        flush();
        nodes.push({ type: "linebreak" });
        i += 2;
        continue;
      }

      // Read command name [a-zA-Z]+
      const cmdMatch = /^\\([a-zA-Z]+)\*?/.exec(src.slice(i));
      if (!cmdMatch) {
        // Unknown escape (e.g. `\&`, `\%`) → keep as literal
        buffer += src[i + 1] ?? "";
        i += 2;
        continue;
      }
      const cmd = cmdMatch[1];
      let cursor = i + cmdMatch[0].length;

      if (cmd === "textbf") {
        const arg = readBraceArg(src, cursor);
        if (arg) {
          flush();
          nodes.push({ type: "bold", children: parseInline(arg.value) });
          i = arg.next;
          continue;
        }
      }
      if (cmd === "textit" || cmd === "emph") {
        const arg = readBraceArg(src, cursor);
        if (arg) {
          flush();
          nodes.push({ type: "italic", children: parseInline(arg.value) });
          i = arg.next;
          continue;
        }
      }
      if (cmd === "href") {
        const urlArg = readBraceArg(src, cursor);
        if (urlArg) {
          const textArg = readBraceArg(src, urlArg.next);
          if (textArg) {
            flush();
            nodes.push({
              type: "link",
              href: cleanText(urlArg.value).trim(),
              children: parseInline(textArg.value),
            });
            i = textArg.next;
            continue;
          }
        }
      }
      if (cmd === "textbar") {
        // \textbar{} → "|"
        flush();
        nodes.push({ type: "text", value: " | " });
        // Skip an optional {} arg.
        const arg = readBraceArg(src, cursor);
        i = arg ? arg.next : cursor;
        continue;
      }
      if (cmd === "fontsize") {
        // \fontsize{..}{..}\selectfont — swallow two args and a following \selectfont
        const a1 = readBraceArg(src, cursor);
        const a2 = a1 ? readBraceArg(src, a1.next) : null;
        i = a2 ? a2.next : cursor;
        // Skip whitespace and \selectfont
        while (i < src.length && /\s/.test(src[i])) i++;
        if (src.startsWith("\\selectfont", i)) i += "\\selectfont".length;
        continue;
      }
      if (cmd === "selectfont" || cmd === "noindent" || cmd === "small" || cmd === "large") {
        i = cursor;
        continue;
      }
      if (cmd === "vspace" || cmd === "hspace" || cmd === "rule" || cmd === "label" || cmd === "phantomsection") {
        // Skip optional and brace args.
        // Crude: swallow one `{...}` arg if present.
        const a1 = readBraceArg(src, cursor);
        i = a1 ? a1.next : cursor;
        continue;
      }

      // Default: drop the command, keep going.
      // Skip a single brace arg if present (so `\unknown{foo}` doesn't leak braces).
      const arg = readBraceArg(src, cursor);
      i = arg ? arg.next : cursor;
      continue;
    }

    if (ch === "{") {
      // Group — parse contents and inline-merge.
      const arg = readBraceArg(src, i);
      if (arg) {
        flush();
        nodes.push(...parseInline(arg.value));
        i = arg.next;
        continue;
      }
    }

    if (ch === "}") {
      // Stray close brace — skip.
      i++;
      continue;
    }

    buffer += ch;
    i++;
  }

  flush();

  // Trim leading/trailing whitespace text nodes.
  while (nodes.length && nodes[0].type === "text" && !nodes[0].value.trim()) {
    nodes.shift();
  }
  while (
    nodes.length &&
    nodes[nodes.length - 1].type === "text" &&
    !(nodes[nodes.length - 1] as { value: string }).value.trim()
  ) {
    nodes.pop();
  }

  return nodes;
};

/* -------------------------------------------------------------------------- */
/* Block parsing                                                               */
/* -------------------------------------------------------------------------- */

const parseItemize = (src: string): ItemizeBlock => {
  // Split on `\item` at top level (depth 0 only).
  const items: string[] = [];
  let depth = 0;
  let current = "";
  let i = 0;
  while (i < src.length) {
    if (src[i] === "\\" && src.startsWith("\\item", i) && depth === 0) {
      if (current.trim()) items.push(current);
      current = "";
      i += "\\item".length;
      continue;
    }
    const ch = src[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    current += ch;
    i++;
  }
  if (current.trim()) items.push(current);
  return { type: "itemize", items: items.map((raw) => parseInline(raw)) };
};

const ENV_RE = /\\begin\{([a-zA-Z*]+)\}/;

const findEnvEnd = (src: string, env: string, fromIdx: number): number => {
  const open = `\\begin{${env}}`;
  const close = `\\end{${env}}`;
  let depth = 1;
  let i = fromIdx;
  while (i < src.length && depth > 0) {
    if (src.startsWith(close, i)) {
      depth--;
      if (depth === 0) return i;
      i += close.length;
      continue;
    }
    if (src.startsWith(open, i)) {
      depth++;
      i += open.length;
      continue;
    }
    i++;
  }
  return -1;
};

const parseBlocks = (src: string): Block[] => {
  const blocks: Block[] = [];
  let buffer = "";

  const flushParagraph = () => {
    const trimmed = buffer.trim();
    buffer = "";
    if (!trimmed) return;
    const nodes = parseInline(trimmed);
    if (nodes.length) blocks.push({ type: "paragraph", content: nodes });
  };

  let i = 0;
  while (i < src.length) {
    // \resumeSubheading{primary}{meta}\n{secondary}{secondaryMeta}
    if (src.startsWith("\\resumeSubheading", i)) {
      flushParagraph();
      let cursor = i + "\\resumeSubheading".length;
      const a1 = readBraceArg(src, cursor);
      const a2 = a1 ? readBraceArg(src, a1.next) : null;
      const a3 = a2 ? readBraceArg(src, a2.next) : null;
      const a4 = a3 ? readBraceArg(src, a3.next) : null;
      if (a1 && a2 && a3 && a4) {
        blocks.push({
          type: "subheading",
          primary: parseInline(a1.value),
          meta: parseInline(a2.value),
          secondary: parseInline(a3.value),
          secondaryMeta: parseInline(a4.value),
        });
        i = a4.next;
        continue;
      }
    }

    // \begin{itemize}...\end{itemize}
    const envMatch = ENV_RE.exec(src.slice(i));
    if (envMatch && envMatch.index === 0) {
      const envName = envMatch[1];
      const afterOpen = i + envMatch[0].length;
      const endIdx = findEnvEnd(src, envName, afterOpen);
      if (endIdx !== -1) {
        const inner = src.slice(afterOpen, endIdx);
        if (envName === "itemize") {
          flushParagraph();
          blocks.push(parseItemize(inner));
        } else {
          // Unknown environment — recursively parse its body inline.
          buffer += " " + inner + " ";
        }
        i = endIdx + `\\end{${envName}}`.length;
        continue;
      }
    }

    // Skip \vspace{...}, \rule{..}{..}, \fancyhf{...}
    if (src.startsWith("\\vspace", i) || src.startsWith("\\hspace", i)) {
      const cursor = i + (src.startsWith("\\vspace", i) ? "\\vspace".length : "\\hspace".length);
      const arg = readBraceArg(src, cursor);
      i = arg ? arg.next : cursor;
      continue;
    }

    buffer += src[i];
    i++;
  }
  flushParagraph();
  return blocks;
};

/* -------------------------------------------------------------------------- */
/* Top-level                                                                   */
/* -------------------------------------------------------------------------- */

export const parseCVLatex = (src: string): CVDocument => {
  const body = extractDocumentBody(stripComments(src));

  // Find all centered blocks before the first \section (name + contact).
  const firstSection = body.indexOf("\\section");
  const header = firstSection === -1 ? body : body.slice(0, firstSection);
  const sectionsSrc = firstSection === -1 ? "" : body.slice(firstSection);

  // Extract centered text blocks.
  const centerRe = /\\begin\{center\}([\s\S]*?)\\end\{center\}/g;
  const centerBlocks: InlineNode[][] = [];
  let m: RegExpExecArray | null;
  while ((m = centerRe.exec(header)) !== null) {
    centerBlocks.push(parseInline(m[1]));
  }

  const nameNodes = centerBlocks[0] ?? [];
  const contactNodes = centerBlocks[1] ?? [];

  const name = nameNodes
    .map((n) => (n.type === "text" ? n.value : ""))
    .join(" ")
    .trim();

  // Split by \section{...} at top level.
  const sections: Section[] = [];
  const sectionRe = /\\section\{([^}]*)\}/g;
  const matches: { title: string; start: number; end: number }[] = [];
  let sm: RegExpExecArray | null;
  while ((sm = sectionRe.exec(sectionsSrc)) !== null) {
    matches.push({ title: sm[1].trim(), start: sm.index, end: sm.index + sm[0].length });
  }
  for (let idx = 0; idx < matches.length; idx++) {
    const here = matches[idx];
    const next = matches[idx + 1];
    const inner = sectionsSrc.slice(here.end, next ? next.start : sectionsSrc.length);
    sections.push({ title: here.title, blocks: parseBlocks(inner) });
  }

  return { name, contact: contactNodes, sections };
};
