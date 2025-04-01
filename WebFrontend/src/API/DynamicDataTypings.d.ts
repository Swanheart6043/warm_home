interface DynamicTable {
  comment?: string;
  gmtCreate?: string;
  gmtModified?: string;
  id?: number;
  isDeleted?: number;
  status?: number;
  userName?: string;
  tenantId?: number;
  tableName?: string;
  tableNameEn?: string;
  tableColumn?: string;
}

interface FieldsItem {
  id?: number;
  columnInfo?: string;
  columnName?: string;
  columnSize?: number;
  searchJoin?: boolean;
}

interface Row {
  [key: string]: any;
}

interface DynamicDataImportResponseParams {
  fileAbsPath?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  md5?: string;
  url?: string;
}

interface DynamicDataSubmitImportRequestParams {
  content: string;
  tableId: number;
  tableName: string;
}
