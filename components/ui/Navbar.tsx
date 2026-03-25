import Link from "next/link";
import Image from "next/image";
import { Container, NavLink } from "@/components/ui";

export function Navbar() {
  return (
    <nav className="relative z-10 w-full">
      <Container
        size="lg"
        className="flex items-center justify-between py-4 sm:py-5 md:py-6"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/logo.svg"
              alt="Templio"
              width={28}
              height={28}
              className="h-7 w-7 sm:h-8 sm:w-8"
            />
          </Link>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-medium sm:text-xs">
            Beta
          </span>
        </div>
        <div className="text-sm sm:text-base md:text-base">
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </Container>
    </nav>
  );
}
