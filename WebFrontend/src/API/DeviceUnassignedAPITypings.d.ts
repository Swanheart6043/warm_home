interface UnassignedDevice {
  id?: number
  assStatus?: number
  brand?: string
  comment?: string
  deviceId?: string
  deviceNo?: string
  gmtCreate?: string
  gmtModified?: string
  imei?: string
  ip?: string
  isDeleted?: number
  mode?: string
  osVersion?: string
  status?: number
  tenantId?: number
  userName?: string
}

interface DeviceAssignedUser {
  id?: number
  username?: string
}

interface DeviceAssignRequest {
  id: number;
  deviceNo: string
  deviceId: string
  tenantId: number
  groupId: number
  brand: string
  mode: string
  status: number
}
