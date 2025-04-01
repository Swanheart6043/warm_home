interface VideoGroup {
  id?: number;
  categoryName?: string;
  comment?: string;
  createTime?: string;
  schemad?: string;
  updateTime?: string;
  userId?: string;
}

interface Video {
  id?: string;
  categoryId: string;
  categoryName: string;
  name: string;
  isImg: boolean;
  contentType: string;
  size: string;
  path: string;
  url: string;
  source: string;
  comment: string;
}
