import {useContext, useState} from 'react';
import {Button, Typography, Divider, Alert} from 'antd';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {makeRequest} from "../api/api.js";
import Notifications from "../components/Notifications.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {DELETE_ACCOUNT_CONFIRM} from "../api/endpoints.js";
import LoadingIcon from "../components/Loader.jsx";
import AuthContext from "../auth/AuthProvider.jsx";

const {Title} = Typography;

const DeleteAccountPage = () => {
    const [loading, setLoading] = useState(false);
    const {uid, token} = useParams();
    const endpoint = DELETE_ACCOUNT_CONFIRM + uid + '/' + token + '/';
    const {logoutUser} = useContext(AuthContext)
    const handleDelete = async () => {
        setLoading(true);
        try {
            // Sie müssen diese API-Anforderung entsprechend Ihrer Backend-Logik ändern
            await makeRequest('POST', endpoint);

            Notifications('success', {
                'message': 'Erfolg',
                'description': 'Dein Konto wurde erfolgreich geschlossen.'
            });
            logoutUser()
        } catch (error) {
            Notifications('error', {'message': 'Fehler', 'description': error.message});
        }
        setLoading(false);
    };

    return (
        <div style={{padding: '40px'}}>
            <Typography>
                <Title level={2}>Account löschen</Title>
                <Divider/>
                <Alert
                    type="warning"
                    message="Wichtige Information"
                    description="Wenn Sie Ihren Account löschen, werden alle damit verbundenen Daten unwiderruflich entfernt. Dies umfasst Ihre Profildaten, Beiträge, Kommentare und jegliche andere Aktivitäten. Überlegen Sie es sich gut, bevor Sie fortfahren, da dieser Vorgang nicht rückgängig gemacht werden kann."
                    showIcon
                    icon={<ExclamationCircleOutlined/>}
                    style={{marginBottom: '20px'}}
                />
                <Button type="primary" danger onClick={handleDelete}>
                    {loading ? (
                            <LoadingIcon/>
                        ) : ('Account endgültig löschen')}

                </Button>
            </Typography>
        </div>
    );
};

export default DeleteAccountPage;
