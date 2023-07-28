
import React from 'react';
import { Card, Typography, Layout } from 'antd';
import PackageCard from '../components/PackageCard.jsx'
const { Title, Text } = Typography;
import HeaderText from "../components/HeaderText";

const ServiceView = () => {
  const packages = [
    {
      'title': 'Basis',
      'price_monthly': 25,
      'price_yearly': 250,
      'services': [
        {'name': 'Service 1', 'in_basic': true, 'in_premium': true},
        {'name': 'Service 2', 'in_basic': true, 'in_premium': true},
        {'name': 'Service 3', 'in_basic': false, 'in_premium': true},
        {'name': 'Service 4', 'in_basic': false, 'in_premium': true}
      ]
    },
    {
      'title': 'Premium',
      'price_monthly': 30,
      'price_yearly': 320,
      'services': [
        {'name': 'Service 1', 'in_basic': true, 'in_premium': true},
        {'name': 'Service 2', 'in_basic': true, 'in_premium': true},
        {'name': 'Service 3', 'in_basic': false, 'in_premium': true},
        {'name': 'Service 4', 'in_basic': false, 'in_premium': true}
      ]
    }
  ];

  return (

    <>
        <HeaderText title="Services" />
         <div className="service-view">
          <PackageCard /* ...props */ />
          <PackageCard /* ...props */ />
          <PackageCard /* ...props */ />
          <PackageCard /* ...props */ />
         </div>
     </>

    );
};

export default ServiceView;
