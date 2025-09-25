export const GameName = {
  'bl1': 'Borderlands 1',
  'bl2': 'Borderlands 2',
  'bl3': 'Borderlands 3',
  'bl4': 'Borderlands 4',
  'tps': 'Borderlands: The Pre-Sequel',
  'gf': 'Godfall',
  'ttw': 'Tiny Tina\'s Wonderlands',
  'ntb': 'New Tales of the Borderlands'
}

export const PlatformName = {
  'steam': 'Steam',
  'xbox': 'Xbox',
  'psn': 'Playstation',
  'epic': 'Epic Games',
  'stadia': 'Stadia'
}

export type IGameName = keyof typeof GameName;

export type IPlatformName = keyof typeof PlatformName;

export function isGameName(name: string | undefined): name is keyof typeof GameName {
  return typeof name === "string" && name in GameName;
}

export function isPlatformName(name: string | undefined): name is keyof typeof PlatformName {
  return typeof name === "string" && name in PlatformName;
}
