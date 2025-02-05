import { tils } from "#site/content";
import { MDXContentRenderer } from "@/components/mdx/mdx-content-renderer";

export default function TILPage() {
  const sortedTils = tils.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="mt-10 max-w-2xl">
      {sortedTils.map((til, i) => (
        <div key={til.slugAsParams} className="relative pb-12">
          <span className="w-2 h-2 rounded-full bg-primary absolute top-3 -translate-y-1/2 left-2 -translate-x-1/2"></span>
          {i !== sortedTils.length - 1 && (
            <div className="w-[2px] h-full absolute top-3 left-2 -translate-x-1/2 bg-accent -z-10"></div>
          )}
          <span className="text-sm ml-5 px-2 py-1 rounded bg-secondary">
            {new Date(til.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <div className="ml-7 mt-4 prose prose-neutral dark:prose-invert">
            <MDXContentRenderer code={til.body} />
          </div>
        </div>
      ))}
    </div>
  );
} 