import React from 'react';
import {Typography, Layout, Collapse, Divider} from 'antd';
import PackageCard from '../components/PackageCard.jsx'
import HeaderText from "../components/HeaderText";
import {Link} from 'react-router-dom';

const {Panel} = Collapse;


const ServiceView = () => {
    const packages = [
        {
            'id': 63456345345,
            'title': 'Basis',
            'price_monthly': 25,
            'price_yearly': 250,
            'services': [
                {'name': 'Reservierungsverwaltung', 'included': true},
                {'name': 'Geschäftsstatistik', 'included': false},
                {'name': 'Geschäftspromotion', 'included': false},
                {'name': '24/7 Support', 'included': false},

            ]
        },
        {
            'id': 123123123,
            'title': 'Premium',
            'price_monthly': 30,
            'price_yearly': 320,
            'services': [
                {'name': 'Reservierungsverwaltung', 'included': true},
                {'name': 'Geschäftsstatistik', 'included': true},
                {'name': 'Geschäftspromotion', 'included': true},
                {'name': '24/7 Support', 'included': false},
            ]
        },
    ];


    return (
    <div className={'services-wrapper'} style={{ display: 'flex', flexDirection: 'column'}}>
      <HeaderText title="Services" />

      <div className="service-view" style={{ flex: 1 }}>
        {packages.map((data) => {
          return (
            <Link key={data.id} to={`/service/${data.id}`}>
              <PackageCard key={data.id} service_package={data}/>
            </Link>
          )
        })}
      </div>

      <div style={{ paddingBottom: '20px' }}> {/* Dieser Div sorgt dafür, dass der FAQ-Bereich am unteren Rand bleibt */}
        <Divider orientation="left" style={{ marginTop: '20px', marginBottom: '20px' }}>FAQ</Divider>
        <Collapse>
          <Panel header="Frage 1" key="1">
            <p>Antwort auf Frage 1</p>
          </Panel>
          <Panel header="Frage 2" key="2">
            <p>Antwort auf Frage 2</p>
          </Panel>
          <Panel header="Frage 3" key="3">
            <p>Antwort auf Frage 3</p>
          </Panel>
        </Collapse>
      </div>

    </div>
  );
};

export default ServiceView;
