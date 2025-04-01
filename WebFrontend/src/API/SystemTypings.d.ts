interface FileInfo {
  id: string;
  name?: string;
  isImg: boolean;
  url?: string;
  contentType?: string;
  size?: number;
  path?: string;
  source?: string;
  createTime?: string;
  tenantId?: string;
  updateTime?: string;
}

interface ErrorResponse {
  errorCode: string; // 业务约定的错误码
  errorMessage?: string; // 业务上的错误信息
  success?: boolean; // 业务上的请求是否成功
}

interface Pagination<T> {
  code?: number
  count?: number
  data?: T[]
}

interface OptionalResult<T> {
  resp_code?: number
  resp_msg?: string
  datas?: T
}

interface OptionalResultList<T> {
  resp_code?: number
  resp_msg?: string
  datas?: T[]
}

interface App {
  ancestors?: string
  createdAt?: string
  createdBy?: number
  deletedAt?: string
  deptId?: number
  deptName?: string
  email?: string
  leader?: string
  orderNum?: number
  parentId?: number
  phone?: string
  status?: string
  updatedAt?: string
  updatedBy?: number
}

interface Role {
  roleId?: number
  roleName?: string
  createTime?: Date
  updateTime?: Date
  userId?: string
  dataScope?: number
  listOrder?: number
  remark?: string
  status?: number
}

interface UserRow {
  id?: number
  userName?: string
  mobile?: string
  userNickname?: string
  birthday?: number
  userPassword?: string
  userSalt?: string
  userStatus?: number
  userEmail?: string
  sex?: number
  avatar?: string
  deptId?: number
  deptName?: string
  remark?: string
  isAdmin?: number
  address?: string
  lastLoginIp?: string
  lastLoginTime?: string
  createdAt?: string
  updatedAt?: string
  deviceNumber?: number
  tenantId?: number
  roles?: Role[]
  deviceNumber?: number
  tenantExpireTime?: string
}

interface User {
  id?: number
  username?: string
  userName?: string
  nickName?: string
  headImgUrl?: string
  sex?: number
  type?: string
  mobile?: number
  createTime?: Date
  enabled?: boolean
  del?: boolean
  roles?: Role[]
  roleId?: string
  schemad?: string
  deptId?: number
}

interface CurrentUser {
  id?: number;
  permissions?: string[];
  deptId?: number;
  deptName?: number;
  roles?: {
    dataScope?: number;
    listOrder?: number;
    remark?: string;
    roleId?: number;
    roleName?: string;
    status?: number;
    userId?: number;
  }[];
  userName?: string;
  userNickname?: string;
  mobile?: string;
  sex?: number;
  avatar?: string; // 头像地址
  address?: string;
  birthday?: number;
  conSecret?: string;
  createdAt?: string;
  deletedAt?: string;
  describe?: string;
  deviceNumber?: number;
  isAdmin?: number;
  lastLoginIp?: string;
  lastLoginTime?: string;
  newPassword?: null;
  oldPassword?: null;
  phoneNum?: string;
  rateLimitPer?: number;
  remark?: string;
  tenantExpireTime?: string;
  tenantId?: number;
  updatedAt?: string;
  userEmail?: string;
  userPassword?: string;
  userSalt?: string;
  userStatus?: number;
}

/** 个人中心页面 */
interface Me {
  id?: number
  userName?: string
  userNickname?: string
  mobile?: string
  sex?: number
  avatar?: string
}

interface USet {
  id: number
  address: string
  avatar: string
  birthday: number
  conSecret: string
  createdAt: string
  deletedAt: string
  deptId: number
  describe: string
  deviceNumber: number
  isAdmin: number
  lastLoginIp: string
  lastLoginTime: string
  mobile: string
  phoneNum: string
  rateLimitPer: number
  remark: string
  sex: number
  tenantExpireTime: string
  tenantId: number
  updatedAt: string
  userEmail: string
  userName: string
  userNickname: string
  userPassword: string
  userSalt: string
  userStatus: number
}

interface LoginResult {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  account_type?: string;
}

interface LoginParams {
  username?: string;
  password?: string;
  validCode?: string;
  deviceId?: string;
}

interface ChangePasswordParams {
  id?: string|number
  oldPassword: string
  newPassword: string
  rePassword: string
  password: string
}

interface AssignMenu {
  roleId: number;
  menuIds: (string|number)[];
};

interface ExternalLink {
  id?: number
  webName?: string
  url?: string
}

declare namespace SYSTEM {
  type Menu = {
    id: number;
    path?: string;
    name?: string;
    pId?: number;
    parentId?: number;
    url?: string;
    type?: number;
    css?: string;
    checked?: boolean;
    open?: boolean;
    sort?: number;
    children?: Menu[];
  };
}

declare namespace API {
  type Menu = {
    id?: number;
    name?: string;
    path?: string;
    url?: string;
    css?: string;
    subMenus?: Menu[];
  };
}
