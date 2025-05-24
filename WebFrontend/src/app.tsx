import './App.css'
import { FileImageOutlined, CrownOutlined, WindowsOutlined, DotChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

function App() {
  const items: Required<MenuProps>['items'][number][] = [
    {
      key: 'sub1',
      label: '首页',
      icon: <CrownOutlined />,
    },
    {
      key: 'sub2',
      label: '环境信息',
      icon: <DotChartOutlined />,
      children: [
        { key: '1', label: '温度' },
        { key: '2', label: '湿度' },
      ],
    },
    {
      key: 'sub3',
      label: '实时监控',
      icon: <DotChartOutlined />,
    },
    {
      key: 'sub4',
      label: '历时照片',
      icon: <FileImageOutlined />,
    },
    {
      key: 'sub5',
      label: '硬件控制',
      icon: <WindowsOutlined />,
      children: [
        { key: '3', label: '灯具' },
        { key: '4', label: '音箱' },
        { key: '5', label: '风扇' },
        { key: '6', label: '数码管' },
      ],
    },
    {
      key: 'sub6',
      label: '个人中心',
      icon: <FileImageOutlined />,
    },
  ];

  return (
    <div className='w-full h-full flex' style={{ height: '100%' }}>
      <div className='bg-[#ffffff]' style={{ height: '56px', borderBottom: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          万家灯火
        </div>

        <div>
          <span></span>
          <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: '14px' }}>Raphael_Hu</span>
        </div>
      </div>

      <div style={{ height: 'calc(100% - 57px)', background: 'linear-gradient(#ffffff, #f5f5f5 28%)', display: 'flex' }}>
        <div style={{ borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '0px 8px' }}>
          <Menu
            style={{ width: 256, background: 'linear-gradient(#ffffff, #f5f5f5 28%)', border: 'none' }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub2']}
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
