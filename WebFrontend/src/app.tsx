import './App.css'
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

function App() {
  const items: Required<MenuProps>['items'][number][] = [
    {
      key: 'sub1',
      label: '首页',
      icon: <MailOutlined />,
    },
    {
      key: 'sub1',
      label: '硬件控制',
      icon: <MailOutlined />,
      children: [
        { key: 'g1', label: '灯具', type: 'group' },
        { key: 'g2', label: '音箱', type: 'group' },
      ],
    },
    {
      key: 'sub2',
      label: '环境信息',
      icon: <AppstoreOutlined />,
      children: [
        { key: '5', label: '温度' },
        { key: '6', label: '湿度' },
        { key: 'sub3', label: 'Submenu' },
      ],
    },
    {
      key: 'sub3',
      label: '实时监控',
      icon: <AppstoreOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
      ],
    },
    {
      key: 'sub3',
      label: '历时照片',
      icon: <AppstoreOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
      ],
    },
  ];

  return (
    <div className='w-full h-full flex'>
      <div className='flex-[0_0_256]'>
        <Menu
          theme="dark"
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </div>

      <div>
        <div></div>

        <div></div>
      </div>
    </div>
  )
}

export default App
