import { Fragment } from "react";
import type { InlineNode } from "@/lib/cv-latex";

export function InlineNodes({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <Fragment key={i}>
          <InlineOne node={node} />
        </Fragment>
      ))}
    </>
  );
}

function InlineOne({ node }: { node: InlineNode }) {
  switch (node.type) {
    case "text":
      return <>{node.value}</>;
    case "bold":
      return (
        <strong className="font-semibold">
          <InlineNodes nodes={node.children} />
        </strong>
      );
    case "italic":
      return (
        <em className="italic">
          <InlineNodes nodes={node.children} />
        </em>
      );
    case "link": {
      const external = /^https?:\/\//.test(node.href);
      return (
        <a
          href={node.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          <InlineNodes nodes={node.children} />
        </a>
      );
    }
    case "linebreak":
      return <br />;
  }
}
