import {Card, Typography} from "antd";
import {GET_BUSINESSSETTINGS} from "../../api/endpoints.js";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../../auth/AuthProvider.jsx";
import {makeRequest} from "../../api/api.js";

const {Title, Text} = Typography;

const ReservationSettings = () => {
    const [businessSettings, setBusinessSettings] = useState(null);
    const {authTokens} = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            const response = await makeRequest('GET', GET_BUSINESSSETTINGS, {}, authTokens.access);
            console.log(response);
            // check if response is {}
            if (Object.keys(response).length !== 0) {
                console.log("response is not empty");
                setBusinessSettings(response);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Title level={3} className={'dashboard-title'}>Reservation Einstellungen</Title>
            <Card title="Reservierungoptionen" style={{width: '95%', margin: '0 auto'}}>
                {businessSettings == null ?

                    <Text>Keine Einstellungen vorhanden.<br/>
                        Bitte erstelle zunächst ein Geschäft.
                    </Text> :
                    <Text></Text>
                }
            </Card>
        </>

    )
}

export default ReservationSettings;