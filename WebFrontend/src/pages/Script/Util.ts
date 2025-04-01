import { ValueJson, ValueJsonBeforeSubmission } from "./Typings"

export const addIdForValueJson = (valueJson: ValueJsonBeforeSubmission[]) => {
  const result: ValueJson[] = valueJson.map((item, index) => ({ ...item, id: String(index) }))
  return result
}

export const matchUserForValueJson = (currentUser?: CurrentUser) => {
  return currentUser?.roles?.some(item => item.roleId !== 3) ? String(currentUser?.id) : null
}

export const matchTenantForValueJson = (currentUser?: CurrentUser) => {
  return currentUser?.roles?.some(item => item.roleId === 3) ? currentUser.deptId : null
}
