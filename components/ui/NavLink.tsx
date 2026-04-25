"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { usePathname } from "@/i18n/navigation";

interface NavLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function NavLink({ children, href, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : href?.toString() || "";
  const isExternal =
    hrefString.startsWith("http://") || hrefString.startsWith("https://");
  const isActive =
    !isExternal &&
    (pathname === hrefString || pathname.startsWith(`${hrefString}/`));

  const className = `group relative inline-block transition-colors hover:text-white ${
    isActive ? "font-bold text-white" : ""
  }`;

  if (isExternal) {
    return (
      <a
        href={hrefString}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <span className="absolute bottom-0 left-0 h-px w-full bg-white transition-transform duration-300 ease-out origin-left scale-x-0 group-hover:scale-x-100" />
      </a>
    );
  }

  return (
    <Link href={href} {...props} className={className}>
      {children}
      <span
        className={`absolute bottom-0 left-0 h-px w-full bg-white transition-transform duration-300 ease-out ${
          isActive
            ? "scale-x-100 origin-left"
            : "origin-left scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}
