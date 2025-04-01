export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './Settings/Login' },
      { name: '404页', component: './404' },
    ],
  },
  {
    name: '首页',
    path: '/home',
    component: './Dashboard/Home',
  },
  {
    path: '/system',
    routes: [
      { path: '/system/menus.html', component: './Settings/Menu' },
      { path: '/system/app.html', component: './Settings/App' },
      { path: '/system/role.html', component: './Settings/Role' },
      { path: '/system/user.html', component: './Settings/User' },
      { path: '/system/myInfo.html', component: './Settings/Me' },
      { path: '/system/password.html', component: './Settings/Password' },
      { path: '/system/external-links.html', component: './Settings/ExternalLinks' },
    ],
  },
  {
    path: '/device',
    routes: [
      { path: '/device/group.html', component: './Device/GroupList' },
      { path: '/device/unassigned.html', component: './Device/AssignList' },
      { path: '/device/list.html', component: './Device/DeviceList' },
    ],
  },
  {
    path: '/resource',
    routes: [
      { path: '/resource/resourceCategories.html', component: './Resource/ResourceGroup' },
      { path: '/resource/text.html', component: './Resource/Resource' },
      { path: '/resource/videoGroup.html', component: './Resource/VideoGroup' },
      { path: '/resource/videoList.html', component: './Resource/VideoList' },
      { path: '/resource/liveBroadcastRoom.html', component: './Resource/DynamicData' },
    ],
  },
  {
    path: '/script',
    routes: [
      { path: '/script/script.html', component: './Script/List' },
      { path: '/script/tiktok.html', component: './Script/Tiktok' },
      { path: '/script/instagram.html', component: './Script/Instagram' },
      { path: '/script/facebook.html', component: './Script/Facebook' },
      { path: '/script/youtube.html', component: './Script/Youtube' },
      { path: '/script/twitter.html', component: './Script/Twitter' },
      { path: '/script/whats-app.html', component: './Script/WhatsApp' },
      { path: '/script/telegram.html', component: './Script/Telegram' },
      { path: '/script/snapchat.html', component: './Script/Snapchat' },
      { path: '/script/linkedIn.html', component: './Script/LinkedIn' },
      { path: '/script/pinterest.html', component: './Script/Pinterest' },
      { path: '/script/reddit.html', component: './Script/Reddit' },
      { path: '/script/kakaotalk.html', component: './Script/Kakaotalk' },
      { path: '/script/line.html', component: './Script/LINE' },
    ],
  },
  {
    path: '/dashboard',
    routes: [
      { path: '/dashboard/task.html', component: './Dashboard/Task' },
      { path: '/dashboard/maintenance.html', component: './Dashboard/Account' },
      { path: '/dashboard/register.html', component: './Dashboard/Register' },
      { path: '/dashboard/network.html', component: './Dashboard/Network' },
      { path: '/dashboard/video.html', component: './Dashboard/Video' },
    ],
  },
  { path: '/', redirect: '/home' },
  { component: './404' },
]
