export enum ModeEnum {
  Create = 'create',
  Edit = 'update',
}

export const isCreate = (value?: ModeEnum | string) => value === ModeEnum.Create

export const isEdit = (value?: ModeEnum | string) => value === ModeEnum.Edit
