import type { Experience } from "@/types";

export const experiencesConfig: Experience[] = [
  {
    title: "AI Engineer",
    employmentType: "Full time",
    company: {
      name: "NEUROND AI",
      url: "https://www.neurond.com/",
    },
    location: {
      name: "On-site",
    },
    start: "May 2025",
    end: "Present",
    description: [
      "Architect and drive end-to-end delivery of the Enterprise AI Assistant Platform, owning roadmap, architecture, and stakeholder alignment across product, design, and engineering",
      "Designed a multi-tenant SaaS with PostgreSQL row-level security, Redis tenant cache, and Drizzle ORM",
      "Built Chain-of-RAG on pgvector + HNSW for iterative retrieval and semantic search over enterprise knowledge bases",
      "Integrated multi-provider LLM orchestration (OpenAI, Anthropic, Google, XAI, MCP) with streaming UX and tool-calling agents",
      "Wired Azure Entra ID SSO, Key Vault, Blob Storage, plus SharePoint and OneDrive ingestion",
      "Champion AI-Native engineering across the team — Claude Code and Cursor for code generation, automated unit / e2e tests, and structured implementation planning",
      "Tech: Next.js 16, React 19, TypeScript, PostgreSQL/pgvector, Drizzle, Redis, Vercel AI SDK, Azure"
    ],
  },
  {
    title: "Software Engineer",
    employmentType: "Full time",
    company: {
      name: "SNAPTEC VIETNAM",
      url: "https://snaptec.co/home.html",
    },
    location: {
      name: "On-site",
    },
    start: "September 2019",
    end: "April 2025",
    description: [
      "Led development of SaaS Theme - a customizable website solution with dynamic components and country-specific payment methods",
      "Achieved A scores on GTmetrix through performance optimizations (code splitting, lazy loading, caching)",
      "Rebuilt the MID admin dashboard — replaced Magento with a custom Next.js console and migrated REST APIs to GraphQL via AWS AppSync",
      "Built PWA Magento e-commerce platform with optimized developer and user experiences",
      "Drove sprint planning, code reviews, and architecture decisions across squads; mentored junior engineers on Next.js and performance best practices",
      "Tech: NextJS, React, TypeScript, Redux, AWS (S3, Map, AppSync), GraphQL"
    ],
    achievement: "HERO OF THE YEARS (August 2021)",
  },
  {
    title: "Freelance Developer",
    employmentType: "Freelance",
    company: {
      name: "Instasalon",
      url: "https://instasalon.net/",
    },
    location: {
      name: "Remote",
    },
    start: "August 2021",
    end: "November 2023",
    description: [
      "Developed scheduling and management system for US nail salons using React Native",
      "Implemented real-time chat, appointment scheduling, drag-and-drop, in-app purchases",
      "Built offline capabilities and responsive tablet UI based on Figma prototypes",
      "Successfully published apps on Google Play and AppStore",
      "Tech: React Native, TypeScript, Redux, Firebase"
    ],
  },
  {
    title: "Founder",
    employmentType: "Self-employed",
    company: {
      name: "Personal SaaS",
      url: "https://release.scodenjnja.store/en",
    },
    location: {
      name: "Remote",
    },
    start: "May 2024",
    end: "Present",
    description: [
      "Building e-commerce and sales management platform for SMBs",
      "Implemented server-side rendering and static generation with Next.js 14",
      "Developed responsive UI with TailwindCSS, animations, and form validation",
      "Tech: Next.js, TypeScript, MongoDB, Prisma ORM, Redux, TailwindCSS, Docker"
    ],
  },
];