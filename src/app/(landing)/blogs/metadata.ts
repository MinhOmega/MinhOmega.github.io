import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = `Blog | ${siteConfig.creator.name}`;
  const description = `Technical blog by ${siteConfig.creator.name} covering web development, AI engineering, DevOps, TypeScript, React, Next.js, and modern software engineering.`;

  const ogUrl = new URL(`${siteConfig.siteUrl}/og`);
  ogUrl.searchParams.set("heading", "Blog");
  ogUrl.searchParams.set("type", "Blog");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title,
    description,
    keywords: [
      ...siteConfig.keywords,
      "Blog",
      "Articles",
      "Web Development",
      "AI Engineering",
      "DevOps",
      "TypeScript",
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/blogs`,
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