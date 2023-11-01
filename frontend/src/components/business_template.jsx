import React from 'react';
import { Card, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const RestaurantProfile = ({ businessName }) => {

  const location = useLocation();

  const bgColor = 'lightgray'; // Beispiel für Header-Hintergrundfarbe

  return (
    <div>
      {/* Header Section */}
      <div style={{ backgroundColor: bgColor, padding: '20px', position: 'relative' }}>
        <Title level={4} style={{ position: 'absolute', bottom: '10px', left: '10px', color: (bgColor === 'lightgray') ? 'black' : 'white' }}>
          {businessName}
        </Title>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', padding: '20px' }}>

        {/* Infos Card */}
        <Card title="Infos" style={{ width: '30%', margin: '10px' }}>
          <p>Öffnungszeiten: 8:00 - 22:00</p>
          <p>Adresse: Musterstraße 123</p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
            Zur Karte
          </a>
        </Card>

        {/* Speisekarten Card */}
        <Card title="Speisekarten" style={{ width: '30%', margin: '10px' }}>
          <Text>Speisekarte folgt...</Text>
        </Card>

        {/* Reservieren Card */}
        <Card title="Reservieren" style={{ width: '30%', margin: '10px' }}>
          <Text>Bitte kontaktieren Sie uns für Reservierungen.</Text>
        </Card>
      </div>
    </div>
  );
}

export default RestaurantProfile;
