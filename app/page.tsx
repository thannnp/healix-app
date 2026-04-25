import Link from "next/link";
import { ClipboardList, Monitor, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-primary px-6 py-20 text-center text-primary-foreground overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3" />
        </div>

        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Heart className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Healix
            </h1>
          </div>

          <p className="text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
            Real-time patient intake system.
            <br className="hidden sm:block" />
            Seamless registration, instant staff monitoring.
          </p>

          {/* CTA buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/patient"
              className="group flex h-14 items-center gap-3 rounded-2xl bg-white px-8 text-base font-semibold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <ClipboardList className="h-5 w-5 transition-transform group-hover:scale-110" />
              Patient Form
            </Link>
            <Link
              href="/staff"
              className="group flex h-14 items-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5"
            >
              <Monitor className="h-5 w-5 transition-transform group-hover:scale-110" />
              Staff Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
