import { PlatformEnum } from '@/enum/PlatformEnum';
import { request } from 'umi';

/**
 * 导出信息
 * @returns
 */
export const exportInfo = async () => {
  const result = await request<any>('/api-appscript/tbsocialmediaaccount/export', {
    method: 'POST',
    params: undefined,
    responseType: 'blob'
  });
  return result;
}

/**
 * 执行脚本
 * @param params
 * @returns
 */
export const executeScript = async (params: ScriptParams) => {
  const result = await request<OptionalResult<void>>('/api-appscript/tbecautoscript/saveOrUpdateScriptInfo', {
    method: 'POST',
    data: params,
  });
  return result;
}

/**
 * 脚本列表
 * @param params
 * @returns
 */
export const paginationScript = async (params?: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params ?? {};
  const result = await request<Pagination<ScriptItem>>('/api-appscript/tbecautoscript/findScriptList', {
    method: 'GET',
    params: { equipId: '', page: current, limit: pageSize, ...rest },
  });
  return { data: result.data, total: result.count };
}

/**
 * 再次执行脚本
 * @param params
 * @returns
 */
export const reRunScript = async (params: { scriptId: string }) => {
  const result = await request<OptionalResult<void>>('/api-appscript/tbecautoscript/reRunScript', {
    method: 'POST',
    data: params,
  });
  return result;
}

/**
 * 停止脚本
 * @param params
 * @returns
 */
export const stopScript = async (params: { scriptId: string }) => {
  const result = await request<OptionalResult<void>>('/api-appscript/tbecautoscript/stopTask', {
    method: 'POST',
    data: params,
  });
  return result;
}

/**
 * 脚本统计列表
 * @param params
 * @returns
 */
export const paginationStatisticsScript = async (params?: { [key: string]: string | number }) => {
  const { current, pageSize, ...rest } = params ?? {};
  const result = await request<Pagination<ScriptStatisticsItem>>('/api-appscript/operscriptrecord/staticScriptRecord', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  });
  return { data: result.data, total: result.count };
}

/**
 * 导入登陆脚本的邮箱
 * @param formData
 * @returns
 */
export const importEmailForLoginScript = async (params: { platform: PlatformEnum }, formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-appscript/tbsocialmediaaccount/import', {
    method: 'POST',
    requestType: 'form',
    params,
    data: formData,
  });
  return result;
}

/**
 * 导入注册脚本的邮箱
 * @param formData
 * @returns
 */
export const importEmailForRegisterScript = async (params: { platform: PlatformEnum }, formData: FormData) => {
  const result = await request<OptionalResult<null>>('/api-appscript/tbsocialmediaaccount/check', {
    method: 'POST',
    requestType: 'form',
    params,
    data: formData,
  });
  return result;
}
