import { ScriptTypeEnum } from "./ScriptTypeEnum"

export interface ValueJsonBeforeSubmission {
  type: string
  key: string
  value: string | undefined | null | ScriptTypeEnum
  options: string[]
}

export interface ValueJson extends ValueJsonBeforeSubmission {
  id: string
}
