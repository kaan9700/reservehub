import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ReadOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const items = [
  { key: 'dashboard', icon: React.createElement(UserOutlined), label: 'Dashboard' },
  { key: 'reservations', icon: React.createElement(ReadOutlined), label: 'Reservierungen' },
  { key: 'options', icon: React.createElement(SettingOutlined), label: 'Optionen' },
  {
    key: 'sub4',
    icon: React.createElement(MenuOutlined),
    label: 'nav 4',
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = '4_' + (j + 1);
      return { key: subKey, label: `option${subKey}` };
    }),
  },
];

const SideBar = () => {
  return (
    <div className={'sidebar-wrapper'}>
      <Sider width={200} className={'sidebar'}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          {items.map(item =>
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map(child => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
    </div>
    );
};

export default SideBar;
