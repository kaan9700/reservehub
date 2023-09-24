import SideBar from "../../components/SideBar.jsx";
import SuperDashboard from "../../components/SuperDashboard.jsx"
import {Layout} from 'antd';
import {useState, useEffect} from 'react'
import {
  DashboardOutlined,
  ReadOutlined,
  ShopOutlined,
  SettingOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const Superadmin = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
      const storedValue = sessionStorage.getItem('selectedMenuItem')
      return storedValue ? storedValue : 'dashboard';
    });

    useEffect(() => {
        if (selectedMenuItem != undefined) {
          sessionStorage.setItem('selectedMenuItem', selectedMenuItem);
        }

    }, [selectedMenuItem]);

    const handleMenuSelect = (key) => {
        setSelectedMenuItem(key);
    };

    const SidebarItems = [
      { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
      { key: 'packages', icon: <ShopOutlined />, label: 'Pakete' },
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



    let content;
    console.log(selectedMenuItem)
    switch (selectedMenuItem) {
        case 'dashboard':
            content = <SuperDashboard />
            break;
        case 'reservations':

            break;
        case 'profile-settings':

            break;
        case 'app-settings':

            break;
        case 'reservation-settings':

            break;
        default:

    }

    return (
        <div className={'user-wrapper'}>
          <SideBar items={SidebarItems} onMenuSelect={handleMenuSelect} selectedItem={selectedMenuItem}/>
            <div className={'content'}>
                <Layout style={{height: '100%'}}>
                    {content}
                </Layout>
            </div>
        </div>
    );
};


export default Superadmin;
