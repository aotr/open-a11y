import type { IProfile } from '../types/IProfile'

export const cognitiveDisabilityProfile: IProfile = {
  id: 'cognitive-disability',
  label: 'profiles.cognitiveDisability',
  description: 'profiles.cognitiveDisabilityDesc',
  icon: 'cognitive-disability',
  states: {
    'readable-font': true,
    letterSpacing: 1,
    lineHeight: 1.6,
    'font-weight': true,
    'highlight-links': true,
    'reading-guide': true,
  },
}
