import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PortfolioRouteShell({
  eyebrow,
  title,
  description,
  contentClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black pt-14 text-[#f0eaff]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="hud-window p-5 sm:p-6">
          <span className="bootline">{eyebrow}</span>
          <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.2em] text-[#f0eaff] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9b87c0] sm:text-base">
              {description}
            </p>
          ) : null}
        </header>
      </div>
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
