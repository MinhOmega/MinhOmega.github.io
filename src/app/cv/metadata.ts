import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const ogUrl = new URL(`${siteConfig.siteUrl}/og`);
  ogUrl.searchParams.set("heading", "Curriculum Vitae");
  ogUrl.searchParams.set("type", "CV");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: `CV | ${siteConfig.creator.name}`,
    description: "Front-end Engineer with expertise in React, Next.js, React Native, and modern web technologies",
    keywords: ["Front-end Engineer", "React", "Next.js", "React Native", "JavaScript", "TypeScript", "Web Development", "Mobile Development", "Full-stack Engineer", "Software Engineer", "Developer", "Engineering", "Front-end", "Developer"],
    authors: [{ name: "VO NGOC QUANG MINH" }],
    openGraph: {
      title: `CV | ${siteConfig.creator.name}`,
      description: "Front-end Engineer with expertise in React, Next.js, React Native, and modern web technologies",
      type: "article",
      url: `${siteConfig.siteUrl}/cv`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: "CV" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `CV | ${siteConfig.creator.name}`,
      description: "Front-end Engineer with expertise in React, Next.js, React Native, and modern web technologies",
      images: [ogUrl.toString()],
    },
  };
} 