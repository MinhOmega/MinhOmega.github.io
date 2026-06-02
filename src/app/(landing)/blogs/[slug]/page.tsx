import { blogs } from "#site/content";
import { MDXContentRenderer } from "@/components/mdx/mdx-content-renderer";
import { DashboardTableOfContents } from "@/components/mdx/toc";
import { siteConfig } from "@/config/site.config";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

async function getBlogFromParam(params: { slug: string }) {
  const slug = (await params).slug;
  const blog = blogs.find((blog) => blog.slugAsParams === slug);

  if (!blog || !blog.published) {
    return null;
  }
  return blog;
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const blog = await getBlogFromParam(params);

  if (!blog) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.siteUrl}/og`);
  ogUrl.searchParams.set("heading", blog.title);
  ogUrl.searchParams.set("type", "Blog Post");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: `${blog.title} | ${siteConfig.creator.name}`,
    description: blog.description,
    keywords: [...blog.tags, ...siteConfig.keywords, blog.title],
    authors: [{ name: blog.author }],
    openGraph: {
      title: `${blog.title} | ${siteConfig.creator.name}`,
      description: blog.description,
      type: "article",
      publishedTime: blog.date,
      authors: [blog.author],
      url: `${siteConfig.siteUrl}/blogs/${blog.slugAsParams}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | ${siteConfig.name}`,
      description: blog.description,
      images: [ogUrl.toString()],
    },
  };
}

export async function generateStaticParams(): Promise<
  BlogPageProps["params"][]
> {
  return blogs
    .filter((blog) => blog.published)
    .map((blog) => ({ slug: blog.slugAsParams }));
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlogFromParam(params);

  if (!blog) {
    notFound();
  }

  const toc = blog.toc ?? [];

  return (
    <main className="relative w-full min-h-screen p-0 sm:p-5">
      <div className="w-full h-full rounded-2xl sm:border flex flex-wrap justify-between lg:divide-x">
        <div className="relative w-full lg:w-2/5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto scrollbar-hide p-2 md:p-8 pb-16 lg:pb-20">
          <div className="flex justify-between mb-2 sticky top-0 z-10 bg-background">
            <Link href="/blogs" className="group/back text-xs">
              <ArrowLeft
                size={18}
                className="group-hover/back:-translate-x-1 transition-transform transform-gpu duration-100 ease-in-out"
              />
              <span className="sr-only">Back to blogs</span>
            </Link>
            <time
              dateTime={blog.date}
              className="px-2 py-1 text-xs rounded bg-secondary"
            >
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <h1 className="head-text-sm py-1 mt-6 mb-4">{blog.title}</h1>

          <p className="text-muted-foreground mb-6">{blog.description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded bg-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            By {blog.author}
          </p>

          {toc.length > 0 && (
            <div className="hidden lg:block">
              <DashboardTableOfContents toc={toc} />
            </div>
          )}
        </div>

        <article
          id="tab-section"
          className="relative w-full lg:w-3/5 p-2 md:p-8 pb-16 lg:pb-20"
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContentRenderer code={blog.body} />
          </div>
        </article>
      </div>
    </main>
  );
}
