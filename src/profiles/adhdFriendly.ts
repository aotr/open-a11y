import type { IProfile } from "../types/IProfile";

export const adhdFriendlyProfile: IProfile = {
  id: "adhd-friendly",
  label: "profiles.adhdFriendly",
  description: "profiles.adhdFriendlyDesc",
  icon: "adhd-friendly",
  states: {
    "focus-mode": true,
    "stop-animations": true,
    "reading-guide": false,
    "reading-ruler": true,
    lineHeight: 1.6,
    "visible-focus": true,
  },
};
