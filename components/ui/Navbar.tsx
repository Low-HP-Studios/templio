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
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.svg"
            alt="Templio"
            width={28}
            height={28}
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
        </Link>
        <div className="text-sm sm:text-base md:text-base">
          <NavLink href="/contact">Contact</NavLink>
        </div>
      </Container>
    </nav>
  );
}
