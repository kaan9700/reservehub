import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ReadOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const items = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'reservations', icon: <ReadOutlined />, label: 'Reservierungen' },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Einstellungen',
    children: [
      { key: 'profile-settings', icon: <UserOutlined />, label: 'Profil' },
      { key: 'app-settings', icon: <AppstoreOutlined />, label: 'App' },
      { key: 'reservation-settings', icon: <ReadOutlined />, label: 'Reservierung' },
    ],
  },
];

const SideBar = ({ onMenuSelect, selectedItem }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={'sidebar-wrapper'}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginTop: 15, marginBottom: 15, position: 'absolute', left: 15, zIndex: 1 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Sider width={200} className={'sidebar'} collapsible collapsed={collapsed}>
        <Menu
          onClick={(item) => onMenuSelect(item.key)}
          mode="inline"
          selectedKeys={selectedItem}
          style={{ height: '100%', borderRight: 0, marginTop: 60 }}
          items={items}
          className='Sidebar-items-wrapper'
        />
      </Sider>
    </div>
    );
};

export default SideBar;
