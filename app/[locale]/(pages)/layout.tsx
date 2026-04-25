import { Navbar, Footer } from "@/components/ui";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PagesLayout({ children, params }: Props) {
  const { locale } = await params;
  if (hasLocale(routing.locales, locale)) {
    setRequestLocale(locale);
  }
  return (
    <div className="min-h-screen w-full">
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <Navbar />
      </div>

      {children}

      <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <Footer />
      </div>
    </div>
  );
}
