export const GameName = {
  'bl1': 'Borderlands 1',
  'bl2': 'Borderlands 2',
  'bl3': 'Borderlands 3',
  'tps': 'Borderlands: The Pre-Sequel',
  'gf': 'Godfall'
}

export const PlatformName = {
  'steam': 'Steam',
  'xbox': 'Xbox',
  'xboxlive': 'Xbox Live',
  'psn': 'Playstation',
  'epic': 'Epic Games',
  'stadia': 'Stadia'
}

export function isGameName(name: string | undefined): name is keyof typeof GameName {
  return typeof name === "string" && name in GameName;
}

export function isPlatformName(name: string | undefined): name is keyof typeof PlatformName {
  return typeof name === "string" && name in PlatformName;
}
