/**
 * IProfile — An accessibility profile is a named preset
 * that applies a collection of tool states at once.
 */
export interface IProfile {
  /** Unique profile ID, e.g. "seizure-safe" */
  id: string;

  /** Human-readable label (translation key) */
  label: string;

  /** Brief description of what this profile does */
  description: string;

  /** Icon identifier for rendering */
  icon: string;

  /** Predefined tool states this profile applies */
  states: Record<string, unknown>;
}
