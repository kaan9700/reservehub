import {
    HomeFilled,
    ReadFilled,
    ReadOutlined,
    HomeOutlined,
    CustomerServiceFilled,
    CustomerServiceOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {Menu} from "antd";
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";
import {useLocation} from "react-router-dom";
import {makePostRequest} from "../api/api";
import {LOGOUT} from "../api/endpoints";

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {isLoggedIn} = 'test';
    const authDispatch = 'test';
    const current = location.pathname.slice(1);
    
    const onClick = (e) => {
        navigate(`/${e.key}`);
    };
    

    const logout = async () => {
        const refreshToken = localStorage.getItem('refresh')
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        try {
            await makePostRequest(LOGOUT, {'refresh': refreshToken});
        } catch (e) {
            console.log(e)
        }
    };

    const handleLogout = async () => {
        if (authDispatch) {
            authDispatch({type: 'logout'});
            await logout();
            navigate("/login");
        } else {
            console.error("Auth dispatch function is undefined");
        }

    };


    const logoItem = [
        {
            label: (
                <div style={{display: "flex", alignItems: "center"}}>
                    <img
                        src={logo}
                        alt="logo"
                        style={{height: "50px", marginRight: "10px"}} // adjust as needed
                    />
                    <span style={{fontSize: "24px"}}>AuthBuilder</span>
                </div>
            ),
            key: "logo",
            disabled: true, // prevent clicking the logo
        },
    ];

    const commonItems = [
        {
            label: "Home",
            key: "home",
            icon: current === "home" ? <HomeFilled/> : <HomeOutlined/>,
        },
        {
            label: "About",
            key: "about",
            icon: current === "about" ? <ReadFilled/> : <ReadOutlined/>,
        },
        {
            label: "Services",
            key: "services",
            icon:
                current === "services" ? (
                    <CustomerServiceFilled/>
                ) : (
                    <CustomerServiceOutlined/>
                ),
        },
    ];

    const loggedInItems = [
        {
            label: "Profile",
            key: "user",
            icon: <UserOutlined/>,
        },
        {
            label: "Logout",
            key: "logout",
            icon: <LogoutOutlined/>,
            onClick: handleLogout,
        },
    ];

    const loggedOutItems = [
        {
            label: "Login",
            key: "login",
            icon: <LoginOutlined/>,

        },
        {
            label: "Register",
            key: "register",
            icon: <LoginOutlined/>,
        },
    ];

    const items = isLoggedIn
        ? [...commonItems, ...loggedInItems]
        : [...commonItems, ...loggedOutItems];

    return (
        <div
            className={'navbar'}
            style={{
                display: "flex",
                justifyContent: "center",

            }}
        >
            <Menu
                selectedKeys={[current]}
                mode="horizontal"
                items={logoItem}
                style={{
                    width: "50%",
                    alignItems: "center",
                }}
            />
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{
                    width: "50%",
                    justifyContent: "right",
                    alignItems: "center",
                    paddingRight: '5%',
                }}
            />
        </div>
    );
};

export default NavBar;
