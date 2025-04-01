export enum PlatformEnum {
  TK = 'TK',
  INS = 'INS',
  FB = 'FB',
  YT = 'YT',
  TW = 'TW'
}

export const buildPlatformOptions = () => {
  const options = Object.keys(PlatformEnum).map(key => ({
    label: key,
    value: PlatformEnum[key as keyof typeof PlatformEnum]
  }))
  return options
}
