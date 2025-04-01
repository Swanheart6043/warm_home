import { request } from 'umi';

export const readMaxDevice = async (schemad: number) => {
  const result = await request<OptionalResult<MaxDeviceResponse>>('/api-equip/tbschemaddevice', {
    method: 'GET',
    params: { schemad }
  })
  return { data: result.datas }
}

export const updateMaxDevice = async (data: MaxDeviceRequest) => {
  const result = await request<OptionalResult<null>>('/api-equip/tbschemaddevice/saveOrUpdate', {
    method: 'POST',
    data,
  })
  return result
}

export const fetchMaxDevice = async () => {
  const result = await request<OptionalResult<MaxDeviceResponse>>('/api-equip/tbschemaddevice/list', {
    method: 'GET'
  })
  return { data: result.datas }
}
