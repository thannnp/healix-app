export default function PatientLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-full bg-primary" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 pt-8 pb-16 sm:px-6">
        <div className="mb-4 h-5 w-16 rounded bg-white/20 animate-pulse" />

        {/* Step progress skeleton */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-2 flex-1 rounded-full bg-white/20 animate-pulse" />
          ))}
        </div>

        {/* Card skeleton */}
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 animate-pulse">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-5 w-36 rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-10 w-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
