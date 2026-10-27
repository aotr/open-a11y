import type { IProfile } from "../types/IProfile";

export const seizureSafeProfile: IProfile = {
  id: "seizure-safe",
  label: "profiles.seizureSafe",
  description: "profiles.seizureSafeDesc",
  icon: "seizure-safe",
  states: {
    "stop-animations": true,
    "reduced-motion": true,
    contrast: false,
  },
};
