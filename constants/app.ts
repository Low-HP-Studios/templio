export interface ShowcaseSite {
  name: string;
  href: string;
  urlLabel: string;
  category: string;
  description: string;
}

export const APP_NAME = "Templio";
export const APP_STAGE = "Beta";
export const APP_TITLE = "Templio - Invite-Only Website Builder";
export const APP_DESCRIPTION =
  "An invite-only beta website builder for custom portfolios, studio sites, and community hubs. No templates, just your taste.";
export const LAUNCH_DATE = "Invite-only beta";
export const SHOWCASE_NOTE = "More coming next month.";

export const SHOWCASE_SITES: ShowcaseSite[] = [
  {
    name: "Bikramdeep Singh",
    href: "https://www.bikram.templio.app/",
    urlLabel: "bikram.templio.app",
    category: "Portfolio",
    description:
      "A data-focused portfolio with editorial typography, layered atmospherics, and a polished contact surface.",
  },
  {
    name: "Arnold Kevin Desouza",
    href: "https://www.arnold.templio.app/",
    urlLabel: "arnold.templio.app",
    category: "Portfolio",
    description:
      "A bold single-page profile with strong identity, sharp type choices, and a stripped-back hero-led experience.",
  },
  {
    name: "Low HP Studio",
    href: "https://www.lowhp.studio/",
    urlLabel: "lowhp.studio",
    category: "Studio",
    description:
      "A studio landing page tuned for product storytelling, calm pacing, and crisp product positioning.",
  },
  {
    name: "LunaticLadz",
    href: "https://lunaticladz.com/",
    urlLabel: "lunaticladz.com",
    category: "Community",
    description:
      "A community-driven site built around streams, updates, and social hooks with a louder visual personality.",
  },
];
