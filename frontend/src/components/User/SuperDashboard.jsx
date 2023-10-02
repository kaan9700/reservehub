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
import {Bar} from 'react-chartjs-2'
import {Layout, Card, Table, Typography} from 'antd';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, {useState, useEffect} from 'react';

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


const SuperDashboard = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const data = [
        {key: '1', day: 'Heute', totalReservations: 20, maxReservation: 5},
        {key: '2', day: 'Morgen', totalReservations: 15, maxReservation: 4},
        {key: '3', day: 'Übermorgen', totalReservations: 18, maxReservation: 6},
    ];

    const columns = [
        {title: 'Basis Pakete mtl.', dataIndex: 'day', key: 'day'},
        {title: 'Basis Pakete jährl.', dataIndex: 'totalReservations', key: 'totalReservations'},
        {title: 'Premium Pakete mtl.', dataIndex: 'maxReservation', key: 'maxReservation'},
        {title: 'Premium Pakete jährl.', dataIndex: 'maxReservation', key: 'maxReservation'},
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
                data: labels.map(() => Math.random() * 10),
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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <>
            <Title level={3} className={'dashboard-title'} style={{textAlign: 'left', marginLeft: '10px'}}>Hallo
                Chef</Title>
            <Content style={{padding: '0 50px'}}>

                {isMobile ? (
                    <>
                        <Slider {...sliderSettings}>
                            <StatisticCard title="Kunden" value={1000} borderColor="#blue"/>
                            <StatisticCard title="Aktive Reservierungen" value={20} borderColor="#green"/>
                            <StatisticCard title="Veränderung über den Monat" value={4} borderColor="#red"/>
                        </Slider>
                        <br/><br/>
                    </>

                ) : (
                    <div className={'statistic-wrapper'}>
                        <StatisticCard title="Kunden" value={1000} borderColor="#blue"/>
                        <StatisticCard title="Aktive Reservierungen" value={20} borderColor="#green"/>
                        <StatisticCard title="Veränderung über den Monat" value={4} borderColor="#red"/>
                    </div>
                )}


                {isMobile ? (
                    <div className={'dashboard-visuals'}>
                        <div className={'dashboard-userInfo-wrapper'}>
                            <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Nutzerinformationen</Title>
                            <UserInfo user={user}/>
                        </div>
                        <br/><br/>
                        <Slider {...sliderSettings}>
                            <div className={'dashboard-chart-wrapper'}>
                                <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Abonnements pro
                                    Monat</Title>
                                <Card className={'dashboard-chart-card'}>
                                    <Bar className={'dashboard-chart'} options={barChartOptions} data={dataBarChart}/>
                                </Card>
                            </div>
                            <div>
                                <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Abonnements der
                                    Woche</Title>
                                <Card className={'dashboard-chart-card'}>
                                    <Bar className={'dashboard-chart'} options={barChartOptions} data={dataBarChart}/>
                                </Card>
                            </div>
                        </Slider>
                    </div>
                ) : (

                    <div className={'dashboard-visualization'}>
                        <div className={'dashboard-userInfo-wrapper'}>
                            <Title level={3}
                                   style={{textAlign: 'left', marginLeft: '10px'}}>Nutzerinformationen</Title>
                            <UserInfo user={user}/>
                        </div>
                        <div className={'dashboard-chart-wrapper'}>
                            <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Abonnements pro
                                Monat
                            </Title>
                            <Card className={'dashboard-chart-card'} style={{}}>
                                <Bar className={'dashboard-chart'} options={barChartOptions} data={dataBarChart}/>
                            </Card>


                            <div>
                                <Title level={3} style={{textAlign: 'left', marginLeft: '10px'}}>Abonnements der
                                    Woche</Title>
                                <Card className={'dashboard-chart-card'} style={{}}>
                                    <Bar className={'dashboard-chart'} options={barChartOptions}
                                         data={dataBarChart}/>
                                </Card>
                            </div>
                        </div>
                    </div>)}


            </Content>
        </>
    );
};
export default SuperDashboard

