"use client";

import { useEffect, useState } from "react";

export function useDesktopInteractions() {
  const [isDesktopInteractive, setIsDesktopInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsDesktopInteractive(query.matches);

    update();

    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return isDesktopInteractive;
}
