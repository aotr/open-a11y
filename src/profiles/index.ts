import type { IProfile } from "../types/IProfile";
import { seizureSafeProfile } from "./seizureSafe";
import { visionImpairedProfile } from "./visionImpaired";
import { adhdFriendlyProfile } from "./adhdFriendly";
import { cognitiveDisabilityProfile } from "./cognitiveDisability";
import { keyboardNavigationProfile } from "./keyboardNavigation";
import { blindUsersProfile } from "./blindUsers";
import { motorImpairedProfile } from "./motorImpaired";

export { seizureSafeProfile } from "./seizureSafe";
export { visionImpairedProfile } from "./visionImpaired";
export { adhdFriendlyProfile } from "./adhdFriendly";
export { cognitiveDisabilityProfile } from "./cognitiveDisability";
export { keyboardNavigationProfile } from "./keyboardNavigation";
export { blindUsersProfile } from "./blindUsers";
export { motorImpairedProfile } from "./motorImpaired";

/** All profiles indexed by ID for quick lookup */
export const PROFILES: Record<string, IProfile> = {
  "seizure-safe": seizureSafeProfile,
  "vision-impaired": visionImpairedProfile,
  "adhd-friendly": adhdFriendlyProfile,
  "cognitive-disability": cognitiveDisabilityProfile,
  "keyboard-navigation": keyboardNavigationProfile,
  "blind-users": blindUsersProfile,
  "motor-impaired": motorImpairedProfile,
};
