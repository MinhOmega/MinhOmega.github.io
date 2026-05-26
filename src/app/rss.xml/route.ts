import { projects, tils } from "#site/content";
import { siteConfig } from "@/config/site.config";
import { portfolioConfig } from "@/config/portfolio.config";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (date: Date | string) => new Date(date).toUTCString();

type FeedItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: string;
  category: string;
};

export function GET() {
  const origin = siteConfig.origin.replace(/\/$/, "");

  const projectItems: FeedItem[] = projects.map((project) => ({
    title: project.title,
    link: `${origin}/projects/${project.slugAsParams}`,
    guid: `${origin}/projects/${project.slugAsParams}`,
    pubDate: toRfc822(project.date),
    description: project.description,
    category: "Project",
  }));

  const tilItems: FeedItem[] = tils.map((til) => ({
    title: `TIL — ${new Date(til.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    link: `${origin}/til#${til.slugAsParams}`,
    guid: `${origin}/til/${til.slugAsParams}`,
    pubDate: toRfc822(til.date),
    description: `Today I Learned entry from ${new Date(til.date).toDateString()}.`,
    category: "TIL",
  }));

  const items = [...projectItems, ...tilItems]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50);

  const lastBuildDate = items[0]?.pubDate ?? new Date().toUTCString();

  const itemsXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${portfolioConfig.name} — Projects & TIL`)}</title>
    <link>${origin}</link>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
