import { siteConfig } from "@/config/site.config";
import { portfolioConfig } from "@/config/portfolio.config";
import { Socials } from "@/components/socials";
import Link from "next/link";
import ThemeToggler from "@/components/theme/toggler";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import { skillsConfig } from "@/config/skills.config";

export default function Hero() {
  return (
    <section className="w-full flex flex-col lg:min-h-[calc(100vh-7rem)]">
      <Link href="/">
        <span className="font-mono text-sm underline">{siteConfig.name}</span>
      </Link>
      <div className="flex justify-between items-center mt-6">
        <h1 className="head-text-sm">{portfolioConfig.name}</h1>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full" asChild>
            <Link href="/rss.xml">
              <Rss size={18} />
              <span className="sr-only">rss feed</span>
            </Link>
          </Button>
          <ThemeToggler />
        </div>
      </div>
      <h3 className="mt-2 text-lg">
        {portfolioConfig.tagline} <span className="sr-only">tagline</span>
      </h3>
      <p className="my-6 max-w-2xl text-foreground/80">
      Hey there 👋 I'm an AI Engineer with 7 years of experience building scalable web and mobile applications.
      Currently at <a href="https://www.neurond.com/" className="underline" target="_blank" rel="noopener noreferrer">Neurond AI</a> (May 2025 — present), architecting an Enterprise AI Assistant Platform with multi-tenant RAG on pgvector, multi-provider LLM orchestration, and Azure-native infrastructure.
      Previously spent 5+ years at SNAPTEC (Sep 2019 — Apr 2025), leading SaaS themes, admin dashboards, and e-commerce platforms — earned the Hero of the Year award in 2021.
      I specialize in TypeScript, React, Next.js, and AI-Native engineering with Claude Code and Cursor.
        <span className="sr-only">bio</span>
      </p>
      <Socials />
      <div className="hidden md:flex flex-col text-sm space-y-2 rounded max-w-2xl text-foreground/70 my-7">
        {skillsConfig.map((skill) => (
          <p key={skill.category}>
            <span className="font-semibold text-primary/90">{skill.category}:</span> {skill.technologies.join(", ")}
          </p>
        ))}
      </div>
    </section>
  );
}
