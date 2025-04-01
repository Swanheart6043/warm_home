import { request } from 'umi'

/**
 * 获取所有设备分组
 * @returns
 */
export const fetchAllDeviceGroup = async () => {
  const result = await request<Pagination<DeviceGroup>>('/api-equip/tbdevicegroups/list', {
    method: 'GET',
    params: { page: 1, limit: 99999 },
  })
  return result.data ?? []
}

/**
 * 获取设备分组列表
 * @param params
 * @returns
 */
export const paginationDeviceGroup = async (params?: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params ?? {}
  const result = await request<Pagination<DeviceGroup>>('/api-equip/tbdevicegroups/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

/**
 * 创建分组
 * @param params
 * @returns
 */
export const createAndUpdateDeviceGroup = async (data: DeviceGroup) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbdevicegroups/saveOrUpdate', {
    method: 'POST',
    data,
  })
  return result
}

/**
 * 删除分组
 * @param id
 * @returns
 */
export const removeDeviceGroup = async (id: number) => {
  const result = await request<OptionalResult<null>>(`/api-equip/tbdevicegroups/${id}`, {
    method: 'DELETE'
  })
  return result
}
