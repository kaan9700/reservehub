
import React from 'react';
import {Typography, Layout } from 'antd';
import PackageCard from '../components/PackageCard.jsx'
import HeaderText from "../components/HeaderText";
import { Link } from 'react-router-dom';


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

    <>
        <HeaderText title="Services" />
         <div className="service-view">
           {packages.map((data) =>{
             return (
               <Link key={data.id} to={`/service/${data.id}`}>
                 <PackageCard key={data.id} service_package={data}/>
               </ Link>

               )
           })}
         </div>
     </>

    );
};

export default ServiceView;
