import { request } from 'umi';

export const fetchHomeData = async (platform: string) => {
  const result = await request<OptionalResult<HomeData>>('/api-appscript/tbecautoscript/stats/total', {
    method: 'GET',
    params: { platform }
  })
  return { data: result.datas }
}

export const fetchHomeYearCharts = async (year: string, platform?: string) => {
  const result = await request<HomeCharts[]>('/api-appscript/tbecautoscript/stats/yearly', {
    method: 'GET',
    params: { year, platform }
  })
  return result
}

export const fetchHomeMonthCharts = async (startTime: string, endTime: string, platform: string) => {
  const result = await request<HomeCharts[]>('/api-appscript/tbecautoscript/stats/monthly', {
    method: 'GET',
    params: { startTime, endTime, platform }
  })
  return result
}

export const fetchHomeDayCharts = async (startTime: string, endTime: string, platform: string) => {
  const result = await request<HomeCharts[]>('/api-appscript/tbecautoscript/stats/daily', {
    method: 'GET',
    params: { startTime, endTime, platform }
  })
  return result
}

export const exportHomeYearCharts = async (year: string) => {
  const blob = await request<any>('/api-appscript/tbecautoscript/stats/yearly/export', {
    method: 'POST',
    params: { year },
    responseType: 'blob'
  })
  return blob
}

export const exportHomeMonthCharts = async (startTime: string, endTime: string) => {
  const blob = await request<any>('/api-appscript/tbecautoscript/stats/monthly/export', {
    method: 'POST',
    params: { startTime, endTime },
    responseType: 'blob'
  })
  return blob
}

export const exportHomeDayCharts = async (startTime: string, endTime: string) => {
  const blob = await request<any>('/api-appscript/tbecautoscript/stats/daily/export', {
    method: 'POST',
    params: { startTime, endTime },
    responseType: 'blob'
  })
  return blob
}

export const fetchHomeTemp = async () => {
  const result = await request<OptionalResult<HomeTemp>>('/api-appscript/bi/list', {
    method: 'GET',
  })
  return result.datas
}
