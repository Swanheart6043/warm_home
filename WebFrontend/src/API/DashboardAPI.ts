import { request } from 'umi'

export const fetchTaskDashboardTable = async (params: { [key: string]: string | number }) => {
  const result = await request<TaskDashboardTableResponse[]>('/api-appscript/tbecautoscript/stats/yearly', {
    method: 'GET',
    params: { platform: params.platform },
  })
  return {
    data: [
      {
        id: '1',
        register: result[0].value || 0,
        login: result[1].value || 0,
        maintainAccount: result[2].value || 0,
        publishVideo: result[3].value || 0,
        liveBroadcastRoom: result[4].value || 0,
        privateMessage: result[5].value || 0,
        networkSettings: result[6].value || 0
      },
    ] as any[],
  }
}

export const paginationNetwork = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<NetworkItem>>('/api-file/tbNetworkSettings/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const exportNetworkDashboard = async () => {
  const blob = await request<any>('/api-file/tbNetworkSettings/export', {
    method: 'POST',
    responseType: 'blob'
  })
  return blob
}

export const paginationRegister = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<RegisterItem>>('/api-file/data/operation/register/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const paginationAccount = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<AccountItem>>('/api-file/data/operation/account/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

export const updateAccount = async (data: AccountItem) => {
  const result = await request<OptionalResult<AccountItem>>('/api-file/data/operation/account/edit', {
    method: 'POST',
    data,
  })
  return result
}

export const paginationVideo = async (params: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params
  const result = await request<Pagination<VideoItem>>('/api-file/data/operation/video/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data }
}

