import { experiencesConfig } from "@/config/experience.config";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const description = `Hey, I'm ${
    siteConfig.creator.name
  }. I've worked with a variety of companies and have experience in different roles. I've also made a few projects on my own. Here's a list of my work experience.
    ${experiencesConfig
      .map((exp) => {
        return `${exp.title} at ${exp.company.name}.`;
      })
      .join("\n")}
    `;
  const keywords = [
    ...siteConfig.keywords,
    "Experience",
    ...experiencesConfig.map((exp) => exp.company.name),
  ];
  const title = `Experience | ${siteConfig.creator.name}`;
  const og = `${siteConfig.siteUrl}/experience-og.png`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${siteConfig.siteUrl}/experience`,
      siteName: siteConfig.name,
      images: [
        {
          url: og,
          width: 1800,
          height: 1000,
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
      images: {
        url: og,
        width: 1800,
        height: 1000,
        alt: title,
      },
    },
  };
}
