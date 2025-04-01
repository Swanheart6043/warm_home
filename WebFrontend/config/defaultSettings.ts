import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & { pwa?: boolean; logo?: string } = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '小推云RPA运营系统',
  pwa: false,
  logo: './logo.png',
  iconfontUrl: '',
  menu: {
    locale: false
  }
};

export default Settings;
