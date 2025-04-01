import { request } from "umi"

/**
 * 分页获取资源文件分组
 * @param params
 * @returns
 */
export const paginationResourceGroup = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<ResourceGroup>>('/api-file/groups/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const fetchAllResourceGroup = async () => {
  const result = await request<Pagination<ResourceGroup>>('/api-file/groups/list', {
    method: 'GET',
    params: { page: 1, limit: 99999 },
  })
  return result.data || []
}

export const createResourceGroup = async (params: ResourceGroup) => {
  const result = await request<OptionalResult<null>>('/api-file/groups/add', {
    method: 'POST',
    data: params
  })
  return result
}

export const updateResourceGroup = async (params: ResourceGroup) => {
  const result = await request<OptionalResult<null>>('/api-file/groups/edit', {
    method: 'POST',
    data: params
  })
  return result
}

export const deleteResourceGroup = async (ids: string) => {
  const result = await request<OptionalResult<null>>('/api-file/groups/delete', {
    method: 'DELETE',
    params: { ids },
  })
  return result
}

/**
 * 分页获取资源文件
 * @param params
 * @returns
 */
export const paginationResource = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<Resource>>('/api-file/data/static/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const fetchAllResource = async () => {
  const result = await request<Pagination<Resource>>('/api-file/data/static/list', {
    method: 'GET',
    data: { page: 1, limit: 999999 },
  })
  return result.data || []
}

export async function uploadResourceFile(formData: FormData) {
  const result = await request<any>("/api-file/data/upload", {
    method: 'POST',
    requestType: 'form',
    data: formData,
  });
  return result;
}

export const createResource = async (formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-file/data/static/add', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  })
  return result
}

export const readResource = async (id: number) => {
  const result = await request<OptionalResult<Resource>>('/api-file/data/static/getOne', {
    method: 'GET',
    params: { id },
  })
  return result
}

export const updateResource = async (formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-file/data/static/edit', {
    method: 'POST',
    data: formData,
    requestType: 'form',
  })
  return result
}

export const deleteResource = async (ids: string) => {
  const result = await request<OptionalResult<null>>('/api-file/data/static/delete', {
    method: 'POST',
    params: { ids },
  })
  return result
}

export const createResourceForExcel = async (tableName: string, formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-file/data/importData/RPA', {
    method: 'POST',
    params: { tableName },
    data: formData,
    requestType: 'form',
  })
  return result
}
