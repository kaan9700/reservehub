import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const SideBar = ({ onMenuSelect, selectedItem, items }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const defaultSelectedItem = selectedItem || items[0]?.key;

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
          selectedKeys={[defaultSelectedItem]}
          style={{ height: '100%', borderRight: 0, marginTop: 60 }}
          className='Sidebar-items-wrapper'
          items={items}
          />

      </Sider>
    </div>
    );
};

export default SideBar;

