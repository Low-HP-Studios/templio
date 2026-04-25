export type ShowcaseTemplate = "portfolio" | "studio" | "community" | "founder";

export interface ShowcaseSite {
  id: "ayush" | "bikram" | "arnold" | "lowhp" | "lunaticladz";
  href: string;
  urlLabel: string;
  template: ShowcaseTemplate;
  preview: string;
}

export const APP_NAME = "Templio";

export const SHOWCASE_SITES: ShowcaseSite[] = [
  {
    id: "ayush",
    href: "https://www.ayush.im/",
    urlLabel: "ayush.im",
    template: "founder",
    preview: "/previews/ayush.im.png",
  },
  {
    id: "bikram",
    href: "https://www.bikram.templio.app/",
    urlLabel: "bikram.templio.app",
    template: "portfolio",
    preview: "/previews/bikram.png",
  },
  {
    id: "arnold",
    href: "https://www.arnold.templio.app/",
    urlLabel: "arnold.templio.app",
    template: "portfolio",
    preview: "/previews/arnold.png",
  },
  {
    id: "lowhp",
    href: "https://www.lowhp.studio/",
    urlLabel: "lowhp.studio",
    template: "studio",
    preview: "/previews/lowhp.png",
  },
  {
    id: "lunaticladz",
    href: "https://lunaticladz.com/",
    urlLabel: "lunaticladz.com",
    template: "community",
    preview: "/previews/lunaticladz.png",
  },
];
