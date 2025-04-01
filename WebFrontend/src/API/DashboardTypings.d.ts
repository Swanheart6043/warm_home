interface TaskDashboardTableResponse {
  date: string
  value: string
  type: string
}

interface TaskDashboardTableItem {
  register: number | string
  login: number | string
  maintainAccount: number | string
  publishVideo: number | string
  liveBroadcastRoom: number | string
  privateMessage: number | string
  liveBroadcastRoom: number | string
}

interface NetworkItem {
  agree?: string
  city?: string
  country?: string
  createTime?: string
  endtime?: string
  equipId?: string
  hostname?: string
  id?: number
  ip?: string
  password?: string
  port?: number
  remark?: string
  status?: string
  updateTime?: string
  username?: string
}

interface RegisterItem {
  account_id: string;
  account_nickname: string;
  account_password: string;
  account_status: string;
  ban_time: string;
  comment: string;
  country: string;
  create_time: string;
  device_id: string;
  device_no: string;
  ecloud_id: string;
  email: string;
  email_password: string;
  id: number;
  login_status: string;
  phone: string;
  platform: string;
  proxy_ip_account: string;
  proxy_ip_region: string;
  register_time: string;
  schemad: string;
  secondary_email: string;
  secondary_email_password: string;
  sell_status: string;
  server_ip: string;
  tableUser: string;
  update_time: string;
  user_id: number;
}

interface AccountItem {
  account_id: string;
  account_nickname: string;
  account_password: string;
  account_status: null;
  account_type: string;
  ban_time: null;
  comment: null;
  country: string;
  create_time: string;
  device_id: string;
  device_no: string;
  ecloud_id: string;
  email: string;
  email_password: string;
  follower_count: string;
  following_count: string;
  id: number;
  likes_count: string;
  login_status: null,
  phone: null,
  platform: string;
  proxy_ip_account: null,
  proxy_ip_region: null,
  register_time: null,
  schemad: string;
  secondary_email: null,
  secondary_email_password: null,
  server_ip: string;
  tableUser: string;
  update_time: string;
  user_id: string;
}

interface VideoItem {
  id: number;
  account_id: string;
  comment_count: string;
  createTime: string;
  favorite_count: string;
  like_count: string;
  play_count: string;
  publish_time: string;
  schemad: string;
  tableUser: string;
  updateTime: string;
  user_id: string;
  video_url: string;
}
