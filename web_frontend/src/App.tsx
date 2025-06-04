import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FileImageOutlined, CrownOutlined, WindowsOutlined, DotChartOutlined, CameraOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import type { MenuProps } from 'antd';
import logo from '/react.svg'
import defaultAvatar from './assets/default-avatar.png'
import { Home } from './views/Home';
import { Environmental } from './views/Environmental';
import { PhotoWall } from './views/PhotoWall';
import { Monitor } from './views/Monitor';
import { Control } from './views/Control';

function App() {
  const nav = useNavigate()

  const items: Required<MenuProps>['items'][number][] = [
    {
      key: '',
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
      key: 'photo',
      label: '历时照片',
      icon: <FileImageOutlined />,
    },
    {
      key: 'control',
      label: '硬件控制',
      icon: <WindowsOutlined />,
    },
  ];

  const handleClick: MenuProps['onClick'] = (e) => {
    nav('/' + e.key)
  }

  return (
    <div className='w-full h-full flex' style={{ height: '100%' }}>
      <div className='bg-[#ffffff]' style={{ height: '56px', borderBottom: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img width={28} src={logo} />
          <span style={{ fontSize: '18px', fontWeight: '600' }}>云控智家</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size="default" src={defaultAvatar} />
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>Raphael_Hu</span>
        </div>
      </div>

      <div style={{ height: 'calc(100% - 57px)', background: '#f5f5f5', display: 'flex' }}>
        <div style={{ borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 8px' }}>
          <Menu
            style={{ width: 256, background: '#f5f5f5', border: 'none' }}
            defaultSelectedKeys={['']}
            defaultOpenKeys={['hardwareControl']}
            mode="inline"
            items={items}
            onClick={handleClick}
          />
        </div>

        <div style={{ flex: '1', overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/environmental" element={<Environmental />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/photo" element={<PhotoWall />} />
            <Route path="/control" element={<Control />} />
            <Route path="*" element={<h2>页面不存在</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
