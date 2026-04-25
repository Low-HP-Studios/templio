import type { ShowcaseSite } from "@/constants";

type AccentName = "sky" | "amber" | "rose" | "emerald";

interface ShowcaseMockupProps {
  site: ShowcaseSite;
  name: string;
  categoryLabel: string;
  accent?: AccentName;
  className?: string;
}

const ACCENTS: Record<
  AccentName,
  { glow: string; block: string; dot: string; pill: string; ring: string }
> = {
  sky: {
    glow: "from-sky-400/25",
    block: "bg-sky-400/20",
    dot: "bg-sky-300",
    pill: "bg-sky-400/15 text-sky-200 border-sky-300/20",
    ring: "ring-sky-400/30",
  },
  amber: {
    glow: "from-amber-400/25",
    block: "bg-amber-400/20",
    dot: "bg-amber-300",
    pill: "bg-amber-400/15 text-amber-200 border-amber-300/20",
    ring: "ring-amber-400/30",
  },
  rose: {
    glow: "from-rose-400/25",
    block: "bg-rose-400/20",
    dot: "bg-rose-300",
    pill: "bg-rose-400/15 text-rose-200 border-rose-300/20",
    ring: "ring-rose-400/30",
  },
  emerald: {
    glow: "from-emerald-400/25",
    block: "bg-emerald-400/20",
    dot: "bg-emerald-300",
    pill: "bg-emerald-400/15 text-emerald-200 border-emerald-300/20",
    ring: "ring-emerald-400/30",
  },
};

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

function PortfolioBody({ name, accent }: { name: string; accent: AccentName }) {
  const a = ACCENTS[accent];
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${a.glow} via-transparent to-transparent`}
      />
      <span
        className="relative font-display text-6xl leading-none text-white/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]"
        aria-hidden
      >
        {getInitial(name)}
      </span>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-zinc-500">
        <span>Est. 2026</span>
        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
      </div>
    </div>
  );
}

function StudioBody({ accent }: { accent: AccentName }) {
  const a = ACCENTS[accent];
  return (
    <div className="flex h-full gap-3 p-3">
      <div
        className={`relative flex-1 overflow-hidden rounded-md border border-white/10 ${a.block}`}
      >
        <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-white/30" />
        <div className="absolute inset-x-2 top-4 h-1 w-1/2 rounded-full bg-white/15" />
        <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-white/20" />
      </div>
      <div className="flex w-1/2 flex-col justify-center gap-1.5">
        <div className="h-1.5 w-10 rounded-full bg-white/35" />
        <div className="h-1 w-16 rounded-full bg-white/15" />
        <div className="h-1 w-12 rounded-full bg-white/15" />
        <div
          className={`mt-2 inline-flex h-4 w-14 items-center justify-center rounded-full border text-[8px] uppercase tracking-widest ${a.pill}`}
        >
          Ship
        </div>
      </div>
    </div>
  );
}

function CommunityBody({ accent }: { accent: AccentName }) {
  const a = ACCENTS[accent];
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-3">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          <div className="h-6 w-6 rounded-full border border-black/40 bg-gradient-to-br from-zinc-200 to-zinc-400" />
          <div className="h-6 w-6 rounded-full border border-black/40 bg-gradient-to-br from-zinc-300 to-zinc-500" />
          <div className="h-6 w-6 rounded-full border border-black/40 bg-gradient-to-br from-zinc-100 to-zinc-300" />
        </div>
        <div
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest ${a.pill}`}
        >
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${a.dot}`} />
          Live
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-1.5 w-3/4 rounded-full bg-white/30" />
        <div className="h-1 w-2/3 rounded-full bg-white/15" />
        <div className="h-1 w-1/2 rounded-full bg-white/15" />
      </div>
    </div>
  );
}

function MockupBody({
  site,
  name,
  accent,
}: {
  site: ShowcaseSite;
  name: string;
  accent: AccentName;
}) {
  switch (site.template) {
    case "portfolio":
    case "founder":
      return <PortfolioBody name={name} accent={accent} />;
    case "studio":
      return <StudioBody accent={accent} />;
    case "community":
      return <CommunityBody accent={accent} />;
    default:
      return <PortfolioBody name={name} accent={accent} />;
  }
}

export function ShowcaseMockup({
  site,
  name,
  categoryLabel,
  accent = "sky",
  className = "",
}: ShowcaseMockupProps) {
  const a = ACCENTS[accent];
  return (
    <div
      className={`group relative w-[240px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/75 shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:ring-2 ${a.ring} sm:w-[260px] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-zinc-950/60 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-amber-400/70" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 truncate rounded-md bg-white/5 px-2 py-0.5 text-center text-[10px] font-medium tracking-tight text-zinc-400">
          {site.urlLabel}
        </div>
      </div>

      <div className="relative h-[128px] overflow-hidden bg-gradient-to-b from-zinc-950 to-zinc-900">
        <MockupBody site={site} name={name} accent={accent} />
      </div>

      <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950/60 px-3 py-2">
        <span className="truncate text-xs font-medium text-white">{name}</span>
        <span className="shrink-0 text-[9px] uppercase tracking-[0.24em] text-zinc-500">
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}
