export default function BlogPostLoading() {
  return (
    <main className="relative w-full lg:h-screen p-0 sm:p-5">
      <div className="w-full h-full rounded-2xl sm:border flex flex-wrap justify-between lg:divide-x">
        <div className="relative w-full lg:w-2/5 lg:h-full p-2 md:p-8">
          <div className="flex justify-between mb-2">
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-8 w-3/4 bg-secondary rounded-lg animate-pulse mt-6 mb-4" />
          <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-6" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
            <div className="h-6 w-20 bg-secondary rounded animate-pulse" />
            <div className="h-6 w-14 bg-secondary rounded animate-pulse" />
          </div>
        </div>
        <div className="relative w-full lg:h-full lg:w-3/5 p-2 md:p-8">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted rounded animate-pulse"
                style={{ width: `${70 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
