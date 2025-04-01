
interface Device {
  id?: number
  brand?: string
  comment?: string
  deviceId?: string
  deviceNo?: string
  gmtCreate?: string
  gmtModified?: string
  groupId?: number
  imei?: string
  isDeleted?: number
  mode?: string
  settings?: string
  status?: number
  tenantId?: number
  groupName?: string
  userName?: string
}

interface DeviceCreateOrUpdateRequest {
  id?: number;
  status: string;
  batch: number;
  deviceNo: string;
  deviceId: string;
  groupId: number;
  brand: string;
  mode: string;
  comment: string;
  imei?: string
  tenantId?: number
  status?: string
  isDeleted?: number
  settings?: string
}

interface DeviceMoveRequest {
  groupId: number
  ids: string[]
}
