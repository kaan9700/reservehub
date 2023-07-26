import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, ReadOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const { Sider } = Layout;

const items = [
  { key: '/user', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/reservations', icon: <ReadOutlined />, label: 'Reservierungen' },
  { key: '/user/options', icon: <SettingOutlined />, label: 'Optionen' },
  {
    key: 'sub4',
    icon: <MenuOutlined />,
    label: 'Geschäft',
    items: new Array(4).fill(null).map((_, j) => {
      const subKey = '4_' + (j + 1);
      return { key: subKey, label: `option${subKey}` };
    }),
  },
];

const SideBar = () => {

  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState("/");

  useEffect(() => {
    const pathName = location.pathname;
    setSelectedKeys(pathName);
    }, [location.pathname]);


  const MenuList = items.map(item =>
    item.children ? (
      {...item, children: item.children.map(child => ({...child, icon: null}))}
    ) : (
      {...item}
    )
  );
  const navigate = useNavigate();
  return (
    <div className={'sidebar-wrapper'}>
      <Sider width={200} className={'sidebar'}>
        <Menu
          onClick={(item) => {

            navigate(item.key);
        }}
          mode="inline"
          selectedKeys={selectedKeys}
          style={{ height: '100%', borderRight: 0 }}
          items={MenuList}
        />
      </Sider>
    </div>
    );
};

export default SideBar;
