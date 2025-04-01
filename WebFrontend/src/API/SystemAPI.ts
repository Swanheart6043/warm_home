import { request } from 'umi';

/**
 * 翻页获取租户
 * @param params
 * @returns
 */
export async function paginationApp(params?: { [key: string]: string | number }) {
  const { current, pageSize, ...rest } = params ?? {}
  const result = await request<Pagination<App>>('/api-uaa/clients/list', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

/**
 * 获取所有租户
 * @returns
 */
export async function fetchAllApp() {
  const result = await request<OptionalResultList<App>>('/api-uaa/clients/all', {
    method: 'GET',
  })
  return result.datas
}

/**
 * 新增和编辑租户
 * @param data
 * @returns
 */
export async function createAndUpdateApp(data: App) {
  const result = await request<OptionalResult<null>>('/api-uaa/clients/saveOrUpdate', {
    method: 'POST',
    data,
  })
  return result
}

/**
 * 删除租户
 * @param id
 * @returns
 */
export async function removeApp(id: number) {
  const result = await request<OptionalResult<null>>(`/api-uaa/clients/${id}`, {
    method: 'DELETE',
  })
  return result
}

/**
 * 翻页查询角色
 * @param params
 * @returns
 */
export async function paginationRole(params?: { [key: string]: string | number }) {
  const { current, pageSize, ...rest } = params ?? {}
  const result = await request<Pagination<Role>>('/api-user/roles', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

/**
 * 获取所有角色
 * @returns
 */
export async function fetchAllRole() {
  const result = await request<Pagination<Role>>('/api-user/roles', {
    method: 'GET',
  })
  return result.data
}

/**
 * 新增和编辑角色
 * @param data
 * @returns
 */
export async function createAndUpdateRole(data: Role) {
  const result = await request<OptionalResultList<Role>>('/api-user/roles/saveOrUpdate', {
    method: 'POST',
    data,
  })
  return result
}

/**
 * 删除角色
 * @param id
 * @returns
 */
export async function removeRole(id: number) {
  const result = await request<OptionalResultList<void>>(`/api-user/roles/${id}`, {
    method: 'DELETE',
  })
  return result
}

/**
 * 翻页查询用户
 * @param params
 * @returns
 */
export async function paginationUser(params?: { [key: string]: string | number }) {
  const { current, pageSize, ...rest } = params ?? {};
  const result = await request<Pagination<UserRow>>('/api-user/users', {
    method: 'GET',
    params: { page: current, limit: pageSize, ...rest },
  })
  return { data: result.data, total: result.count }
}

export async function createUser(data: User) {
  const result = await request<OptionalResult<null>>('/api-user/users/addUser', {
    method: 'POST',
    data,
  })
  return result
}

export async function updateUser(data: User) {
  const result = await request<OptionalResult<null>>('/api-user/auth/editUser', {
    method: 'PUT',
    data,
  })
  return result
}

export async function deleteUser(id: number) {
  const result = await request<OptionalResultList<void>>(`/api-user/users/${id}`, {
    method: 'DELETE',
  })
  return result
}

export async function resetPassword(data: { userId: number, password: string }) {
  const result = await request<OptionalResultList<User>>(`/api-user/users/resetUserPwd`, {
    method: 'PUT',
    data
  })
  return result
}

export async function updateEnabled(id: number, enabled: boolean) {
  const result = await request<OptionalResultList<User>>('/api-user/users/updateEnabled', {
    method: 'GET',
    params: { id, enabled },
  })
  return result
}

/**
 * 设置用户的设备数和过期时间
 * @param data
 * @returns
 */
export async function updateUserCloud(data: USet) {
  const result = await request<OptionalResultList<User>>('/api-user/users/updateUserCloud', {
    method: 'PUT',
    data
  })
  return result
}

/**
 * 登录
 * @param body
 * @param options
 * @returns
 */
export async function login(body: LoginParams, options?: { [key: string]: any; }) {
  return request<OptionalResult<LoginResult>>('/api-uaa/oauth/token', {
    method: 'POST',
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic d2ViQXBwOndlYkFwcA==',
    },
    data: { ...body, grant_type: 'password_code' },
    ...(options || {}),
  })
}

/**
 * 获取登录用户的信息
 * @param options
 * @returns
 */
export async function currentUser(options?: { [key: string]: any; }) {
  return request<OptionalResult<CurrentUser>>('/api-user/users/current', {
    method: 'GET',
    ...(options || {}),
  })
}

/**
 * 获取登录用户的菜单
 * @param options
 * @returns
 */
export async function fetchMenuData(options?: { [key: string]: any; }) {
  return request<API.Menu[]>('/api-user/menus/current', {
    method: 'GET',
    ...(options || {}),
  })
}

/**
 * 修改个人信息
 * @param data
 * @returns
 */
export async function updateMe(data: Me) {
  const result = await request<OptionalResult<null>>(`/api-user/users/editUser`, {
    method: 'PUT',
    data
  })
  return result
}

/**
 * 导入个人头像
 * @param formData
 * @returns
 */
export async function importMeAvatar(formData: FormData) {
  const result = await request<FileInfo>("/api-file/file/upload", {
    method: 'POST',
    requestType: 'form',
    data: formData,
  })
  return result
}

/**
 * 修改密码
 * @param params
 * @returns
 */
export async function updatePassword(params: ChangePasswordParams) {
  const result = await request<OptionalResult<null>>(`/api-user/users/password`, {
    method: 'PUT',
    data: params
  })
  return result
}

/**
 * 退出
 * @param options
 * @returns
 */
export async function outLogin(options?: { [key: string]: any; }) {
  return request<Record<string, any>>('/api-uaa/oauth/remove/token', {
    method: 'GET',
    ...(options || {}),
  })
}

/**
 * 查询外部跳转地址
 * @returns
 */
export const fetchExternalLinks = async () => {
  const result = await request<OptionalResult<ExternalLink>>('/api-file/url/list', {
    method: 'GET',
  })
  return result
}

/**
 * 编辑外部跳转地址
 * @param data
 * @returns
 */
export const updateExternalLinks = async (data: ExternalLink) => {
  const result = await request<OptionalResult<null>>('/api-file/url/edit', {
    method: 'POST',
    data,
  })
  return result
}

export async function menuForAuth(roleId: number, tenantId: number) {
  const result = await request<SYSTEM.Menu[]>(`/api-user/menus/${roleId}/menus`, {
    method: 'GET',
    params: { tenantId },
  });
  return result;
}

export async function menu(tenantId: string | number) {
  const result = await request<Pagination<SYSTEM.Menu>>('/api-user/menus/findAlls', {
    method: 'GET',
    params: {tenantId},
  });
  return result.data;
}

export async function menuOnes() {
  const result = await request<Pagination<SYSTEM.Menu>>('/api-user/menus/findOnes', {
    method: 'GET',
  });
  return result.data;
}

export async function assignMenu(assignMenu: AssignMenu) {
  const result = await request<OptionalResultList<void>>("/api-user/menus/granted", {
    method: 'POST',
    data: assignMenu,
  });
  return result;
}

export async function saveOrUpdateMenus(data: SYSTEM.Menu): Promise<OptionalResultList<SYSTEM.Menu>> {
  const result = await request<OptionalResultList<SYSTEM.Menu>>('/api-user/menus/saveOrUpdate', {
    method: 'POST',
    data,
  });
  return result;
}

export async function deleteMenus(id: number) {
  const url = `/api-user/menus/${id}`;
  const result = await request<OptionalResultList<void>>(url, {
    method: 'DELETE',
  });
  return result;
}
