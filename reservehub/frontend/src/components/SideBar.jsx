import { Layout, Menu } from 'antd';
import { DashboardOutlined, ReadOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
const { Sider } = Layout;

const items = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'reservations', icon: <ReadOutlined />, label: 'Reservierungen' },
  { key: 'settings', icon: <SettingOutlined />, label: 'Einstellungen' },
];

const SideBar = ({ onMenuSelect, selectedItem }) => {
  const MenuList = items.map(item =>
    item.children ? (
      {...item, children: item.children.map(child => ({...child, icon: null}))}
    ) : (
      {...item}
    )
  );
  return (
    <div className={'sidebar-wrapper'}>
      <Sider width={200} className={'sidebar'}>
        <Menu
          onClick={(item) => {

          onMenuSelect(item.key);
        }}
          mode="inline"
          selectedKeys={selectedItem}
          style={{ height: '100%', borderRight: 0 }}
          items={MenuList}
        />
      </Sider>
    </div>
    );
};

export default SideBar;
