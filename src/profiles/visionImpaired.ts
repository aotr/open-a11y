import type { IProfile } from '../types/IProfile'

export const visionImpairedProfile: IProfile = {
  id: 'vision-impaired',
  label: 'profiles.visionImpaired',
  description: 'profiles.visionImpairedDesc',
  icon: 'vision-impaired',
  states: {
    fontSize: 1.5,
    'font-weight': true,
    contrast: 'high-contrast',
    'big-cursor': true,
    'visible-focus': true,
    'highlight-links': true,
    'highlight-title': true,
  },
}
