import RightContent from '@/components/RightContent';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import { Divider, Space } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser, fetchMenuData } from './API/SystemAPI';
import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import {
  AppstoreOutlined,
  MenuOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  CrownOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  BankOutlined,
  MobileOutlined,
  WindowsOutlined,
} from '@ant-design/icons';

const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.datas;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.userName,
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    menu: {
      params: {
        // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
        userId: initialState?.currentUser?.id,
      },
      request: async () => {
        if (!initialState?.currentUser?.id) {
          return []
        }
        const menuData = await fetchMenuData();
        const mapIcon = (css: string | undefined) => {
          switch (css) {
            case 'layui-icon-set':
              return <SettingOutlined />
            case 'layui-icon-friends':
              return <UserOutlined />
            case 'layui-icon-user':
              return <TeamOutlined />
            case 'layui-icon-menu-fill':
              return <MenuOutlined />
            case 'device':
              return <MobileOutlined />
            case 'resource':
              return <BankOutlined />
            case 'task':
              return <WindowsOutlined />
            case 'operations':
              return <DotChartOutlined />
            case 'dashboard':
              return <AreaChartOutlined />
            default:
              return <AppstoreOutlined />
          }
        };
        const mapMenu = (value: API.Menu[]): MenuDataItem[] => {
          return value.map((item) => {
            return {
              key: item.id + '',
              name: item.name,
              locale: false,
              path:
                item.path?.endsWith('.html') || item.path?.startsWith('http')
                  ? item.path
                  : undefined,
              icon: mapIcon(item.css),
              children: item.subMenus && mapMenu(item.subMenus),
            };
          });
        };
        return [
          { key: 'welcome', name: '首页', path: '/home', icon: <CrownOutlined /> },
          ...mapMenu(menuData),
        ];
      },
    },
    headerContentRender: () => {
      return (
        <Space>
          <Divider type="vertical" />
        </Space>
      );
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  const accessToken = sessionStorage.getItem('access_token');
  const authHeader: { Authorization?: string } = {};
  if (accessToken && !url.includes('/api-uaa/oauth/token')) {
    authHeader.Authorization = `Bearer ${accessToken}`;
  }
  const newHeaders = { ...options.headers, ...authHeader };
  return {
    url,
    options: { ...options, interceptors: true, headers: newHeaders },
  };
};

const unauthorizedInterceptor = async (response: Response) => {
  if (response.status === 401) {
    const { location } = history;
    if (location.pathname !== loginPath) {
      history.push(loginPath);
    }
  }
  return response;
};

export const request: RequestConfig = {
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [unauthorizedInterceptor],
  errorConfig: {
    adaptor: (resData) => {
      const buildErrorMessage = () => {
        if (resData.resp_msg) {
          const expiredMsgList = ['Invalid access token', 'Not Authenticated']
          return resData.resp_msg.includes(expiredMsgList[0]) || resData.resp_msg.includes(expiredMsgList[1]) ? '登录过期' : resData.resp_msg
        }
        return '服务器异常'
      }
      return { ...resData, errorMessage: buildErrorMessage() };
    },
  },
};

export function rootContainer(container: any) {
  return React.createElement(NiceModal.Provider, null, container);
}
