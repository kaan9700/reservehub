import React, {useState, useEffect} from 'react';
import {Typography, Layout, Collapse, Divider} from 'antd';
import PackageCard from '../components/PackageCard.jsx'
import HeaderText from "../components/HeaderText";
import {makeRequest} from '../api/api';
import {GET_PLANS} from "../api/endpoints.js";

const {Panel} = Collapse;

const ServiceView = () => {
    const [packages, setPackages] = useState([]);


    useEffect(() => {
        // Definieren Sie eine asynchrone Funktion innerhalb des useEffect
        const fetchData = async () => {
            try {
                // Abrufen der Pakete
                const packageData = await makeRequest('GET', GET_PLANS);
                setPackages(packageData);  // Zustand für Packages aktualisieren

            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
    }, []);

    const items = [
  {
    key: '1',
    label: 'Frage 1',
    children: <p>hi</p>,
  },
  {
    key: '2',
    label: 'Frage 2',
    children: <p>text</p>,
  },
  {
    key: '3',
    label: 'Frage 3',
    children: <p>text2</p>,
  },
];



    return (
        <div className={'services-wrapper'} style={{display: 'flex', flexDirection: 'column', position: "relative"}}>
            <HeaderText title="Services"/>

            <div className="service-view">
                {packages.map((data) => {
                    return (
                        <PackageCard key={data.id} service_package={data} viewState={false} />
                    )
                })}
            </div>


            <div
                style={{paddingBottom: '20px', width: "100%"}}>
                <Divider orientation="left" style={{marginTop: '20px', marginBottom: '20px'}}>FAQ</Divider>
                <Collapse items={items} />;
            </div>

        </div>
    );
};

export default ServiceView;
