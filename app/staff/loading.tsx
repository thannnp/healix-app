import { Activity } from "lucide-react";

export default function StaffLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/15" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="h-5 w-48 rounded bg-white/20 animate-pulse" />
              <div className="mt-2 h-3 w-32 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
