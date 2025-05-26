import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FileImageOutlined, CrownOutlined, WindowsOutlined, DotChartOutlined, CameraOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import type { MenuProps } from 'antd';
import logo from '/react.svg'
import defaultAvatar from './assets/default-avatar.png'
import { Home } from './views/Dashboard/Home';
import { Environmental } from './views/Dashboard/Environmental';
import { PhotoWall } from './views/Dashboard/PhotoWall';
import { Monitor } from './views/Dashboard/Monitor';
import { Lamp } from './views/Control/Lamp';
import { Speakers } from './views/Control/Speakers';
import { Fan } from './views/Control/Fan';
import { DigitalTube } from './views/Control/DigitalTube';

function App() {
  const nav = useNavigate()

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

      <div style={{ height: 'calc(100% - 57px)', background: 'linear-gradient(#ffffff, #f5f5f5 28%)', display: 'flex' }}>
        <div style={{ borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 8px' }}>
          <Menu
            style={{ width: 256, background: 'linear-gradient(#ffffff, #f5f5f5 28%)', border: 'none' }}
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['hardwareControl']}
            mode="inline"
            items={items}
            onClick={handleClick}
          />
        </div>

        <div style={{ flex: '1', padding: '32px 40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/environmental" element={<Environmental />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/photoWall" element={<PhotoWall />} />

            <Route path="/lamp" element={<Lamp />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/fan" element={<Fan />} />
            <Route path="/digitalTube" element={<DigitalTube />} />
            <Route path="*" element={<h2>页面不存在</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
