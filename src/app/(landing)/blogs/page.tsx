export default function BlogsPage() {
  return (
    <div className="mt-10 max-w-2xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground">
          Coming soon! I&apos;m working on some interesting articles about web development, 
          technology, and my experiences as a developer. Stay tuned!
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          In development
        </div>
      </div>
    </div>
  );
} 