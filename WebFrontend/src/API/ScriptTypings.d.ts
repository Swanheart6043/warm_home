import { PlatformEnum } from "@/enum/PlatformEnum";
import { ScriptTypeEnum } from "@/pages/Script/ScriptTypeEnum";

interface ScriptParams {
  platform: PlatformEnum;
  operType: ScriptTypeEnum;
  devices: string[];
  valueJson: string;
  regAccountMethod?: number; // 注册账号方式(0邮箱 1手机)
  regEmailUrl?: string; // 注册邮箱API地址
  regPhoneUrl?: string; // 注册手机API地址
  regNum?: number; // 注册数量
  loginAccountMethod?: number; // 账号登录方式(0:邮箱;1:手机)
  loginEmailText?: string; // 邮箱登录文本可多数据分割
  loginPhoneText?: string; // 手机自动登录文本，可多数据分割
  numMainMeth?: number; // 养号方式(0:随机养号;1:垂直养号;2:指定账号;3:直播间; )
  numMainBegdura?: number; //单视频观看时长最小
  numMainEnddura?: number; //单视频观看时长最大
  numMainverimMeth?: number; // 养号垂直标签导入方式(0:随机;1:顺序)
  numMainverimText?: string; // 养号垂直标签导入文本
  numMainspaccoMeth?: number; // 养号指定账号导入方式(0:随机;1:顺序)
  numMainspaccoText?: string; // 养号指定账号导入文本
  numMainspliveMeth?: number;  // 养号指定直播间导入方式(0:随机;1:顺序)
  numMainspliveText?: string; // 养号指定直播间导入文本
  likesNum?: number; // 养号_点赞数量
  likesProport?: number; // 养号_点赞比例
  likesBvProport?: number; // 养号_点赞蓝V比例
  followersNum?: number; // 养号_关注数量
  followersProport?: number; // 养号_关注点赞比例
  followersBvProport?: number; // 养号_关注蓝V比例
  retweetsNum?: number; // 养号_转发数量
  retweetsProport?: number; // 养号_转发比例
  retweetsBvProport?: number; // 养号_转发蓝V比例
  collectionNum?: number; // 养号_收藏数量
  collectionProport?: number; // 养号_收藏比例
  collectionBvProport?: number; // 养号_收藏蓝V比例
  commentsNum?: number; // 养号_评论数量
  commentsProport?: number; // 养号_评论比例
  commentScriptText?: string; // 养号_评论话术导入文本
  commentScriptMeth?: number; // 养号_评论话术导入方式(0:随机;1:顺序)
  scriptExeOrder?: string; // 脚本执行顺序,可以随意组合
  numSwipeVideoMin?: string | number; //刷视频数量最小数量
  numSwipeVideoMax?: string | number; //刷视频数量最大数量
  likesProportMin?: string | number; //点赞比例最小
  likesProportMax?: string | number; //点赞比例最大
  followersProportMin?: string | number; //关注比例最小
  followersProportMax?: string | number; //关注比例最大
  collectionProportMin?: string | number; //收藏比例最小
  collectionProportMax?: string | number; //收藏比例最大
  commentsProportMin?: string | number; //评论比例最小
  commentsProportMax?: string | number; //评论比例最大
  videoReleNum?: number; // 视频发布数
  videoReleTitle?: string; // 视频导入标题
  videoReleMusmeth?: number;  // 视频音乐导入方式(0:热门随机;1:商业音乐;2:指定音乐)
  videoReleDesmusic?: string; // 视频指定音乐名称
  videoReleMusicreg?: number; // 视频音乐调节方式(0:原音大配音小;1:原音小配音大)
  videoTrailerSetUrl?: string; // 视频购物车设置链接
  videoTrailerSetnum?: string; // 视频购物车设置几号商品
  liveStrmtbBegdur?: number; // 直播维护浏览开始时长
  liveStrmtbEnddur?: number; // 直播维护浏览结束时长
  liveDesaccoText?: string; // 直播指定账号导入文本
  liveDesaccoMeth?: number; // 直播指定账号导入方式(0:随机;1:顺序)
  liveDesroomText?: string; // 直播指定直播间导入文本
  liveDesroomMeth?: number; // 直播指定直播间导入方式(0:随机;1:顺序)
  liveMainstreamMeth?: number; // 直播维护方式(0:点赞;1:关注;2:转发;3:收藏;)
  liveMainstreamNum?: number; // 直播维护互动数量
  liveMainstreamSctext?: string; // 直播维护互动话术导入
  liveMainstreamStmeth?: number; // 直播互动话术导入方式(0:随机;1:顺序)
  leavePrilettMethod?: number; // 留痕私信方式(0:自己粉丝私信;1:指定视频一级评论区;2:指定视频二级评论;3:直播间;)默认为自己私信粉丝
  leaveAccountText?: string; // 留痕私信账号导入
  leaveAccountMeth?: number; // 留痕私信账号导入方式(0:随机;1:顺序)
  leaveVideoinkText?: string; // 留痕私信视频链接导入
  leaveVideoinkMeth?: number; // 留痕私信视频链接导入方式(0:随机;1:顺序)
  leaveLiveroomText?: string; // 留痕私信直播间导入
  leaveLiveroomMeth?: number; // 留痕私信直播间导入方式(0:随机;1:顺序;)
  leavePrimsgSctext?: string; // 留痕私信话术导入文本
  leavePrimsgMeth?: number; // 留痕私信话术导入方式(0:随机;1:顺序)
  leavePrimsgNum?: number; // 留痕私信设置条数
  leavePrimsgDur?: number; // 留痕私信设置时长分钟数
  leavePrimsgSumnum?: number; // 留痕私信设置总条数
  scriptTimesetMeth?: number; // 自动化脚本设置启动方式(0:立即启动;1:定时启动)
  scriptAutoTime?: string; // 脚本设置启动时间(立即启动类似00:00:00)
  endTime?: string;
  isAgent?: number;
}

interface ScriptItem extends Partial<ScriptParams> {
  id?: string;
  scriptId?: string;
  loading?: boolean;
  isEnabled?: number;
  scriptAutoTime?: string;
  endTime?: string;
}

interface ScriptStatisticsItem {
  successNum?: number; // 成功数量
  failNum?: number; // 失败数量
  eqNum?: number; // 设备数量
  osType?: number; // 操作类型(1:注册账号,2:账号登录,3:养号功能,4:视频发布,5:直播维护,6:留痕私信)
  osScriptId?: number; // 脚本编号
  osPlatform?: string; // 脚本平台来源
}
