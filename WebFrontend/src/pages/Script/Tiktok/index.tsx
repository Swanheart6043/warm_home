import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import React from 'react';
import { RegisterForm } from './Register';
import { LoginForm } from './Login';
import { MaintainAccountForm } from './MaintainAccount';
import { PublishVideoForm } from './PublishVideo';
import { MaintainLiveBroadcastForm } from './LiveBroadcastRoom';
import { MaintainPrivateMessageForm } from './PrivateMessage';
import { NetworkSettings } from './NetworkSettings';
import { ModifyAvatar } from './ModifyAvatar';

const ScriptManagementList: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '网络设置',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <NetworkSettings />
        </div>
      ),
    },
    {
      key: '2',
      label: '注册账号',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <RegisterForm />
        </div>
      ),
    },
    {
      key: '3',
      label: '账号登录',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <LoginForm />
        </div>
      ),
    },
    {
      key: '4',
      label: '修改头像',
      children: (
        <div style={{ minHeight: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <ModifyAvatar />
        </div>
      ),
    },
    {
      key: '5',
      label: '养号功能',
      children: (
        <div style={{ minHeight: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <MaintainAccountForm />
        </div>
      ),
    },
    {
      key: '6',
      label: '视频发布功能',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <PublishVideoForm />
        </div>
      ),
    },
    {
      key: '7',
      label: '直播维护',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <MaintainLiveBroadcastForm />
        </div>
      ),
    },
    {
      key: '8',
      label: '留痕私信',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <MaintainPrivateMessageForm />
        </div>
      ),
    },
  ];

  return (
    <PageContainer style={{ height: '100%' }}>
      <Tabs type="card" defaultActiveKey="1" items={items} />
    </PageContainer>
  );
};

export default ScriptManagementList;
