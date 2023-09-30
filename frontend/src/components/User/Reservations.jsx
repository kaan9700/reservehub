import {Typography, Layout} from 'antd';

const {Title} = Typography;
const {Content} = Layout;

const Reservations = () =>{
    
    
    return (
        <>
        <Title level={3} className={'dashboard-title'} style={{textAlign: 'left', marginLeft: '10px'}}>Reservierungen</Title>
        <Content style={{padding: '0 50px', color: 'black'}}>
            TEST ALDER
        </Content>
        </>
    )
}

export default Reservations