import React from 'react';
import { Card } from 'antd';
import { Typography } from 'antd';
import { TeamOutlined, CalendarOutlined, StockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const StatisticCard = ({ title, value }) => {
    return (
        <Card className="Card" style={{ borderRadius: '10px' }}>
            <div className={'statisticCard-icon'}>
                {
                    title === "Kunden" ? <TeamOutlined style={{ fontSize: '35px', color: '#318CE7' }} /> :
                        title === "Aktive Reservierungen" ? <CalendarOutlined style={{ fontSize: '35px', color: '#318CE7' }} /> :
                            <StockOutlined style={{ fontSize: '35px', color: '#318CE7' }} />
                }
            </div>
            <div className={'statisticCard-content'} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div className={'statisticCard-title-wrapper'} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    <p style={{ margin: '0' }}>{title}</p>
                </div>
                <div className={'statisticCard-value-wrapper'} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Title className={'statisticCard-value'} level={3} style={{ margin: '0' }}>{value}</Title>
                </div>
            </div>
        </Card>
    );
};

export default StatisticCard;
