export default function BlogsLoading() {
  return (
    <div className="mt-10 max-w-2xl">
      <div className="h-8 w-48 bg-secondary rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-64 bg-muted rounded animate-pulse mb-8" />

      {Array.from({ length: 3 }).map((_, yearIdx) => (
        <div key={yearIdx} className="mb-10">
          <div className="h-6 w-16 bg-muted rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, postIdx) => (
              <div
                key={postIdx}
                className="rounded-lg border p-4"
              >
                <div className="h-5 w-3/4 bg-secondary rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse mb-2" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-secondary rounded animate-pulse" />
                  <div className="h-5 w-18 bg-secondary rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
