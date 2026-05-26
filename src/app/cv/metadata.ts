import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const ogUrl = new URL(`${siteConfig.siteUrl}/og`);
  ogUrl.searchParams.set("heading", "Curriculum Vitae");
  ogUrl.searchParams.set("type", "CV");
  ogUrl.searchParams.set("mode", "dark");

  const description =
    "AI Engineer with 7 years building enterprise SaaS and Gen AI platforms. Currently at Neurond AI, leading a multi-tenant RAG platform with pgvector, MCP, and multi-provider LLM orchestration.";

  return {
    title: `CV | ${siteConfig.creator.name}`,
    description,
    keywords: [
      "AI Engineer",
      "Software Engineer",
      "RAG",
      "pgvector",
      "Next.js",
      "React",
      "TypeScript",
      "Azure",
      "MCP",
      "Vercel AI SDK",
      "Neurond AI",
      "Snaptec",
      "Resume",
      "CV",
    ],
    authors: [{ name: "VO NGOC QUANG MINH" }],
    openGraph: {
      title: `CV | ${siteConfig.creator.name}`,
      description,
      type: "article",
      url: `${siteConfig.siteUrl}/cv`,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: "CV" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `CV | ${siteConfig.creator.name}`,
      description,
      images: [ogUrl.toString()],
    },
  };
}
