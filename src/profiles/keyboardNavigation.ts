import type { IProfile } from "../types/IProfile";

export const keyboardNavigationProfile: IProfile = {
  id: "keyboard-navigation",
  label: "profiles.keyboardNavigation",
  description: "profiles.keyboardNavigationDesc",
  icon: "keyboard-navigation",
  states: {
    "visible-focus": true,
    "big-cursor": true,
    "stop-animations": true,
  },
};
