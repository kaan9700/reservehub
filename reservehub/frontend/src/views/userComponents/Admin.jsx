
import SideBar from "../../components/SideBar.jsx";
import Dashboard from "../../components/Dashboard.jsx"
import {Layout} from 'antd';
import { useState, useEffect} from 'react'
import ProfileSettings from '../../components/ProfileSettings.jsx'
import Reservations from '../../components/Reservations.jsx'


const Admin = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(()=> {
        sessionStorage.getItem('selectedMenuItem') ? sessionStorage.getItem('selectedMenuItem') :'dashboard';
    });
    
    useEffect(()=>{
        if(selectedMenuItem != undefined){
            sessionStorage.setItem('selectedMenuItem', selectedMenuItem); 
        }

        }, [selectedMenuItem]);
    
    const handleMenuSelect = (key) => {
        setSelectedMenuItem(key);
    };
    
    let content;
    switch (selectedMenuItem) {
        case 'dashboard':
            content = <Dashboard />;
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
                    <SideBar onMenuSelect={handleMenuSelect} selectedItem={selectedMenuItem}/>
                    <div className={'content'}>
                        <Layout style={{height: '100%'}}>
                            {content}
                        </Layout>
                    </div>
                </div>
            );
};

export default Admin;
