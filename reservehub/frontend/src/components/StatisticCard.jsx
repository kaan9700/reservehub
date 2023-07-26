import {Card} from 'antd';
import {Typography} from 'antd';
import {TeamOutlined, CalendarOutlined, StockOutlined} from '@ant-design/icons';

const {Title} = Typography;

const StatisticCard = ({title, value}) => {
    return (
        <Card
            className="Card"
            style={{
                width: 250,
                minWidth: 250,
                borderRadius: '10px',
            }}
        >
            <div className={'statisticCard-icon'}>
                {title === "Gäste" ? <TeamOutlined style={{fontSize: '35px', color:'#318CE7'}}/>:
                title === "Aktive Reservierungen" ? <CalendarOutlined style={{fontSize: '35px', color:'#318CE7'}}/>:
                <StockOutlined style={{fontSize: '35px', color:'#318CE7'}}/>
                }
            </div>
            <div className={'statisticCard-content'}>
                <div className={'statisticCard-title-wrapper'}>
                    <p>{title}</p>     
                </div>
                <div className={'statisticCard-value-wrapper'}>
                    <Title className={'statisticCard-value'} level={3}>{value}</Title>
                </div>
            </div>
            
            {/* */}
        </Card>
        );
};

export default StatisticCard;
