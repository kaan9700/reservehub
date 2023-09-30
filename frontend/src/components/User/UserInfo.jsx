import { Card, Typography } from 'antd';

const { Text } = Typography;

const UserInfo = ({ user }) => {
    return (
        <Card className={'userInfo-wrapper'} bordered={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text type="secondary">
                        <strong>Email:</strong>
                    </Text>
                    <Text type="secondary">
                        <strong>Firmenname:</strong>
                    </Text>
                    <Text type="secondary">
                        <strong>Telefonnummer:</strong>
                    </Text>
                    <Text type="secondary">
                        <strong>Vertrag:</strong>
                    </Text>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text type="secondary">{user.email}</Text>
                    <Text type="secondary">{user.companyName}</Text>
                    <Text type="secondary">{user.phoneNumber}</Text>
                    <Text type="secondary">{user.contract}</Text>
                </div>
            </div>
    </Card>
    );
};

export default UserInfo;
