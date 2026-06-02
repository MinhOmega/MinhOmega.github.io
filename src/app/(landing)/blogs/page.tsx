import { blogs } from "#site/content";
import Link from "next/link";

export default function BlogsPage() {
  const publishedBlogs = blogs
    .filter((blog) => blog.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const groupedByYear = publishedBlogs.reduce(
    (acc, blog) => {
      const year = new Date(blog.date).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(blog);
      return acc;
    },
    {} as Record<number, typeof publishedBlogs>,
  );

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="mt-10 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        {publishedBlogs.length} articles on web development, AI, DevOps, and
        software engineering.
      </p>

      {years.map((year) => (
        <section key={year} className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
            {year}
          </h2>
          <div className="space-y-4">
            {groupedByYear[year].map((blog) => (
              <Link
                key={blog.slugAsParams}
                href={`/blogs/${blog.slugAsParams}`}
                className="group block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {blog.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <time
                    dateTime={blog.date}
                    className="shrink-0 text-xs text-muted-foreground"
                  >
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
