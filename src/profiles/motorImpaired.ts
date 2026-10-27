import type { IProfile } from "../types/IProfile";

export const motorImpairedProfile: IProfile = {
  id: "motor-impaired",
  label: "profiles.motorImpaired",
  description: "profiles.motorImpairedDesc",
  icon: "motor-impaired",
  states: {
    "big-cursor": true,
    "visible-focus": true,
    "stop-animations": true,
    "reduced-motion": true,
    "reading-guide": true,
  },
};
