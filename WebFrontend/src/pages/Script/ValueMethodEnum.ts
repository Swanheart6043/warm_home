export enum ValueMethodEnum {
  Random = '随机',
  Order = '顺序',
}

export const matchValueMethod = (value?: number | string) => {
  if (value == ValueMethodEnum.Random) return 0
  if (value == ValueMethodEnum.Order) return 1
  return ''
}

export const matchValueMethodName = (value?: number | string) => {
  if (value == 0) return '随机'
  if (value == 1) return '顺序'
  return ''
}

export const buildValueMethodOptions = () => {
  return Object.values(ValueMethodEnum).map((key) => (
    { label: key, value: matchValueMethod(key) }
  ))
}

export const buildValueMethodForValueJson = () => {
  return buildValueMethodOptions().map(item => item.label)
}
