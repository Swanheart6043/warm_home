import { request } from 'umi'

/**
 * 获取所有设备
 * @param params
 * @returns
 */
export const fetchAllDevice = async (keyword?: string, groupId?: number) => {
  const result = await request<OptionalResult<Device[]>>('/api-equip/tbdevice/deviceList', {
    method: 'GET',
    params: { keyword, groupId },
  })
  return result.datas ?? []
}

/**
 * 分页获取设备
 * @param params
 * @returns
 */
export const paginationDevice = async (params?: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params ?? {}
  const result = await request<Pagination<Device>>('/api-equip/tbdevice/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

/**
 * 新增设备
 * @param params
 * @returns
 */
export const createAndUpdateDevice = async (data: DeviceCreateOrUpdateRequest) => {
  const result = await request<OptionalResult<null>>(`/api-equip/tbdevice`, {
    method: 'POST',
    data
  })
  return result
}

/**
 * 查看设备
 * @param id
 * @param params
 * @returns
 */
export const readDevice = async (id: number) => {
  const result = await request<OptionalResult<Device>>(`/api-equip/tbdevice/${id}`, {
    method: 'GET',
  })
  return result.datas
}

/**
 * 删除设备
 * @param params
 * @returns
 */
export const removeDevice = async (id: number) => {
  const result = await request<OptionalResult<null>>(`/api-equip/tbdevice/${id}`, {
    method: 'DELETE'
  })
  return result
}

/**
 * 移动分组
 * @param params
 * @returns
 */
export const setDeviceGroup = async (data: DeviceMoveRequest) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbdevice/batchGroupDevice', {
    method: 'POST',
    data,
  })
  return result
}

/**
 * 导入设备
 * @param params
 * @returns
 */
export const importDevice = async (formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbdevice/import', {
    method: 'POST',
    requestType: 'form',
    data: formData,
  })
  return result
}

/**
 * 导出设备
 * @param params
 * @returns
 */
export const exportDevice = async () => {
  const result = await request<any>('/api-equip/tbdevice/export', {
    method: 'POST',
    responseType: 'blob'
  })
  return result
}
