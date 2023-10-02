import StatisticCard from './StatisticCard.jsx'
import UserInfo from './UserInfo.jsx'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title as TitleJS,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import {Layout, Card, Table, Typography} from 'antd';

const {Title} = Typography;
const {Content} = Layout;


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    TitleJS,
    Tooltip,
    Legend
    );


const Dashboard = () => {
    const data = [
        {key: '1', day: 'Heute', totalReservations: 20, maxReservation: 5},
        {key: '2', day: 'Morgen', totalReservations: 15, maxReservation: 4},
        {key: '3', day: 'Übermorgen', totalReservations: 18, maxReservation: 6},
        ];

    const columns = [
        {title: 'Tag', dataIndex: 'day', key: 'day'},
        {title: 'Gesamtanzahl Reservierungen', dataIndex: 'totalReservations', key: 'totalReservations'},
        {title: 'Maximale Reservierung', dataIndex: 'maxReservation', key: 'maxReservation'},
        ];

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
                position: 'bottom'
            },
            title: {
                display: false,
                text: 'Reservierungen pro Monat'
            },
        },
    };
    const labels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', "August", "September", "Oktober", "November", "Dezember"];

    const dataBarChart = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => Math.random()*10),
                backgroundColor: '#318CE7',
            }
        ],
    };

    const user = {
        email: 'user@example.com',
        companyName: 'Example Company',
        phoneNumber: '123-456-7890',
        contract: 'Completed',
    };
    
    
    
    
    return (
        <>
        <Title level={3} className={'dashboard-title'} style={{textAlign: 'left', marginLeft: '10px'}}>Dashboard</Title>
        <Content style={{padding: '0 50px'}}>
            <div className={'statistic-wrapper'}>
                <StatisticCard title="Gäste" value={1000} borderColor="#blue" />
                <StatisticCard title="Aktive Reservierungen" value={20} borderColor="#green" />
                <StatisticCard title="Gäste pro Reservierung" value={4} borderColor="#red" />
            </div>
            <div className={'dashboard-visualization'}>
                <div className={'dashboard-table-wrapper'}>
                    <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Reservierungen</Title>
                    <Table className={'dashboard-reservation-table'} style={{height: '250px', width: '450px'}} pagination={false} dataSource={data} columns={columns}/>
                </div>
                <div className={'dashboard-chart-wrapper'}>
                    <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Reservierungen pro Monat</Title>
                    <Card className={'dashboard-chart-card'} style={{height: '250px', width: '450px'}}>
                        <Bar className={'dashboard-chart'} options={barChartOptions} data={dataBarChart} />
                    </Card>
                </div>
                <div className={'dashboard-userInfo-wrapper'}>
                    <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Nutzerinformationen</Title>
                    <UserInfo user={user}/>   
                </div>
                <div>
                    <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Reservierungen der Woche</Title>
                    <Card className={'dashboard-chart-card'} style={{height: '250px', width: '450px'}}>
                        <Bar className={'dashboard-chart'} options={barChartOptions} data={dataBarChart} />
                    </Card>
                </div>
            </div>
        </Content>
        </>
        );
};
export default Dashboard

