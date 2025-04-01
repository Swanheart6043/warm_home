import { request } from 'umi'

/**
 * 分页获取未分配设备
 * @param params
 * @returns
 */
export const paginationUnassignedDevice = async (params?: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params ?? {}
  const result = await request<Pagination<DeviceGroup>>('/api-equip/tbdevice/listUnAssignedDevice', {
    method: 'GET',
    params: { pageNum: current, pageSize: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

/**
 * 获取可分配设备的人员
 * @param params
 * @returns
 */
export const fetchUserWhoCanAssignedDevice = async () => {
  const result = await request<OptionalResultList<DeviceAssignedUser>>('/api-equip/tbdevice/findUserList', {
    method: 'GET'
  })
  return result.datas ?? []
}

/**
 * 分配设备
 * @param params
 * @returns
 */
export const assignDevice = async (data: DeviceAssignRequest) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbdevice/assignDevice', {
    method: 'POST',
    data
  })
  return result
}

/**
 * 批量分配设备
 * @param data
 * @returns
 */
export const batchAssignDevice = async (data: { deviceList: DeviceAssignRequest[] }) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbdevice/batchAssignDevice', {
    method: 'POST',
    data
  })
  return result
}

/**
 * 删除未分配设备
 * @param id
 * @returns
 */
export const removeUnassignedDevice = async (id: number) => {
  const result = await request<OptionalResult<null>>(`/api-equip/tbdevicegroups/${id}`, {
    method: 'DELETE'
  })
  return result
}
