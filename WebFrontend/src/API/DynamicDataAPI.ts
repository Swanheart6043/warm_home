import { request } from "umi"

/**
 * 获取所有动态表
 * @param params
 * @returns
 */
export const fetchAllDynamicTable = async () => {
  const result = await request<OptionalResult<DynamicTable[]>>('/api-file/data/listInfo', {
    method: 'GET',
  })
  return result?.datas || []
}

/**
 * 分页获取动态数据
 * @param params
 * @returns
 */
export const paginationDynamicData = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<Row>>('/api-file/data/list', {
    method: 'POST',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

/**
 * 获取所有动态数据
 * @param tableId
 * @param tableName
 * @returns
 */
export const fetchAllDynamicData = async (tableId: number, tableName: string) => {
  const result = await request<Pagination<Row>>('/api-file/data/list', {
    method: 'POST',
    params: { page: 1, limit: 99999, tableId, tableName },
  })
  return { data: result.data }
}

/**
 * 新增动态数据
 * @param params
 * @returns
 */
export const createDynamicData = async (params: Row) => {
  const result = await request<OptionalResult<null>>('/api-file/data/add', {
    method: 'POST',
    data: params
  })
  return result
}

/**
 * 查询动态数据
 * @param params
 * @returns
 */
export const readDynamicData = async (id: number, tableId: number, tableName: string) => {
  const result = await request<OptionalResult<ResourceGroup>>('/api-file/data/getInfo', {
    method: 'GET',
    params: { id, tableId, tableName },
  })
  return result
}

/**
 * 编辑动态数据
 * @param params
 * @returns
 */
export const updateDynamicData = async (params: Row) => {
  const result = await request<OptionalResult<null>>('/api-file/data/edit', {
    method: 'POST',
    data: params
  })
  return result
}

/**
 * 删除动态数据
 * @param params
 * @returns
 */
export const deleteDynamicData = async (ids: string, tableId: number, tableName: string) => {
  const result = await request<OptionalResult<null>>('/api-file/data/delete', {
    method: 'POST',
    params: { ids, tableId, tableName },
  })
  return result
}

/**
 * 获取动态数据导入模板
 * @param params
 * @returns
 */
export const fetchDynamicDataImportTemplate = async (tableId: number, tableName: string) => {
  const result = await request<OptionalResult<null>>('/api-file/data/exportTmpl', {
    method: 'POST',
    data: { tableId, tableName }
  })
  return result
}

/**
 * 导入文件
 * @param formData
 * @returns
 */
export const importDynamicData = async (formData: FormData) => {
  const result = await request<DynamicDataImportResponseParams>('/api-file/data/upload', {
    method: 'POST',
    requestType: 'form',
    data: formData,
  })
  return result
}

/**
 * 提交导入的文件路径
 * @param params
 * @returns
 */
export const submitImportDynamicData = async (params: Row) => {
  const result = await request<OptionalResult<null>>('/api-file/data/importData', {
    method: 'POST',
    data: params
  })
  return result
}

/**
 * 导出步骤1
 * @param params
 * @returns
 */
export const exportDynamicDataStep1 = async (params: { tableId: number; tableName: string }) => {
  const result = await request<OptionalResult<null>>('/api-file/data/export', {
    method: 'POST',
    data: params
  })
  return result
}

/**
 * 导出步骤2
 * @param params
 * @returns
 */
export const exportDynamicDataStep2 = async (fileName: string) => {
  const result = await request<any>('/api-file/data/download', {
    method: 'POST',
    params: { fileName },
    responseType: 'blob'
  })
  return result
}
