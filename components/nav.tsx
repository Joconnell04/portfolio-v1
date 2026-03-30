"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ROUTES = [
  { href: "/home", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/travel", label: "Travel" },
  { href: "/recruiter", label: "Recruiter" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="text-[11px] uppercase tracking-[0.28em] text-[#f0eaff] transition-colors duration-150 hover:text-[#a855f7]"
        >
          Jackson O&apos;Connell
        </Link>
        <div className="flex items-center gap-0.5 text-[10px] uppercase tracking-[0.22em]">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "px-3 py-1.5 transition-colors duration-150",
                pathname === route.href
                  ? "text-[#a855f7]"
                  : "text-white/40 hover:text-white/80",
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
