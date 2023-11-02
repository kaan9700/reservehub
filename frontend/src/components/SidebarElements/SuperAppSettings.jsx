import {Card, Typography} from "antd";


import {GET_BUSINESSTYPE} from "../../api/endpoints.js";
import DataEditor from "../DataEditor.jsx";

const {Title, Text} = Typography;

const SuperAppSettings = () => {
    return (
        <>
            <Title level={3} className={'dashboard-title'}>App Einstellungen</Title>
            <Card title="Reservierungen" style={{width: '95%', margin: '0 auto'}}>
                <DataEditor ENDPOINT={GET_BUSINESSTYPE}/>
            </Card>
        </>

    )
}

export default SuperAppSettings;