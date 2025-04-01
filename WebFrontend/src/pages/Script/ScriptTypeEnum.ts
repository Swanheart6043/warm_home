export enum ScriptTypeEnum {
  Register = 1,
  Login = 2,
  MaintainAccount = 3,
  PublishVideo = 4,
  LiveBroadcastRoom = 5,
  PrivateMessage = 6,
  NetworkSettings = 7,
  ModifyAvatar = 9,
}

export const matchOperationType = (value?: number | string) => {
  if (value == ScriptTypeEnum.Register) return "注册账号"
  if (value == ScriptTypeEnum.Login) return "账号登录"
  if (value == ScriptTypeEnum.MaintainAccount) return "养号功能"
  if (value == ScriptTypeEnum.PublishVideo) return "视频发布"
  if (value == ScriptTypeEnum.LiveBroadcastRoom) return "直播维护"
  if (value == ScriptTypeEnum.PrivateMessage) return "留痕私信"
  if (value == ScriptTypeEnum.NetworkSettings) return "网络设置"
  if (value == ScriptTypeEnum.ModifyAvatar) return "修改头像"
  return ""
}

export const buildOperationTypeOptions = () => {
  const keys = Object.values(ScriptTypeEnum).filter(key => !isNaN(Number(key)))
  const result = keys.map((key) => ({ label: matchOperationType(key), value: String(key) }))
  return result
}

export const buildOperationTypeForValueJson = () => {
  const keys = Object.values(ScriptTypeEnum).filter(key => !isNaN(Number(key)))
  const step1 = keys.map((key) => matchOperationType(key))
  const step2 = [ ...step1, ...['随机养号', '指定养号', '标签养号'] ]
  const final = step2.filter(name => name !== '养号功能')
  return final
}
