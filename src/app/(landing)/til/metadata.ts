import { tils } from "#site/content";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const description = `Hey, I'm ${
    siteConfig.creator.name
  }. This is my learning journal where I document interesting things I learn each day. Here are some recent learnings:
    ${tils
      .slice(0, 5)
      .map((til) => {
        return `${new Date(til.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`;
      })
      .join("\n")}
    `;
  
  const title = `Today I Learned | ${siteConfig.creator.name}`;
  const ogUrl = new URL(`${siteConfig.siteUrl}/og`);
  ogUrl.searchParams.set("heading", "Today I Learned");
  ogUrl.searchParams.set("type", "TIL");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, "TIL", "Today I Learned", "Learning Journal"],
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/til`,
      siteName: siteConfig.name,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.creator.url,
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
} 