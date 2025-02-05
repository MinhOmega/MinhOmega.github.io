import type { Experience } from "@/types";

export const experiencesConfig: Experience[] = [
  {
    title: "Front-end Engineer",
    employmentType: "Full time",
    company: {
      name: "SNAPTEC VIETNAM",
      url: "https://snaptec.co/home.html",
    },
    location: {
      name: "On-site",
    },
    start: "September 2019",
    end: "Present",
    description: [
      "Led development of SaaS Theme - a customizable website solution with dynamic components and country-specific payment methods",
      "Achieved A scores on GTmetrix through performance optimizations (code splitting, lazy loading, caching)",
      "Developed MID Dashboard with GraphQL/AWS AppSync integration, reducing Magento admin dependency",
      "Built PWA Magento e-commerce platform with optimized developer and user experiences",
      "Mentored junior developers, conducted code reviews, and provided system improvement consultations",
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