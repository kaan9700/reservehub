import React, { useState } from 'react';
import { Card, Checkbox, Input, Typography, Radio, Switch, Slider } from 'antd';

const { Title, Paragraph } = Typography;

const Settings = () => {
  const [textInput, setTextInput] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState(1);
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div>
      <Card>
        <Title level={4}>App Einstellungen</Title>
        <Paragraph>Benachrichtigungen</Paragraph>
        <Checkbox checked={checkboxValue} onChange={e => setCheckboxValue(e.target.checked)}>
          Benachrichtigungen einschalten
        </Checkbox>

        <Paragraph>Thema</Paragraph>
        <Radio.Group value={radioValue} onChange={e => setRadioValue(e.target.value)}>
          <Radio value={1}>Hell</Radio>
          <Radio value={2}>Dunkel</Radio>
        </Radio.Group>
      </Card>

      <Card>
        <Title level={4}>Profil Einstellungen</Title>
        <Paragraph>Benutzername</Paragraph>
        <Input value={textInput} onChange={e => setTextInput(e.target.value)} />

        <Paragraph>Privates Konto</Paragraph>
        <Switch checked={switchValue} onChange={checked => setSwitchValue(checked)} />

        <Paragraph>Profil Sichtbarkeit</Paragraph>
        <Slider value={sliderValue} onChange={value => setSliderValue(value)} />
      </Card>
    </div>
  );
};

export default Settings;
