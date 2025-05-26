import './App.css'
import { FileImageOutlined, CrownOutlined, WindowsOutlined, DotChartOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import type { MenuProps } from 'antd';

function App() {
  const items: Required<MenuProps>['items'][number][] = [
    {
      key: 'home',
      label: '首页',
      icon: <CrownOutlined />,
    },
    {
      key: 'environmental',
      label: '环境信息',
      icon: <DotChartOutlined />,
    },
    {
      key: 'monitor',
      label: '实时监控',
      icon: <CameraOutlined />,
    },
    {
      key: 'photoWall',
      label: '历时照片',
      icon: <FileImageOutlined />,
    },
    {
      key: 'hardwareControl',
      label: '硬件控制',
      icon: <WindowsOutlined />,
      children: [
        { key: 'lamp', label: '灯具' },
        { key: 'speakers', label: '音箱' },
        { key: 'fan', label: '风扇' },
        { key: 'digitalTube', label: '数码管' },
      ],
    },
    {
      key: 'me',
      label: '个人中心',
      icon: <UserOutlined />,
    },
  ];

  return (
    <div className='w-full h-full flex' style={{ height: '100%' }}>
      <div className='bg-[#ffffff]' style={{ height: '56px', borderBottom: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          万家灯火
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>
            <Avatar size={16} icon={<UserOutlined />} />
          </span>
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>Raphael_Hu</span>
        </div>
      </div>

      <div style={{ height: 'calc(100% - 57px)', background: 'linear-gradient(#ffffff, #f5f5f5 28%)', display: 'flex' }}>
        <div style={{ borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 8px' }}>
          <Menu
            style={{ width: 256, background: 'linear-gradient(#ffffff, #f5f5f5 28%)', border: 'none' }}
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['hardwareControl']}
            mode="inline"
            items={items}
          />
        </div>

        <div style={{ flex: '1', padding: '32px 40px' }}>

        </div>
      </div>
    </div>
  )
}

export default App
