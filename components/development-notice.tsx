"use client";

import { usePathname } from "next/navigation";

export function DevelopmentNotice() {
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <div className="sticky bottom-0 left-0 w-full bg-yellow-500 text-white text-center p-4 shadow-lg z-50">
      <p className="font-bold text-lg">
        🚧 Сайтът е в процес на разработка. Очаквайте скоро! 🚀
      </p>
    </div>
  );
}
