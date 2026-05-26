import type { Block, CVDocument, Section, SubheadingBlock } from "@/lib/cv-latex";
import { InlineNodes } from "./inline";

export function CVDocumentView({ doc }: { doc: CVDocument }) {
  return (
    <article
      className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 space-y-8"
      role="main"
    >
      <header className="text-center space-y-3 pb-4 border-b">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider">{doc.name}</h1>
        {doc.contact.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <InlineNodes nodes={doc.contact} />
          </p>
        )}
      </header>

      {doc.sections.map((section, i) => (
        <SectionView key={i} section={section} />
      ))}
    </article>
  );
}

function SectionView({ section }: { section: Section }) {
  return (
    <section aria-labelledby={`section-${slugify(section.title)}`}>
      <h2
        id={`section-${slugify(section.title)}`}
        className="text-base sm:text-lg font-semibold tracking-[0.18em] border-b pb-1 mb-4 uppercase"
      >
        {section.title}
      </h2>
      <div className="space-y-5">
        {groupBlocks(section.blocks).map((group, i) =>
          group.type === "subheading-group" ? (
            <SubheadingGroup key={i} heading={group.heading} bullets={group.bullets} />
          ) : group.type === "itemize" ? (
            <ul key={i} className="list-disc ml-5 space-y-1 text-sm text-foreground/85">
              {group.items.map((item, idx) => (
                <li key={idx}>
                  <InlineNodes nodes={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={i} className="text-sm leading-relaxed text-foreground/85">
              <InlineNodes nodes={group.content} />
            </p>
          ),
        )}
      </div>
    </section>
  );
}

function SubheadingGroup({
  heading,
  bullets,
}: {
  heading: SubheadingBlock;
  bullets: Block[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
        <h3 className="text-[15px] font-bold">
          <InlineNodes nodes={heading.primary} />
        </h3>
        {heading.meta.length > 0 && (
          <span className="text-sm text-muted-foreground">
            <InlineNodes nodes={heading.meta} />
          </span>
        )}
      </div>
      {(heading.secondary.length > 0 || heading.secondaryMeta.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-sm italic text-foreground/80">
          <span>
            <InlineNodes nodes={heading.secondary} />
          </span>
          {heading.secondaryMeta.length > 0 && (
            <span>
              <InlineNodes nodes={heading.secondaryMeta} />
            </span>
          )}
        </div>
      )}
      {bullets.map((b, i) =>
        b.type === "itemize" ? (
          <ul key={i} className="list-disc ml-5 space-y-1 text-sm text-foreground/85">
            {b.items.map((item, idx) => (
              <li key={idx}>
                <InlineNodes nodes={item} />
              </li>
            ))}
          </ul>
        ) : b.type === "paragraph" ? (
          <p key={i} className="text-sm leading-relaxed text-foreground/85">
            <InlineNodes nodes={b.content} />
          </p>
        ) : null,
      )}
    </div>
  );
}

type Group =
  | { type: "subheading-group"; heading: SubheadingBlock; bullets: Block[] }
  | { type: "itemize"; items: Block[] extends infer _ ? Array<import("@/lib/cv-latex").InlineNode[]> : never }
  | { type: "paragraph"; content: import("@/lib/cv-latex").InlineNode[] };

function groupBlocks(blocks: Block[]): Group[] {
  const out: Group[] = [];
  let pending: { type: "subheading-group"; heading: SubheadingBlock; bullets: Block[] } | null = null;
  const flush = () => {
    if (pending) {
      out.push(pending);
      pending = null;
    }
  };
  for (const block of blocks) {
    if (block.type === "subheading") {
      flush();
      pending = { type: "subheading-group", heading: block, bullets: [] };
      continue;
    }
    if (pending) {
      pending.bullets.push(block);
      continue;
    }
    if (block.type === "itemize") {
      out.push({ type: "itemize", items: block.items });
    } else if (block.type === "paragraph") {
      out.push({ type: "paragraph", content: block.content });
    }
  }
  flush();
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
