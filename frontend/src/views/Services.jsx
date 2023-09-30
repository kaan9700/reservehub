import React, { useState, useEffect } from 'react';
import {Typography, Layout, Collapse, Divider} from 'antd';
import PackageCard from '../components/PackageCard.jsx'
import HeaderText from "../components/HeaderText";
import {Link} from 'react-router-dom';
import { makeRequest } from '../api/api';
import {GET_PLANS} from "../api/endpoints.js";  // Importieren Sie Ihre API-Funktion

const {Panel} = Collapse;

const ServiceView = () => {
    const [packages, setPackages] = useState([]);  // Zustand für Packages initialisieren

    useEffect(() => {
        // Definieren Sie eine asynchrone Funktion innerhalb des useEffect
        const fetchData = async () => {
            try {
                const data = await makeRequest('GET', GET_PLANS);
                setPackages(data);  // Zustand aktualisieren
            } catch (error) {
                console.error('Fehler beim Abrufen der Paketdaten:', error);
            }
        };

        fetchData();  // Funktion aufrufen
    }, []);  // [] sorgt dafür, dass der Effekt nur beim ersten Rendering ausgeführt wird



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
