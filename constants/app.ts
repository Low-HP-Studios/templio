export type ShowcaseTemplate = "portfolio" | "studio" | "community" | "founder";

export interface ShowcaseSite {
  id: "ayush" | "bikram" | "arnold" | "lowhp" | "lunaticladz";
  href: string;
  urlLabel: string;
  template: ShowcaseTemplate;
  preview: string;
  fullPagePreview: string;
  accent: string;
  accentRgb: string;
}

export const APP_NAME = "Templio";

export const SHOWCASE_SITES: ShowcaseSite[] = [
  {
    id: "ayush",
    href: "https://www.ayush.im/",
    urlLabel: "ayush.im",
    template: "founder",
    preview: "/previews/ayush.im.png",
    fullPagePreview: "/full-page-previews/ayush.im.png",
    accent: "#a78bfa",
    accentRgb: "167,139,250",
  },
  {
    id: "bikram",
    href: "https://www.bikram.templio.app/",
    urlLabel: "bikram.templio.app",
    template: "portfolio",
    preview: "/previews/bikram.png",
    fullPagePreview: "/full-page-previews/bikram.png",
    accent: "#d6d3c1",
    accentRgb: "214,211,193",
  },
  {
    id: "arnold",
    href: "https://www.arnold.templio.app/",
    urlLabel: "arnold.templio.app",
    template: "portfolio",
    preview: "/previews/arnold.png",
    fullPagePreview: "/full-page-previews/Arnold.png",
    accent: "#f59e0b",
    accentRgb: "245,158,11",
  },
  {
    id: "lowhp",
    href: "https://www.lowhp.studio/",
    urlLabel: "lowhp.studio",
    template: "studio",
    preview: "/previews/lowhp.png",
    fullPagePreview: "/full-page-previews/Low-hp-studio.png",
    accent: "#22d3ee",
    accentRgb: "34,211,238",
  },
  {
    id: "lunaticladz",
    href: "https://lunaticladz.com/",
    urlLabel: "lunaticladz.com",
    template: "community",
    preview: "/previews/lunaticladz.png",
    fullPagePreview: "/full-page-previews/Lunatic-ladz.png",
    accent: "#f97316",
    accentRgb: "249,115,22",
  },
];
