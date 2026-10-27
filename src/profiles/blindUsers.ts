import type { IProfile } from '../types/IProfile'

export const blindUsersProfile: IProfile = {
  id: 'blind-users',
  label: 'profiles.blindUsers',
  description: 'profiles.blindUsersDesc',
  icon: 'blind-users',
  states: {
    fontSize: 2.0,
    'font-weight': true,
    contrast: 'high-contrast',
    'big-cursor': true,
    'visible-focus': true,
    'stop-animations': true,
  },
}
