import { request } from "umi"

/**
 * 分页获取视频分组
 * @param params
 * @returns
 */
export const paginationVideoGroup = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<VideoGroup>>('/api-file/category/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

/**
 * 获取所有视频分组
 * @returns
 */
export const fetchAllVideoGroup = async () => {
  const result = await request<OptionalResultList<VideoGroup>>('/api-file/category/listAll', {
    method: 'GET'
  })
  return result.datas ?? []
}

/**
 * 新增视频分组
 * @returns
 */
export const createVideoGroup = async (data: VideoGroup) => {
  const result = await request<OptionalResult<null>>('/api-file/category/add', {
    method: 'POST',
    data
  })
  return result
}

/**
 * 编辑视频分组
 * @returns
 */
export const updateVideoGroup = async (data: VideoGroup) => {
  const result = await request<OptionalResult<null>>('/api-file/category/edit', {
    method: 'POST',
    data
  })
  return result
}

/**
 * 删除视频分组
 * @returns
 */
export const deleteVideoGroup = async (ids: number[]) => {
  const result = await request<OptionalResult<null>>('/api-file/category/del', {
    method: 'POST',
    data: ids,
  })
  return result
}

/**
 * 分页获取视频记录
 * @param params
 * @returns
 */
export const paginationVideo = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<Video>>('/api-file/file/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const fetchAllVideo = async () => {
  const result = await request<Pagination<Video>>('/api-file/file/listAll', {
    method: 'GET',
  })
  return result.data || []
}

export const createVideo = async (params: Video) => {
  const result = await request<OptionalResult<null>>('/api-file/file/import', {
    method: 'POST',
    data: params
  })
  return result
}

export const updateVideo = async (params: Video) => {
  const result = await request<OptionalResult<null>>('/api-file/file/edit', {
    method: 'POST',
    data: params
  })
  return result
}

export const deleteVideo = async (id: string) => {
  const result = await request<OptionalResult<null>>(`/api-file/file/${id}`, {
    method: 'DELETE'
  })
  return result
}

export const uploadVideo = async (formData: FormData) => {
  const result = await request<any>('/api-file/file/upload', {
    method: 'POST',
    requestType: 'form',
    data: formData,
  })
  return result
}
