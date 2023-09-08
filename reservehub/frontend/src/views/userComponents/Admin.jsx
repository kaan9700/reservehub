import SideBar from "../../components/SideBar.jsx";
import Dashboard from "../../components/Dashboard.jsx"
import {Layout} from 'antd';
import { useState, useEffect} from 'react'
import ProfileSettings from '../../components/ProfileSettings.jsx'
import Reservations from '../../components/Reservations.jsx'
import Store from '../../components/Store.jsx'
import {
    DashboardOutlined,
    ReadOutlined,
    SettingOutlined,
    UserOutlined,
    AppstoreOutlined,
    ShopOutlined,
} from '@ant-design/icons';

const Admin = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(() => {
        const storedValue = sessionStorage.getItem('selectedMenuItem')
        return storedValue ? storedValue : 'dashboard';
    });
    
    useEffect(()=>{
        if(selectedMenuItem != undefined){
            sessionStorage.setItem('selectedMenuItem', selectedMenuItem); 
        }

        }, [selectedMenuItem]);
    
    const handleMenuSelect = (key) => {
        setSelectedMenuItem(key);
    };
    

    const SidebarItems = [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: 'store', icon: <ShopOutlined />, label: 'Geschäft' },
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

    let content;
    switch (selectedMenuItem) {
        case 'dashboard':
            content = <Dashboard />;
            break;
        case 'store':
            content = <Store />;
            break;
        case 'reservations':
            content = <Reservations />;
            break;
        case 'profile-settings':
            content = <ProfileSettings />;
            break;
        case 'app-settings':
            content = <ProfileSettings />;
            break;
        case 'reservation-settings':
            content = <ProfileSettings />;
            break;
        default:
        content = <Dashboard />;
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

export default Admin;
