import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import React from 'react';

const ScriptManagementList: React.FC = () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '网络设置',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <>开发中。。。</>
        </div>
      ),
    },
    {
      key: '2',
      label: '注册账号',
      children: (
        <div style={{ height: 'calc(100vh - 225px)', backgroundColor: '#fff' }}>
          <>开发中。。。</>
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
