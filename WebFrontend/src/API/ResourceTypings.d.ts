interface ResourceGroup {
  id?: number;
  comment?: string;
  gmtCreate?: string;
  gmtModified?: string;
  isDeleted?: number;
  name?: string;
  status?: number;
  tenantId?: number;
  userName?: string;
}

interface Resource {
  comment?: string;
  content?: string;
  gmtCreate?: string;
  gmtModified?: string;
  groupId?: number;
  groupName?: string;
  id?: number;
  isDeleted?: number;
  name?: string;
  status?: number;
  tenantId?: number;
  userName?: string;
}
