import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/home", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/travel", label: "Travel" },
] as const;

export function PortfolioRouteShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-[#e8ffe7]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="hud-window p-4 sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="bootline">{eyebrow}</span>
              <h1 className="text-3xl font-semibold uppercase tracking-[0.24em] text-[#f3fff6] sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[#a6ffbf] sm:text-base">{description}</p>
            </div>
            <nav className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#8bffbc]">
              {ROUTES.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "hud-button inline-flex items-center border border-[#00ff87]/60 bg-black px-3 py-2 text-[#ebfff1] transition hover:-translate-y-0.5",
                    "rounded-none"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
