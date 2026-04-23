export interface ShowcaseSite {
  name: string;
  href: string;
  urlLabel: string;
  category: string;
  description: string;
}

export const APP_NAME = "Templio";
export const APP_TITLE = "Templio - Custom websites, built with care";
export const APP_DESCRIPTION =
  "Custom websites for people who still care how the web feels. Pitch an idea. If it's interesting, we build it together.";

export const HERO_COPY = {
  tagline: "Custom websites for people who still care how the web feels.",
  subline: "Pitch me an idea. If it's interesting, we build it together.",
};

export const MANIFESTO = {
  kicker: "The deal",
  heading: "Most websites are the same template in a different color.",
  body1:
    "Templio is for the people still excited about the web. The ones who notice a good hover state, a weird font choice, a layout that isn't trying to be Linear.",
  body2:
    "Pitch me an idea. If it's interesting, we build it - for free, together, at whatever pace works. No invoices, no sales calls, no templates.",
  finePrint:
    "I take on a few of these at a time, so it might take a minute to hear back. I read every pitch.",
};

export const FORM_COPY = {
  ideaPlaceholder: "What do you want to build?",
  emailPlaceholder: "Your email",
  helper: "Free. No catch. I just love building these.",
  nextLabel: "Next",
  submitLabel: "Send the pitch",
  editIdeaLabel: "Edit idea",
  idleMessage:
    "A weird portfolio, a fan site, a dumb-but-beautiful microsite - anything goes. Free, I promise.",
  emailStepMessage: "Last one - where should I reach you?",
  successMessage: "Got it. I'll read it properly and reach out. Thank you.",
  alreadyExistsMessage:
    "You've already pitched - I haven't forgotten. Promise.",
  errorMessage: "Something broke on my end. Try again?",
};

export const SHOWCASE_COPY = {
  kicker: "Take a closer look",
  heading: "Every one started as a pitch.",
  subheading:
    "Full descriptions, categories, and live links to the sites currently up.",
};

export const SHOWCASE_NOTE = "More in progress. Yours could be here.";

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
